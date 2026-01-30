# Security Policy

## 🔐 Security Best Practices

### Credential Storage

This project uses **environment variables** to store sensitive credentials. This is a security best practice because:

✅ **No plaintext files** - Credentials are not stored in files that could be accidentally committed  
✅ **User-scope only** - Variables are stored at user level, not system-wide  
✅ **Revocable** - API tokens can be revoked at any time from Atlassian  
✅ **Isolated** - Each user has their own credentials  

### What Gets Stored

Three environment variables are used:

1. `JIRA_URL` - Your Jira instance URL (not sensitive)
2. `JIRA_EMAIL` - Your Jira email (low sensitivity)
3. `JIRA_API_TOKEN` - Your API token (**HIGH SENSITIVITY**)

### Token Security

**DO:**
- ✅ Generate tokens at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- ✅ Use unique tokens for different machines
- ✅ Revoke tokens when no longer needed
- ✅ Set expiration dates if possible
- ✅ Rotate tokens periodically (every 90 days recommended)

**DON'T:**
- ❌ Share your API token with anyone
- ❌ Commit tokens to version control
- ❌ Store tokens in plaintext files
- ❌ Reuse tokens across multiple applications
- ❌ Email or message tokens

### File Security

The following files are **NEVER** committed (enforced by `.gitignore`):

```
.env
.env.local
*-config.json
*secret*
*token*
*credential*
*.pem
*.key
```

### Network Security

All communication with Jira uses:
- ✅ **HTTPS only** - No plaintext transmission
- ✅ **Basic Auth** - Token encoded in Base64 (industry standard)
- ✅ **TLS 1.2+** - Modern encryption protocols

## 🚨 Reporting Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email: [your-email@example.com] with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within **48 hours** and work on a fix promptly.

## 🔒 Revoking Compromised Tokens

If you suspect your token has been compromised:

1. **Immediately revoke** the token at:  
   https://id.atlassian.com/manage-profile/security/api-tokens

2. **Generate a new token**

3. **Run setup again:**
   ```bash
   npm run setup
   ```

4. **Review access logs** in Jira admin panel

## 🛡️ Security Updates

We take security seriously:

- Dependencies are regularly audited with `npm audit`
- Security patches are applied promptly
- CVE notifications are monitored
- Breaking security issues trigger immediate patch releases

## 📋 Compliance

This project follows:
- **OWASP Top 10** security guidelines
- **CIS** security benchmarks
- **NIST** Cybersecurity Framework recommendations

## 🔍 Auditing

To audit dependencies for vulnerabilities:

```bash
npm audit
npm audit fix  # Apply automatic fixes
```

## 🤝 Security Checklist for Contributors

Before submitting a PR:

- [ ] No hardcoded credentials
- [ ] No sensitive data in logs
- [ ] Dependencies are up-to-date
- [ ] `npm audit` passes with no high/critical issues
- [ ] Input validation on all user inputs
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS is enforced for all API calls

---

**Security is a shared responsibility. Stay vigilant! 🛡️**
