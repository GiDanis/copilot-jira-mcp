# Troubleshooting Guide

Common issues and solutions for Copilot Jira MCP.

## Quick Self-Diagnostic

Run the built-in diagnostic tool to test your environment and Jira credentials:

```bash
npx copilot-jira-mcp test
```

---

## Installation Issues

### "npm: command not found"

**Cause:** Node.js/npm not installed

**Solution:**
1. Download Node.js from https://nodejs.org
2. Install LTS version (v18 or higher)
3. Restart terminal
4. Verify: `node --version` and `npm --version`

---

### "Permission denied" (EACCES)

**Cause:** Insufficient permissions for global npm install

**Solution (Windows):**
```powershell
# Run PowerShell as Administrator
npm install -g copilot-jira-mcp
```

**Solution (Mac/Linux):**
```bash
# Configure npm prefix for user directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g copilot-jira-mcp
```

---

## Configuration & Credentials

### "Missing Jira configuration"

**Cause:** Environment variables not set

**Solution:**
```bash
# Run setup wizard
npm run setup
```
Or create a `.env` file in the project folder:
```env
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-token
```

---

### "Authentication failed (401)"

**Cause:** Invalid credentials

**Possible reasons:**
1. Incorrect email
2. Expired/invalid API token
3. Wrong Jira URL

**Solution:**
1. Verify email matches your Atlassian account
2. Generate new API token at https://id.atlassian.com/manage-profile/security/api-tokens
3. Run `npm run setup` again
4. Ensure Jira URL has no trailing slash (e.g., `https://company.atlassian.net`)

---

### "Authentication failed (403)"

**Cause:** Account lacks permissions or SSO session expired

**Solution:**
1. Ensure you have active Jira access via browser
2. Check if your account requires Atlassian SSO / 2FA verification
3. Verify project permissions in Jira

---

## Client Integration Issues

### "Copilot or Claude doesn't recognize Jira commands"

**Cause:** MCP server not registered or client was not restarted

**Solution:**
```bash
# Re-register server across clients
npm run register

# Verify registration
cat ~/.copilot/mcp.json
```
Restart your IDE / Copilot session / Claude Desktop completely.

---

### "Server crashed" or "Connection refused"

**Cause:** Server failed to start

**Solution:**
```bash
# Test starting server directly:
node src/index.js
```

---

## Query Issues

### "Invalid JQL"

**Cause:** Syntax error in JQL query

Common mistakes:
```
❌ status = open          → ✅ status = "Open" (quotes needed for multi-word or exact status)
❌ assignee = me          → ✅ assignee = currentUser()
❌ project = proj         → ✅ project = PROJ (case-sensitive)
```

---

## Getting Help

Still stuck? Here's how to get help:

1. **Check Documentation:**
   - [Installation Guide](installation.md)
   - [Configuration Guide](configuration.md)
   - [Usage Examples](usage.md)

2. **Search Issues:**
   - [GitHub Issues](https://github.com/GiDanis/copilot-jira-mcp/issues)

3. **Open a Discussion:**
   - [GitHub Discussions](https://github.com/GiDanis/copilot-jira-mcp/discussions)

4. **Report a Bug:**
   - [New Issue](https://github.com/GiDanis/copilot-jira-mcp/issues/new)
