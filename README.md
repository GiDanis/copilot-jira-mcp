# 🎫 Copilot Jira MCP Server

[![npm version](https://img.shields.io/npm/v/copilot-jira-mcp.svg)](https://www.npmjs.com/package/copilot-jira-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![MCP Standard](https://img.shields.io/badge/MCP-1.32.0-blue.svg)](https://modelcontextprotocol.io)

> **Universal Model Context Protocol (MCP) server for seamless Jira integration with GitHub Copilot CLI, Claude Desktop, Cursor, and modern AI coding assistants.**

Interact with Jira issues, search tickets, add comments, create and transition tasks directly from your AI assistant using natural language!

---

## ✨ Features

- 🔍 **Smart JQL Search** - Search Jira tickets using JQL or natural language with pagination
- 📝 **Issue Details & ADF Parser** - Rich Markdown parsing of Atlassian Document Format (ADF) descriptions, headings, code blocks, and lists
- 💬 **Comments** - Read discussion history and post new comments to any issue
- ⚡ **Workflow Transitions** - Move tickets across statuses (e.g. *To Do* ➔ *In Progress* ➔ *Done*)
- 🆕 **Create & Update Issues** - Create new Tasks, Bugs, Stories, and edit summaries, priorities, and labels
- 🔗 **Subtasks & Links** - Navigate issue hierarchies, subtasks, and relationships
- 👤 **My Issues** - One-click access to tickets assigned to you
- 📁 **Project Discovery** - List all accessible Jira projects and metadata
- 🔌 **Multi-Client Support** - One-command setup for **GitHub Copilot CLI**, **Claude Desktop**, and **Cursor**
- 🔐 **Secure & Private** - Zero plaintext storage, zero hardcoded credentials, full `.env` support

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org))
- **Jira Account** (Cloud or Data Center) with API token ([Create API Token](https://id.atlassian.com/manage-profile/security/api-tokens))
- An MCP-compatible client:
  - **GitHub Copilot CLI**
  - **Claude Desktop**
  - **Cursor** / **Windsurf** / **Antigravity**

---

### Installation & Setup

#### Option 1: Run via NPX (Fastest) ⭐

```bash
# Run interactive configuration wizard
npx copilot-jira-mcp setup

# Or register directly with your clients
npx copilot-jira-mcp register
```

#### Option 2: Clone and Install Locally

```bash
# 1. Clone repository
git clone https://github.com/GiDanis/copilot-jira-mcp.git
cd copilot-jira-mcp

# 2. Install dependencies
npm install

# 3. Run interactive setup wizard (tests credentials and configures clients)
npm run setup
```

#### Option 3: Global Install

```bash
npm install -g copilot-jira-mcp
jira-mcp setup
```

---

## ⚙️ Configuration

The server expects three environment variables (either set in your system shell or stored in a local `.env` file):

| Variable | Description | Example |
|---|---|---|
| `JIRA_URL` | Your Atlassian Jira instance URL | `https://your-company.atlassian.net` |
| `JIRA_EMAIL` | Account email associated with Jira | `developer@company.com` |
| `JIRA_API_TOKEN` | Jira API Token ([generate here](https://id.atlassian.com/manage-profile/security/api-tokens)) | `ATATT3xFfGF0...` |
| `JIRA_PAT` | *(Optional, for Data Center / Server)* Personal Access Token | `MTYyODc2...` |

### Manual Client Registration

You can also manually add the server to your favorite MCP client configuration:

#### GitHub Copilot CLI (`~/.copilot/mcp.json`)
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

#### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "copilot-jira-mcp", "start"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

#### Cursor (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["/path/to/copilot-jira-mcp/src/index.js"],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

---

## 🛠️ Available MCP Tools

| Tool | Action | Description |
|---|---|---|
| `jira_get_issue` | 🔍 Read | Comprehensive details of an issue (summary, markdown description, status, priority, subtasks, links) |
| `jira_search_issues` | 🔍 Read | Search issues using JQL syntax with pagination support |
| `jira_get_my_issues` | 🔍 Read | Fast query for tickets assigned to current user, optional status filter |
| `jira_get_comments` | 🔍 Read | Read discussion and comment history with author and timestamp |
| `jira_get_subtasks` | 🔍 Read | List all subtasks and child issues of a ticket |
| `jira_get_projects` | 🔍 Read | List all Jira projects accessible by the authenticated user |
| `jira_get_transitions` | 🔍 Read | Inspect available workflow transitions for an issue |
| `jira_whoami` | 🔍 Read | Verify connection and show authenticated user details |
| `jira_create_issue` | ✏️ Write | Create new issue (Task, Bug, Story) with summary, description, priority, labels |
| `jira_update_issue` | ✏️ Write | Modify existing issue summary, description, priority, or labels |
| `jira_add_comment` | ✏️ Write | Post a new comment to an issue (plain text or markdown supported) |
| `jira_transition_issue` | ⚡ Action | Move an issue to a new status (e.g., "In Progress", "Done") with optional comment |

*(Legacy tool aliases `jira_get_ticket`, `jira_search_tickets`, and `jira_get_my_tickets` remain supported for backward compatibility).*

---

## 💬 Natural Language Prompt Examples

Once registered, just talk naturally to your AI assistant:

### Checking Tickets
- *"Show me all tickets assigned to me that are In Progress"*
- *"What is issue PROJ-1234 about? Summarize the requirements and comments."*
- *"Find all high priority bugs reported in project PROJ this sprint."*

### Updating Workflow
- *"Add a comment to PROJ-1234 saying that PR #42 is ready for review."*
- *"What are the available transitions for PROJ-1234?"*
- *"Move PROJ-1234 to Done with comment 'Fixed in version 2.0.0'"*

### Creating Issues
- *"Create a Bug in project PROJ: 'Login page crashes on mobile', priority High."*
- *"Update the description of PROJ-456 to include the new API contract."*

---

## 💻 CLI Commands

The `jira-mcp` CLI provides handy commands:

```bash
# Start server manually on stdio
jira-mcp start

# Run interactive configuration wizard
jira-mcp setup

# Register with all detected MCP client configs
jira-mcp register

# Test Jira credentials and print connection info
jira-mcp test

# Show CLI options
jira-mcp --help
```

---

## 🧪 Testing & Linting

```bash
# Run automated tests
npm test

# Run code linter
npm run lint
```

---

## 🔐 Security & Privacy

- **No Plaintext Leaks:** API tokens are stored in environment variables or user-level config files.
- **`.gitignore` Protection:** Local `.env` and credential files are strictly ignored.
- **Zero Telemetry:** The server only talks directly to your configured Jira host via HTTPS.
- See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## 🤝 Contributing

Contributions are welcome! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for development workflows and guidelines.

---

## 📜 License

MIT © Giuseppe Danise — see [LICENSE](LICENSE) for details.
