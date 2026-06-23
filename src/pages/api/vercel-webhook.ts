import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

// Vercel webhook forwarder -> SendGrid with HMAC verification and optional GitHub issue creation
// Environment variables:
// - SENDGRID_API_KEY
// - SENDGRID_FROM
// - SENDGRID_TO (comma-separated)
// - SENDGRID_TEMPLATE_ID (optional) - SendGrid dynamic template id
// - VERCEL_WEBHOOK_SECRET (required for HMAC verification)
// - CREATE_GITHUB_ISSUE (optional, set to 'true' to auto-create issues)
// - GITHUB_TOKEN (required if CREATE_GITHUB_ISSUE is enabled)
// - GITHUB_REPO (owner/repo) (required if CREATE_GITHUB_ISSUE is enabled)

export const config = {
  api: {
    bodyParser: false,
  },
}

function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', (err) => reject(err))
  })
}

async function sendEmail(subject: string, text: string, html?: string, dynamicData?: any) {
  const key = process.env.SENDGRID_API_KEY
  const from = process.env.SENDGRID_FROM
  const to = process.env.SENDGRID_TO
  const template = process.env.SENDGRID_TEMPLATE_ID
  if (!key || !from || !to) throw new Error('SendGrid config missing')

  const personalizations = to.split(',').map((t) => ({ to: [{ email: t.trim() }], dynamic_template_data: dynamicData }))

  const payload: any = {
    personalizations,
    from: { email: from },
    subject,
  }

  if (template) {
    payload.template_id = template
  } else {
    payload.content = [{ type: 'text/plain', value: text }]
    if (html) payload.content.push({ type: 'text/html', value: html })
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`SendGrid error: ${res.status} ${body}`)
  }
}

async function createGitHubIssue(title: string, body: string) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  if (!token || !repo) throw new Error('GITHUB_TOKEN or GITHUB_REPO missing')
  const url = `https://api.github.com/repos/${repo}/issues`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({ title, body }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`GitHub issue creation failed: ${res.status} ${txt}`)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const raw = await getRawBody(req)

    const secret = process.env.VERCEL_WEBHOOK_SECRET
    if (secret) {
      const sigHeader = (req.headers['x-vercel-signature'] || '').toString()
      if (!sigHeader) return res.status(401).json({ error: 'Missing signature header' })
      const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex')
      if (hmac !== sigHeader) {
        return res.status(401).json({ error: 'Invalid webhook signature' })
      }
    }

    const payload = JSON.parse(raw.toString('utf8'))
    // Build a concise message using common Vercel webhook fields
    const project = payload?.project?.name || payload?.meta?.projectId || 'unknown'
    const url = payload?.url || payload?.deploymentUrl || payload?.meta?.url || 'n/a'
    const state = payload?.state || payload?.deployment?.state || payload?.type || 'n/a'
    const creator = payload?.creator?.email || payload?.creator?.name || 'unknown'
    const commit = payload?.meta?.githubCommitSha || payload?.deployment?.meta?.githubCommitSha || payload?.meta?.sha || 'n/a'

    const subject = `[Vercel] ${project} — ${state}`
    const text = `Vercel notification\n\nProject: ${project}\nState: ${state}\nURL: ${url}\nCreator: ${creator}\nCommit: ${commit}\n\nFull payload:\n${JSON.stringify(payload, null, 2)}`
    const html = `<p><strong>Project:</strong> ${project}</p><p><strong>State:</strong> ${state}</p><p><strong>URL:</strong> ${url}</p><p><strong>Creator:</strong> ${creator}</p><p><strong>Commit:</strong> ${commit}</p><pre style="white-space:pre-wrap">${JSON.stringify(payload, null, 2)}</pre>`

    await sendEmail(subject, text, html, { project, state, url, creator, commit })

    // Optionally create a GitHub issue when deployment failed
    const createIssue = (process.env.CREATE_GITHUB_ISSUE || 'false') === 'true'
    if (createIssue && ['error', 'failed', 'failure', 'canceled'].includes(String(state).toLowerCase())) {
      const title = `Vercel deployment failed: ${project}`
      const body = `A deployment for ${project} failed.\n\nState: ${state}\nURL: ${url}\nCommit: ${commit}\n\nFull payload:\n\n${JSON.stringify(payload, null, 2)}`
      try { await createGitHubIssue(title, body) } catch (e) { console.error('create issue failed', e) }
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('vercel-webhook error', err)
    return res.status(500).json({ error: err.message || 'error' })
  }
}
