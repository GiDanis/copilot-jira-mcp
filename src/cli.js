#!/usr/bin/env node

import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { startServer } from './index.js';
import { JiraClient } from './jira-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const args = process.argv.slice(2);
const isInteractiveTerminal = Boolean(process.stdin.isTTY && process.stdout.isTTY);

function printBanner() {
  console.log(`
\x1b[36m╔════════════════════════════════════════════════════════════╗
║             🎫 COPILOT JIRA MCP SERVER v${pkg.version}             ║
║  AI-Powered Jira Integration for Copilot, Claude & Cursor  ║
╚════════════════════════════════════════════════════════════╝\x1b[0m`);
}

function printHelp() {
  printBanner();
  console.log(`
\x1b[1mUsage:\x1b[0m
  jira-mcp [command]

\x1b[1mCommands:\x1b[0m
  \x1b[32mstart\x1b[0m          Start the MCP server on stdio transport (used by AI clients)
  \x1b[32msetup\x1b[0m          Run interactive configuration wizard for Jira credentials
  \x1b[32mregister\x1b[0m       Auto-register with Copilot CLI, Claude Desktop, and Cursor
  \x1b[32mtest\x1b[0m           Test connection with Jira using configured credentials
  \x1b[32mhelp, --help\x1b[0m   Show this help message
  \x1b[32m-v, --version\x1b[0m  Show package version

\x1b[1mQuick Start Examples:\x1b[0m
  npx copilot-jira-mcp setup      # One-click guided setup
  npx copilot-jira-mcp test       # Check Jira connectivity
  npx copilot-jira-mcp register   # Register to your favorite AI assistant
  npx copilot-jira-mcp start      # Run server in stdio mode
`);
}

async function runTestConnection() {
  console.log('\x1b[33m🔍 Testing Jira connection...\x1b[0m\n');
  const client = new JiraClient();

  try {
    client.validateConfig();
  } catch (err) {
    console.error(`\x1b[31m❌ Configuration error: ${err.message}\x1b[0m`);
    console.error('\nRun \x1b[36mnpx copilot-jira-mcp setup\x1b[0m to configure credentials or set:');
    console.error('  JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN');
    process.exit(1);
  }

  console.log(`📍 Jira URL: \x1b[36m${client.url}\x1b[0m`);
  console.log(`📧 User:     \x1b[36m${client.email || '(Personal Access Token)'}\x1b[0m`);

  try {
    const user = await client.getMyself();
    console.log('\n\x1b[32m✅ Connection successful!\x1b[0m');
    console.log(`👤 Name:     ${user.displayName}`);
    console.log(`🆔 Account:  ${user.accountId}`);
    console.log(`🌐 Timezone: ${user.timeZone || 'N/A'}`);

    const projects = await client.getProjects();
    console.log(`\n\x1b[1m📁 Accessible Projects (${projects.length}):\x1b[0m`);
    projects.slice(0, 5).forEach((p) => {
      console.log(`   - [${p.key}] ${p.name} (${p.projectTypeKey || 'software'})`);
    });
    if (projects.length > 5) {
      console.log(`   ... and ${projects.length - 5} more`);
    }
    console.log('\n\x1b[32m🎉 Your Jira MCP server is ready for Copilot, Claude & Cursor!\x1b[0m');
  } catch (err) {
    console.error(`\n\x1b[31m❌ Connection test failed: ${err.message}\x1b[0m`);
    process.exit(1);
  }
}

async function showInteractiveMenu() {
  printBanner();
  console.log(`\n\x1b[1mWhat would you like to do?\x1b[0m`);
  console.log('  \x1b[32m1)\x1b[0m 🧙 Run Guided Configuration Wizard');
  console.log('  \x1b[32m2)\x1b[0m 🔌 Register with AI Clients (Copilot, Claude, Cursor)');
  console.log('  \x1b[32m3)\x1b[0m 🔍 Test Jira Connection');
  console.log('  \x1b[32m4)\x1b[0m 🚀 Start MCP Server (stdio mode)');
  console.log('  \x1b[32m5)\x1b[0m ❓ Help & Documentation');
  console.log('  \x1b[32m6)\x1b[0m 🚪 Exit\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const choice = await new Promise((resolve) => {
    rl.question('\x1b[33mSelect an option (1-6) [default: 1]: \x1b[0m', (ans) => {
      rl.close();
      resolve(ans.trim() || '1');
    });
  });

  switch (choice) {
    case '1':
      await import('../setup/config-wizard.js');
      break;
    case '2':
      await import('../setup/register-mcp.js');
      break;
    case '3':
      await runTestConnection();
      break;
    case '4':
      await startServer();
      break;
    case '5':
      printHelp();
      break;
    case '6':
      console.log('Goodbye! 👋');
      process.exit(0);
      break;
    default:
      console.log('Invalid choice. Showing help:');
      printHelp();
      break;
  }
}

async function main() {
  const command = args[0];

  // If no command is passed:
  // - in an interactive shell, show the user-friendly menu
  // - in a non-interactive pipe (e.g. spawned by Copilot/Claude/Cursor), start stdio MCP server immediately
  if (!command) {
    if (isInteractiveTerminal) {
      await showInteractiveMenu();
    } else {
      await startServer();
    }
    return;
  }

  switch (command) {
    case 'start':
      await startServer();
      break;

    case 'setup':
    case 'wizard':
    case 'config':
      await import('../setup/config-wizard.js');
      break;

    case 'register':
      await import('../setup/register-mcp.js');
      break;

    case 'test':
    case 'check':
      await runTestConnection();
      break;

    case '-v':
    case '--version':
    case 'version':
      console.log(pkg.version);
      break;

    case '-h':
    case '--help':
    case 'help':
      printHelp();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal CLI error:', err);
  process.exit(1);
});
