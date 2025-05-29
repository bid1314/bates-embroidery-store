# Security Policy

## Supported Versions

We provide security updates for the following versions. Please keep your deployment up to date to receive important patches.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it through [GitHub Security Advisories](../../security/advisories/new) or by emailing [your-email@example.com].

- We aim to respond within 3 business days.
- Please provide as much detail as possible to help us understand and fix the issue.
- Do not publicly disclose the vulnerability before we have addressed it.

## Process

1. We will acknowledge receipt of your report.
2. We will investigate and work to address the issue.
3. If confirmed, a fix will be developed and deployed.
4. We will notify you when the issue is resolved and, if appropriate, credit your disclosure.

## Additional Security Practices

- Keep secrets (API keys, etc.) out of source control—do not commit your `.env` files!
- Dependabot is enabled to monitor dependencies for vulnerabilities.
- Please use strong, unique passwords for admin accounts.
- [Link to Next.js security best practices](https://nextjs.org/docs/advanced-features/security)
- [Link to Swell security documentation](https://developers.swell.is/docs/security)
- [Link to Vercel security resources](https://vercel.com/security)
