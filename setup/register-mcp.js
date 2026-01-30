#!/usr/bin/env node

/**
 * MCP Server Registration Script
 * Registers this server with GitHub Copilot CLI
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════
// 🎨 COLORS
// ═══════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════
// 🔧 CONFIGURATION
// ═══════════════════════════════════════════════════════════

const copilotConfigDir = path.join(os.homedir(), '.copilot');
const mcpConfigFile = path.join(copilotConfigDir, 'mcp.json');
const serverPath = path.resolve(path.join(__dirname, '..', 'src', 'index.js'));

// ═══════════════════════════════════════════════════════════
// 🚀 MAIN
// ═══════════════════════════════════════════════════════════

function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║          🔌 MCP SERVER REGISTRATION                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log('');

  // Ensure .copilot directory exists
  if (!fs.existsSync(copilotConfigDir)) {
    log('📁 Creating .copilot directory...', 'yellow');
    fs.mkdirSync(copilotConfigDir, { recursive: true });
  }

  // Load or create mcp.json
  let mcpConfig = {};
  if (fs.existsSync(mcpConfigFile)) {
    log('📄 Found existing MCP configuration', 'green');
    try {
      mcpConfig = JSON.parse(fs.readFileSync(mcpConfigFile, 'utf8'));
    } catch (error) {
      log('⚠️  Could not parse existing config, creating new one', 'yellow');
    }
  } else {
    log('📄 Creating new MCP configuration', 'yellow');
  }

  // Ensure mcpServers object exists
  if (!mcpConfig.mcpServers) {
    mcpConfig.mcpServers = {};
  }

  // Check if already registered
  if (mcpConfig.mcpServers.jira) {
    log('⚠️  Jira MCP server is already registered', 'yellow');
    log(`   Current path: ${mcpConfig.mcpServers.jira.command}`, 'cyan');
    log('\n   Updating registration...', 'yellow');
  }

  // Register server
  mcpConfig.mcpServers.jira = {
    command: 'node',
    args: [serverPath],
    env: {
      JIRA_URL: '${JIRA_URL}',
      JIRA_EMAIL: '${JIRA_EMAIL}',
      JIRA_API_TOKEN: '${JIRA_API_TOKEN}'
    }
  };

  // Save configuration
  try {
    fs.writeFileSync(mcpConfigFile, JSON.stringify(mcpConfig, null, 2), 'utf8');
    log('\n✅ MCP server registered successfully!', 'green');
    log(`\n📍 Configuration saved to:`, 'cyan');
    log(`   ${mcpConfigFile}`, 'cyan');
    log(`\n📍 Server location:`, 'cyan');
    log(`   ${serverPath}`, 'cyan');
  } catch (error) {
    log(`\n❌ Failed to save configuration: ${error.message}`, 'red');
    log('\n💡 You may need to create the file manually:', 'yellow');
    log(`   ${mcpConfigFile}`, 'cyan');
    log('\nWith this content:', 'yellow');
    log(JSON.stringify(mcpConfig, null, 2), 'cyan');
    process.exit(1);
  }

  // Success message
  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log('║                    ✅ REGISTRATION COMPLETE! ✅            ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝', 'green');
  log('');
  log('🚀 Restart your terminal and you can now use Jira in Copilot!', 'green');
  log('');
  log('📝 Try these commands:', 'cyan');
  log('   copilot', 'yellow');
  log('   > Show me my assigned Jira tickets', 'yellow');
  log('   > Get details for IIAB-12345', 'yellow');
  log('   > Search Jira for open bugs in project IIAB', 'yellow');
  log('');
}

try {
  main();
} catch (error) {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
}
