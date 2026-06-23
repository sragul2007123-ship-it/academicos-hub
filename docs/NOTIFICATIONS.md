# Notification Setup

This document explains how to receive email notifications for CI failures and Vercel deployment failures.

## Vercel Deploy Notification Options

Vercel has built-in notifications (email, Slack) which are the most reliable for receiving deploy status.

Recommended options:

- Enable Vercel project notifications: go to your Vercel project → Settings → Notifications and add an email address (or team) to receive `Deployment Failed` notifications.
- Use webhook forwarding services (Zapier, Make) if you want to centralize notifications to a single inbox or service.
- Advanced: use Vercel webhooks to trigger GitHub `repository_dispatch` and have a workflow create issues or send emails.

Notes:

- Vercel emails project owners by default — ensure the Vercel account email is monitored.
- If you'd like, I can implement a serverless forwarder or GitHub Action to open issues on failed deployments — tell me which approach you prefer.
