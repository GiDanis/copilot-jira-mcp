# Advanced Configuration

## Environment Variables

### Required Variables

```bash
JIRA_URL          # Your Jira instance URL (e.g. https://your-company.atlassian.net)
JIRA_EMAIL        # Your Atlassian account email
JIRA_API_TOKEN    # Your Atlassian API token
```

### Optional Variables

```bash
JIRA_PAT          # Personal Access Token (for Jira Data Center / On-Premise)
JIRA_TIMEOUT      # API request timeout in ms (default: 30000)
```

## Local `.env` Support

The server automatically loads environment variables from a local `.env` file in the project directory when running.

Example `.env`:
```env
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=user@company.com
JIRA_API_TOKEN=your_token_here
```

## MCP Client Configurations

### GitHub Copilot CLI (`~/.copilot/mcp.json`)

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

### Claude Desktop (`claude_desktop_config.json`)

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

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

### Cursor (`~/.cursor/mcp.json`)

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

## JQL Configuration & Aliases

Create shell shortcuts for common queries:

**Windows (PowerShell):**
```powershell
# Add to $PROFILE
function My-Tickets { copilot "assignee = currentUser() AND status != Done" }
function Team-Bugs { copilot "project = PROJ AND type = Bug AND status = Open" }
function Sprint-Status { copilot "sprint in openSprints() AND assignee = currentUser()" }
```

**Mac/Linux (Bash/Zsh):**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias my-tickets='copilot "assignee = currentUser() AND status != Done"'
alias team-bugs='copilot "project = PROJ AND type = Bug AND status = Open"'
alias sprint-status='copilot "sprint in openSprints() AND assignee = currentUser()"'
```

---

**Need more customization?** [Open a discussion](https://github.com/GiDanis/copilot-jira-mcp/discussions)
