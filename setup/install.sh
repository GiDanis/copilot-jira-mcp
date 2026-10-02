#!/usr/bin/env bash

# ==============================================================================
# Copilot Jira MCP - 1-Line Quick Installer for macOS / Linux
# ==============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║             🎫 COPILOT JIRA MCP QUICK INSTALLER            ║${NC}"
echo -e "${CYAN}║     Supercharge Copilot, Claude & Cursor with Jira         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js 18 or higher from: https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version $(node -v) is too old. Required: v18 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Detected Node.js $(node -v)${NC}"

# Check npm / npx
if ! command -v npx >/dev/null 2>&1; then
    echo -e "${RED}❌ npx is not available.${NC}"
    exit 1
fi

echo -e "${YELLOW}🚀 Launching setup wizard...${NC}\n"
npx --yes copilot-jira-mcp setup
