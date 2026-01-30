# 🎫 Copilot Jira MCP Server

[![npm version](https://img.shields.io/npm/v/copilot-jira-mcp.svg)](https://www.npmjs.com/package/copilot-jira-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/copilot-jira-mcp.svg)](https://nodejs.org)

> **Official MCP (Model Context Protocol) server for seamless Jira integration with GitHub Copilot CLI**

Interact with Jira issues, search tickets, and manage your workflow directly from GitHub Copilot CLI using natural language!

---

## ✨ Features

- 🔍 **Smart Search** - Search Jira tickets using JQL or natural language
- 📝 **Issue Details** - Get comprehensive information about any ticket
- 💬 **Comments** - Read and analyze issue comments
- 🔗 **Subtasks & Links** - Navigate issue hierarchies
- 📎 **Attachments** - List and access issue attachments
- 👤 **My Issues** - Quick access to your assigned tickets
- 🚀 **Fast & Lightweight** - Minimal dependencies, maximum performance
- 🔐 **Secure** - Credentials stored safely in environment variables
- 🌍 **Universal** - Works with any Jira instance (Cloud or Server)
- 🎯 **AI-Powered** - Let Copilot understand and query your Jira naturally

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org))
- **GitHub Copilot CLI** ([Setup Guide](https://githubnext.com/projects/copilot-cli))
- **Jira Account** with API access

### Installation

#### Option 1: Install from GitHub (Recommended) ⭐

```bash
# Install globally from GitHub
npm install -g git+https://github.com/GiDanis/copilot-jira-mcp.git

# Run interactive setup
npx jira-mcp setup
```

#### Option 2: Clone and Install

```bash
# Clone repository
git clone https://github.com/GiDanis/copilot-jira-mcp.git
cd copilot-jira-mcp

# Install dependencies
npm install

# Run setup wizard
npm run setup

# Register with Copilot
npm run register
```

#### Option 3: NPM Package

```bash
# Install from NPM
npm install -g copilot-jira-mcp
```

### Configuration

The setup wizard will guide you through:

1. **Jira URL** - Your Jira instance URL (e.g., `https://your-company.atlassian.net`)
2. **Email** - Your Jira account email
3. **API Token** - Generate at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

Credentials are stored securely in environment variables:
- `JIRA_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`

---

## 📖 Usage

Once installed, simply open Copilot and use natural language:

```bash
copilot
```

### Example Queries

**Get your tickets:**
```
> Show me my assigned Jira tickets
```

**Search issues:**
```
> Search Jira for open bugs in project IIAB
> Find all high priority tickets in sprint 23
> Show me tickets updated in the last week
```

**Get ticket details:**
```
> Get details for IIAB-12345
> Show me comments on ticket PROJ-789
> List subtasks for IIAB-456
```

**Advanced JQL:**
```
> Search Jira with JQL: project = IIAB AND status = "In Progress"
```

---

## 🛠️ Available Tools

The MCP server exposes these tools to Copilot:

| Tool | Description |
|------|-------------|
| `jira_search` | Search issues using JQL |
| `jira_get_issue` | Get detailed ticket information |
| `jira_get_comments` | Retrieve all comments |
| `jira_get_subtasks` | List all subtasks |
| `jira_get_attachments` | List attachments |
| `jira_get_my_issues` | Get your assigned tickets |

---

## 🔐 Security

**Your credentials are NEVER committed or shared!**

✅ Stored in environment variables  
✅ `.gitignore` prevents accidental commits  
✅ No plaintext storage  
✅ API tokens can be revoked anytime  

**Best Practices:**
- Generate dedicated API tokens (don't reuse)
- Revoke tokens when not needed
- Never share `.env` files
- Use different tokens for different machines

See [SECURITY.md](SECURITY.md) for complete security guidelines.

---

## 📚 Documentation

- [Installation Guide](docs/installation.md) - Detailed setup instructions
- [Configuration](docs/configuration.md) - Advanced configuration options
- [Usage Examples](docs/usage.md) - More query examples
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions
- [Contributing](CONTRIBUTING.md) - How to contribute

---

## 🔧 Manual Configuration

If you prefer manual setup:

### Windows (PowerShell)

```powershell
# Set environment variables
[Environment]::SetEnvironmentVariable("JIRA_URL", "https://your-company.atlassian.net", "User")
[Environment]::SetEnvironmentVariable("JIRA_EMAIL", "your.email@company.com", "User")
[Environment]::SetEnvironmentVariable("JIRA_API_TOKEN", "your-token-here", "User")

# Restart terminal
```

### Mac/Linux (Bash/Zsh)

```bash
# Add to ~/.bashrc or ~/.zshrc
export JIRA_URL="https://your-company.atlassian.net"
export JIRA_EMAIL="your.email@company.com"
export JIRA_API_TOKEN="your-token-here"

# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

### Register MCP Server

Edit `~/.copilot/mcp.json`:

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

---

## 🐛 Troubleshooting

### "Missing Jira configuration" Error

**Solution:** Run the setup wizard:
```bash
npm run setup
```

### "Authentication failed" Error

**Causes:**
- Invalid API token
- Incorrect email
- Wrong Jira URL

**Solution:** Regenerate API token and run setup again.

### MCP Server Not Found

**Solution:** Re-register the server:
```bash
npm run register
```

For more help, see [Troubleshooting Guide](docs/troubleshooting.md).

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas we'd love help with:**
- 🌐 Internationalization
- 📱 Additional Jira features (transitions, creating tickets, etc.)
- 🧪 Test coverage
- 📖 Documentation improvements
- 🐛 Bug fixes

---

## 📜 License

MIT © 2026 Giuseppe Danise

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/anthropics/mcp)
- Inspired by the awesome GitHub Copilot CLI
- Thanks to the Jira REST API team

---

## ⭐ Support

If this project helps you, please give it a ⭐ on GitHub!

**Issues?** [Report them here](https://github.com/GiDanis/copilot-jira-mcp/issues)  
**Questions?** [Start a discussion](https://github.com/GiDanis/copilot-jira-mcp/discussions)

---

## 🔗 Links

- [GitHub Repository](https://github.com/GiDanis/copilot-jira-mcp)
- [NPM Package](https://www.npmjs.com/package/copilot-jira-mcp) (Coming Soon)
- [Jira REST API Docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

**Made with ❤️ for developers who love automation**

