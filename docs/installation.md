# Installation Guide

## Prerequisites

Before installing, ensure you have:

1. **Node.js 18+** installed ([Download](https://nodejs.org))
2. **Jira Account** with API access
3. **Jira API Token** (generate at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens))
4. An MCP-compatible client (**GitHub Copilot CLI**, **Claude Desktop**, or **Cursor**)

## Installation Methods

### Method 1: NPX (Zero Install, Recommended)

You can run the configuration wizard directly using `npx`:

```bash
npx copilot-jira-mcp setup
```

### Method 2: Global NPM Install

```bash
# Install globally
npm install -g copilot-jira-mcp

# Verify installation
jira-mcp --version

# Run setup wizard
jira-mcp setup
```

### Method 3: From Source

For contributors and developers:

```bash
# Clone repository
git clone https://github.com/GiDanis/copilot-jira-mcp.git
cd copilot-jira-mcp

# Install dependencies
npm install

# Run interactive setup wizard
npm run setup

# Test connection
npm test
```

## Configuration & Credentials

The setup wizard will ask for:

### 1. Jira URL
Your Jira instance URL, for example:
- `https://your-company.atlassian.net` (Jira Cloud)
- `https://jira.your-company.com` (Jira Data Center / Server)

### 2. Email Address
The email address associated with your Atlassian account.

### 3. API Token
Generate an API token:
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label (e.g., "Copilot Jira MCP")
4. Copy and paste it when prompted (input is hidden for security)

## Registration

To register the MCP server with all your local clients (GitHub Copilot CLI, Claude Desktop, and Cursor):

```bash
npm run register
```

This creates or updates:
- **Copilot CLI**: `~/.copilot/mcp.json`
- **Claude Desktop**: `claude_desktop_config.json` (macOS, Windows, Linux)
- **Cursor**: `~/.cursor/mcp.json`

## Verification

Test the installation:

```bash
# Test connection with Jira credentials
npx copilot-jira-mcp test

# Or in Copilot CLI
copilot
> Show me my assigned Jira tickets
```

---

**Need help?** [Open an issue](https://github.com/GiDanis/copilot-jira-mcp/issues)
