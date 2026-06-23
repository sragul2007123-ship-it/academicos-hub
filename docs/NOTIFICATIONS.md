# Notification Setup

This document explains how to receive email notifications for CI failures and Vercel deployment failures.

## 1) GitHub Actions Email Alerts (done)

A workflow `notify-on-failure.yml` is installed which triggers when any GitHub Actions workflow run completes with `failure`.

Required repository secrets (set in GitHub > Settings > Secrets):
- `SMTP_SERVER` — SMTP host (e.g. smtp.gmail.com)
- `SMTP_PORT` — SMTP port (e.g. 587)
- `SMTP_USERNAME` — SMTP username
- `SMTP_PASSWORD` — SMTP password or app password
- `NOTIFY_FROM` — From email address
- `NOTIFY_TO` — Recipient email address (can be comma-separated)

The workflow sends a short email with the workflow name, branch, run URL and commit.

## 2) Vercel Deploy Notification Options

Vercel has built-in notifications (email, Slack) which are the most reliable for receiving deploy status.

Recommended options:

A) Enable Vercel project notifications:
- Go to your Vercel project → Settings → Notifications.
- Add an email address (or team) to receive `Deployment Failed` notifications.

B) Use Vercel Webhooks + a forwarder service:
- Create a Vercel webhook for `Deployment Created` / `Deployment Failed`.
- Point the webhook to a webhook-to-email service (e.g., Zapier, Make) or to your own endpoint that sends mail via SendGrid or SMTP.

C) Trigger GitHub repository_dispatch from Vercel webhook (advanced):
- Use the Vercel webhook to call the GitHub REST `repository_dispatch` endpoint with a PAT.
- Add a workflow in this repo that listens to `repository_dispatch` and sends an email (or opens an issue).

Notes:
- Vercel also emails project owners by default — ensure the Vercel account email is one you monitor.
- If you prefer centralized emails from GitHub and Vercel to the same inbox, use a webhook forwarder.

## 3) Next Steps I can do for you
- Configure a serverless `/api/vercel-webhook` endpoint that accepts Vercel webhooks and forwards email using SendGrid (requires SendGrid API key in secrets). I can implement and deploy it in this repo.
- Set up a GitHub Action to create an issue when Vercel reports a failed deployment (requires a webhook-to-GitHub approach).

Tell me which option you prefer and I will implement it.
