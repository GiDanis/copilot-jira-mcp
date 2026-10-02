#!/usr/bin/env node

import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { startServer } from './index.js';
import { JiraClient } from './jira-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json for version
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const args = process.argv.slice(2);
const command = args[0] || 'start';

function printHelp() {
  console.log(`
🎫 Copilot Jira MCP Server v${pkg.version}

Usage:
  jira-mcp [command] [options]

Commands:
  start          Start the MCP server on stdio transport (default)
  setup          Run interactive configuration wizard for Jira credentials
  register       Register the MCP server with Copilot CLI and Claude Desktop
  test           Test connection with Jira using configured credentials
  help, --help   Show this help message
  -v, --version  Show version

Examples:
  npx jira-mcp start
  npx jira-mcp setup
  npx jira-mcp register
  npx jira-mcp test
`);
}

async function runTestConnection() {
  console.log('🔍 Testing Jira connection...\n');
  const client = new JiraClient();

  try {
    client.validateConfig();
  } catch (err) {
    console.error(`❌ Configuration error: ${err.message}`);
    console.error('\nRun `jira-mcp setup` to configure your credentials or set:');
    console.error('  JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN');
    process.exit(1);
  }

  console.log(`📍 Jira URL: ${client.url}`);
  console.log(`📧 User:     ${client.email || '(Personal Access Token)'}`);

  try {
    const user = await client.getMyself();
    console.log('\n✅ Connection successful!');
    console.log(`👤 Name:     ${user.displayName}`);
    console.log(`🆔 Account:  ${user.accountId}`);
    console.log(`🌐 Timezone: ${user.timeZone || 'N/A'}`);

    const projects = await client.getProjects();
    console.log(`\n📁 Accessible Projects (${projects.length}):`);
    projects.slice(0, 5).forEach((p) => {
      console.log(`   - [${p.key}] ${p.name} (${p.projectTypeKey || 'software'})`);
    });
    if (projects.length > 5) {
      console.log(`   ... and ${projects.length - 5} more`);
    }
  } catch (err) {
    console.error(`\n❌ Connection test failed: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  switch (command) {
    case 'start':
      await startServer();
      break;

    case 'setup':
      await import('../setup/config-wizard.js');
      break;

    case 'register':
      await import('../setup/register-mcp.js');
      break;

    case 'test':
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
