#!/usr/bin/env node

/**
 * Multi-Client MCP Server Registration Script
 * Registers this server with GitHub Copilot CLI, Claude Desktop, and Cursor
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const serverPath = path.resolve(path.join(__dirname, '..', 'src', 'index.js'));

/**
 * Returns configuration paths for different MCP hosts
 */
function getClientConfigs() {
  const home = os.homedir();
  const platform = os.platform();

  let claudeConfigDir;
  if (platform === 'darwin') {
    claudeConfigDir = path.join(home, 'Library', 'Application Support', 'Claude');
  } else if (platform === 'win32') {
    claudeConfigDir = path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Claude');
  } else {
    claudeConfigDir = path.join(home, '.config', 'Claude');
  }

  return [
    {
      name: 'GitHub Copilot CLI',
      dir: path.join(home, '.copilot'),
      file: path.join(home, '.copilot', 'mcp.json'),
    },
    {
      name: 'Claude Desktop',
      dir: claudeConfigDir,
      file: path.join(claudeConfigDir, 'claude_desktop_config.json'),
    },
    {
      name: 'Cursor',
      dir: path.join(home, '.cursor'),
      file: path.join(home, '.cursor', 'mcp.json'),
    },
  ];
}

/**
 * Registers the MCP server in a target config file
 */
function registerConfig(client) {
  try {
    if (!fs.existsSync(client.dir)) {
      fs.mkdirSync(client.dir, { recursive: true });
    }

    let config = {};
    if (fs.existsSync(client.file)) {
      try {
        config = JSON.parse(fs.readFileSync(client.file, 'utf8'));
      } catch {
        config = {};
      }
    }

    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    config.mcpServers.jira = {
      command: 'node',
      args: [serverPath],
      env: {
        JIRA_URL: process.env.JIRA_URL || '${JIRA_URL}',
        JIRA_EMAIL: process.env.JIRA_EMAIL || '${JIRA_EMAIL}',
        JIRA_API_TOKEN: process.env.JIRA_API_TOKEN || '${JIRA_API_TOKEN}',
      },
    };

    fs.writeFileSync(client.file, JSON.stringify(config, null, 2), 'utf8');
    log(`  ✅ Registered with ${client.name}`, 'green');
    log(`     File: ${client.file}`, 'cyan');
    return true;
  } catch (error) {
    log(`  ⚠️  Failed to register with ${client.name}: ${error.message}`, 'yellow');
    return false;
  }
}

export function registerAll() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          🔌 MULTI-CLIENT MCP SERVER REGISTRATION           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log(`\nServer script: ${serverPath}\n`, 'cyan');

  const clients = getClientConfigs();
  let registeredCount = 0;

  for (const client of clients) {
    if (registerConfig(client)) {
      registeredCount++;
    }
  }

  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log(`║      ✅ REGISTRATION COMPLETE (${registeredCount}/${clients.length} clients)      ║`, 'green');
  log('╚════════════════════════════════════════════════════════════╝', 'green');
  log('\n🚀 Restart your client (Copilot CLI, Claude Desktop, or Cursor) to use Jira tools!\n', 'green');
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  registerAll();
}
