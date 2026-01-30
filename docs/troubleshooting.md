# Troubleshooting Guide

Common issues and solutions for Copilot Jira MCP.

## Installation Issues

### "npm: command not found"

**Cause:** Node.js/npm not installed

**Solution:**
1. Download Node.js from https://nodejs.org
2. Install LTS version
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
# Option 1: Use sudo (quick but not recommended)
sudo npm install -g copilot-jira-mcp

# Option 2: Configure npm prefix (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g copilot-jira-mcp
```

---

### "Cannot find module '@modelcontextprotocol/sdk'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd copilot-jira-mcp
npm install
```

---

## Configuration Issues

### "Missing Jira configuration"

**Cause:** Environment variables not set

**Solution:**
```bash
# Run setup wizard
npm run setup

# Or set manually (Windows)
[Environment]::SetEnvironmentVariable("JIRA_URL", "https://...", "User")
[Environment]::SetEnvironmentVariable("JIRA_EMAIL", "...", "User")
[Environment]::SetEnvironmentVariable("JIRA_API_TOKEN", "...", "User")

# Restart terminal
```

---

### "Authentication failed (401)"

**Cause:** Invalid credentials

**Possible reasons:**
1. Incorrect email
2. Expired/invalid API token
3. Wrong Jira URL

**Solution:**
1. Verify email is correct
2. Generate new API token at https://id.atlassian.com/manage-profile/security/api-tokens
3. Run `npm run setup` again
4. Ensure Jira URL has no trailing slash

---

### "Authentication failed (403)"

**Cause:** Account lacks permissions

**Solution:**
1. Ensure you have Jira access
2. Check if account is active (not suspended)
3. Verify project permissions in Jira
4. Contact Jira admin if needed

---

### Environment Variables Not Persisting

**Windows:**
```powershell
# Verify variables are set
[Environment]::GetEnvironmentVariable("JIRA_URL", "User")

# If empty, re-run setup
npm run setup

# Restart ALL terminals and applications
```

**Mac/Linux:**
```bash
# Check if variables exist
echo $JIRA_URL

# If empty, add to shell profile
echo 'export JIRA_URL="https://..."' >> ~/.bashrc
echo 'export JIRA_EMAIL="..."' >> ~/.bashrc
echo 'export JIRA_API_TOKEN="..."' >> ~/.bashrc

# Reload
source ~/.bashrc
```

---

## Runtime Issues

### "Copilot doesn't recognize Jira commands"

**Cause:** MCP server not registered

**Solution:**
```bash
# Re-register server
npm run register

# Verify registration
cat ~/.copilot/mcp.json

# Restart Copilot
```

---

### "Server crashed" or "Connection refused"

**Cause:** Server failed to start

**Solution:**
```bash
# Check if server starts manually
node src/index.js

# If error appears, check:
# 1. Environment variables are set
# 2. No syntax errors in index.js
# 3. Dependencies installed

# Re-run setup
npm install
npm run setup
npm run register
```

---

### "Timeout" or "Network error"

**Cause:** Connection issues with Jira

**Possible reasons:**
1. No internet connection
2. VPN required but not connected
3. Firewall blocking requests
4. Jira server down

**Solution:**
```bash
# Test connection manually
curl https://your-company.atlassian.net/rest/api/3/myself \
  -H "Authorization: Basic $(echo -n 'email:token' | base64)"

# If fails:
# 1. Check internet connection
# 2. Connect to VPN if required
# 3. Check firewall settings
# 4. Try different network
```

---

### "SSL certificate error"

**Cause:** Self-signed certificates (Jira Server)

**Solution (not recommended for production):**
```bash
# Temporarily disable SSL verification
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Better: Add certificate to system trust store
```

---

### "Rate limited" (429)

**Cause:** Too many requests to Jira API

**Solution:**
1. Wait a few minutes
2. Reduce query frequency
3. Check if other apps are using same token
4. Contact Jira admin to increase limits

---

## Query Issues

### "No results found"

**Possible causes:**
1. JQL syntax error
2. No matching tickets
3. Insufficient permissions

**Solution:**
```bash
# Verify JQL in Jira UI first
# Check permissions on tickets
# Simplify query to troubleshoot
```

---

### "Invalid JQL"

**Cause:** Syntax error in query

**Solution:**
- Test JQL in Jira search bar
- Use Jira's JQL autocomplete
- Check [JQL Reference](https://www.atlassian.com/software/jira/guides/expand-jira/jql)

Common mistakes:
```
❌ status = open          → ✅ status = "Open" (quotes needed)
❌ assignee = me          → ✅ assignee = currentUser()
❌ project = iiab         → ✅ project = IIAB (case-sensitive)
```

---

### "Field not found"

**Cause:** Custom field not available or wrong name

**Solution:**
```bash
# Get field names via API
curl https://your-company.atlassian.net/rest/api/3/field \
  -H "Authorization: Basic $(echo -n 'email:token' | base64)"

# Use correct field ID (e.g., customfield_10001)
```

---

## Platform-Specific Issues

### Windows: "Cannot load module"

**Cause:** Path issues with backslashes

**Solution:**
Edit `~/.copilot/mcp.json` and use forward slashes:
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["C:/Users/YourName/path/to/index.js"]
    }
  }
}
```

---

### Mac: "Operation not permitted"

**Cause:** macOS security restrictions

**Solution:**
1. System Preferences → Security & Privacy
2. Grant Terminal full disk access
3. Restart terminal

---

### Linux: "Command not found" after install

**Cause:** npm global bin not in PATH

**Solution:**
```bash
# Find npm global bin path
npm config get prefix

# Add to PATH
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc
```

---

## Debugging

### Enable Verbose Logging

```bash
# Set debug mode
export DEBUG=*

# Run server
node src/index.js

# Check logs in stderr
```

---

### Test Components Individually

**Test Jira Connection:**
```bash
curl https://your-jira.atlassian.net/rest/api/3/myself \
  -u "email:token"
```

**Test MCP Server:**
```bash
node src/index.js
# Should output: "Jira MCP Server started successfully"
```

**Test Copilot Integration:**
```bash
copilot
> Show me my Jira tickets
```

---

## Getting Help

Still stuck? Here's how to get help:

1. **Check Documentation:**
   - [Installation Guide](installation.md)
   - [Configuration Guide](configuration.md)
   - [Usage Examples](usage.md)

2. **Search Issues:**
   - [GitHub Issues](https://github.com/gdanise/copilot-jira-mcp/issues)
   - Someone may have had the same problem!

3. **Open a Discussion:**
   - [GitHub Discussions](https://github.com/gdanise/copilot-jira-mcp/discussions)
   - Ask questions, share experiences

4. **Report a Bug:**
   - [New Issue](https://github.com/gdanise/copilot-jira-mcp/issues/new)
   - Include:
     - OS and version
     - Node.js version (`node --version`)
     - Error messages
     - Steps to reproduce

---

## Common Questions

**Q: Do I need admin access to Jira?**  
A: No, regular user access is sufficient.

**Q: Can I use multiple Jira instances?**  
A: Not currently, but it's on the roadmap!

**Q: Is my API token stored securely?**  
A: Yes, in environment variables only. Never committed.

**Q: Can I use this with Jira Server (not Cloud)?**  
A: Yes, just use your server URL instead of `*.atlassian.net`

**Q: Does this work offline?**  
A: No, it needs internet to access Jira API.

---

**Still need help?** [Open an issue](https://github.com/gdanise/copilot-jira-mcp/issues) and we'll assist you!
