# Advanced Configuration

## Environment Variables

### Required Variables

```bash
JIRA_URL          # Your Jira instance URL
JIRA_EMAIL        # Your Jira account email
JIRA_API_TOKEN    # Your Jira API token
```

### Optional Variables

```bash
JIRA_TIMEOUT      # API request timeout in ms (default: 30000)
JIRA_MAX_RESULTS  # Default max results for searches (default: 50)
DEBUG             # Enable debug logging (set to '*' or 'jira:*')
```

## MCP Configuration

### Basic Configuration

The MCP server is registered in `~/.copilot/mcp.json`:

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_EMAIL": "${JIRA_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

### Advanced Configuration

#### Custom Timeout

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_EMAIL": "${JIRA_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}",
        "JIRA_TIMEOUT": "60000"
      }
    }
  }
}
```

#### Debug Mode

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "${JIRA_URL}",
        "JIRA_EMAIL": "${JIRA_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}",
        "DEBUG": "jira:*"
      }
    }
  }
}
```

## Multiple Jira Instances (Future)

Currently not supported, but planned for v2.0:

```json
{
  "mcpServers": {
    "jira-work": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "https://work.atlassian.net",
        "JIRA_EMAIL": "${JIRA_WORK_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_WORK_TOKEN}"
      }
    },
    "jira-personal": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "https://personal.atlassian.net",
        "JIRA_EMAIL": "${JIRA_PERSONAL_EMAIL}",
        "JIRA_API_TOKEN": "${JIRA_PERSONAL_TOKEN}"
      }
    }
  }
}
```

## JQL Configuration

### Saved Searches

Create aliases for common JQL queries in your shell:

**Windows (PowerShell):**
```powershell
# Add to $PROFILE
function My-Tickets { copilot "assignee = currentUser() AND status != Done" }
function Team-Bugs { copilot "project = IIAB AND type = Bug AND status = Open" }
function Sprint-Status { copilot "sprint in openSprints() AND assignee = currentUser()" }
```

**Mac/Linux (Bash/Zsh):**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias my-tickets='copilot "assignee = currentUser() AND status != Done"'
alias team-bugs='copilot "project = IIAB AND type = Bug AND status = Open"'
alias sprint-status='copilot "sprint in openSprints() AND assignee = currentUser()"'
```

## API Rate Limiting

Jira Cloud API limits:
- **Free tier**: ~100 requests/minute
- **Standard**: ~1000 requests/minute
- **Premium**: ~5000 requests/minute

If you hit rate limits:
1. Reduce query frequency
2. Use more specific JQL
3. Contact Jira admin to increase limits

## Security Hardening

### 1. Dedicated API Token

Create a separate token just for this tool:
- Name: "Copilot MCP Server"
- Permissions: Read-only
- Expiration: Set 90-day rotation

### 2. Restricted Permissions

In Jira admin panel:
- Create read-only user (if possible)
- Limit project visibility
- Audit token usage regularly

### 3. Network Security

For enterprise environments:
```bash
# Use proxy
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

### 4. Encrypted Storage (Advanced)

Instead of plain environment variables, use encrypted storage:

**Windows Credential Manager:**
```powershell
cmdkey /add:JIRA_TOKEN /user:jira /pass:your-token
```

**macOS Keychain:**
```bash
security add-generic-password -a jira -s JIRA_TOKEN -w your-token
```

**Linux Secret Service:**
```bash
secret-tool store --label='Jira Token' jira token
```

Then modify `src/index.js` to retrieve from secure storage.

## Performance Tuning

### Caching (Future Feature)

Enable local caching for frequently accessed tickets:

```bash
export JIRA_CACHE_ENABLED=true
export JIRA_CACHE_TTL=300  # 5 minutes
```

### Parallel Requests

For batch operations, enable concurrent requests:

```bash
export JIRA_CONCURRENT_REQUESTS=5
```

## Custom Fields

To query custom fields, find their IDs:

```bash
# Get all fields
curl https://your-jira.atlassian.net/rest/api/3/field \
  -u email:token | jq

# Use in JQL
JQL: "customfield_10001 = 'value'"
```

## Webhooks Integration (Advanced)

Set up Jira webhooks to trigger Copilot analysis:

1. Jira → Settings → System → Webhooks
2. Create webhook for "Issue Created"
3. URL: Your webhook endpoint
4. Body contains issue data
5. Parse and send to Copilot

## Monitoring

### Log Analysis

Enable logging to file:

```bash
export JIRA_LOG_FILE=~/jira-mcp.log
export JIRA_LOG_LEVEL=info  # debug, info, warn, error
```

### Metrics Collection

Track API usage:

```bash
export JIRA_METRICS_ENABLED=true
export JIRA_METRICS_FILE=~/jira-metrics.json
```

## Backup Configuration

Backup your settings:

```bash
# Windows
reg export HKCU\Environment jira-config-backup.reg

# Mac/Linux
env | grep JIRA > jira-config-backup.txt
```

## Disaster Recovery

If you lose configuration:

1. Restore from backup
2. Re-run setup wizard: `npm run setup`
3. Re-register MCP: `npm run register`
4. Test connection: `copilot "test jira connection"`

---

**Need more customization?** [Open a discussion](https://github.com/gdanise/copilot-jira-mcp/discussions)
