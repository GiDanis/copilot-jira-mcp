# ==============================================================================
# Copilot Jira MCP - 1-Line Quick Installer for Windows PowerShell
# ==============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║             🎫 COPILOT JIRA MCP QUICK INSTALLER            ║" -ForegroundColor Cyan
Write-Host "║     Supercharge Copilot, Claude & Cursor with Jira         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    Write-Host "Please install Node.js 18 or higher from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

$nodeVer = (node -v).TrimStart('v').Split('.')[0]
if ([int]$nodeVer -lt 18) {
    Write-Host "❌ Node.js version $(node -v) is too old. Required: v18 or higher." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Detected Node.js $(node -v)" -ForegroundColor Green

# Check npx
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npx is not available." -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Launching setup wizard..." -ForegroundColor Yellow
Write-Host ""

npx --yes copilot-jira-mcp setup
