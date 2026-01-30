# Installation Guide

## Prerequisites

Before installing, ensure you have:

1. **Node.js 18+** installed ([Download](https://nodejs.org))
2. **GitHub Copilot CLI** installed ([Setup Guide](https://githubnext.com/projects/copilot-cli))
3. **Jira Account** with API access
4. **Jira API Token** (generate at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens))

## Installation Methods

### Method 1: NPM (Recommended)

The easiest way to install:

```bash
# Install globally
npm install -g copilot-jira-mcp

# Verify installation
jira-mcp --version
```

### Method 2: From Source

For contributors or advanced users:

```bash
# Clone repository
git clone https://github.com/gdanise/copilot-jira-mcp.git
cd copilot-jira-mcp

# Install dependencies
npm install

# Link globally (optional)
npm link
```

### Method 3: Quick Install Script

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/gdanise/copilot-jira-mcp/main/setup/install.ps1 | iex
```

**Mac/Linux (Bash):**

```bash
curl -fsSL https://raw.githubusercontent.com/gdanise/copilot-jira-mcp/main/setup/install.sh | bash
```

## Configuration

After installation, run the interactive setup wizard:

```bash
npm run setup
```

Or if installed globally via npm:

```bash
jira-mcp setup
```

The wizard will ask for:

### 1. Jira URL

Your Jira instance URL, for example:
- `https://your-company.atlassian.net` (Jira Cloud)
- `https://jira.your-company.com` (Jira Server)

### 2. Email Address

The email associated with your Jira account.

### 3. API Token

Generate a token:
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Copilot MCP")
4. Copy the token
5. Paste it when prompted (will be hidden for security)

## Registration

After configuration, register the MCP server with Copilot:

```bash
npm run register
```

This creates/updates `~/.copilot/mcp.json` with the server configuration.

## Verification

Test the installation:

```bash
# Start Copilot
copilot

# Try a Jira query
> Show me my Jira tickets
```

If successful, you should see your assigned tickets!

## Platform-Specific Notes

### Windows

- Environment variables are set with `setx` (persistent)
- May require restarting terminal/IDE
- PowerShell 5.1+ or PowerShell Core recommended

### macOS

- Environment variables go to `~/.zshrc` (default)
- Or `~/.bash_profile` if using Bash
- Run `source ~/.zshrc` to reload

### Linux

- Environment variables go to `~/.bashrc` or `~/.zshrc`
- Run `source ~/.bashrc` to reload
- Ensure Node.js is in PATH

## Troubleshooting

### "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

### "Permission denied"

**Windows:** Run PowerShell as Administrator  
**Mac/Linux:** Use `sudo npm install -g copilot-jira-mcp`

### "Missing Jira configuration"

**Solution:** Run `npm run setup` and complete the wizard

### "Cannot find module"

**Solution:** Run `npm install` in the project directory

### "EACCES: permission denied"

**Mac/Linux:** Configure npm to install globally without sudo:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Updating

### NPM Installation

```bash
npm update -g copilot-jira-mcp
```

### Source Installation

```bash
cd copilot-jira-mcp
git pull
npm install
```

## Uninstallation

### NPM Installation

```bash
# Uninstall package
npm uninstall -g copilot-jira-mcp

# Remove environment variables (Windows)
reg delete HKCU\Environment /v JIRA_URL /f
reg delete HKCU\Environment /v JIRA_EMAIL /f
reg delete HKCU\Environment /v JIRA_API_TOKEN /f

# Remove environment variables (Mac/Linux)
# Edit ~/.bashrc or ~/.zshrc and remove export lines

# Remove MCP configuration
rm ~/.copilot/mcp.json  # Or edit to remove "jira" entry
```

## Next Steps

- Read [Usage Examples](usage.md)
- Check [Configuration Options](configuration.md)
- See [Troubleshooting Guide](troubleshooting.md)

---

**Need help?** [Open an issue](https://github.com/gdanise/copilot-jira-mcp/issues)
