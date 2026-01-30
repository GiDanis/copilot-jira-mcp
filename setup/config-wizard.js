#!/usr/bin/env node

/**
 * Interactive Configuration Wizard
 * Helps users set up Jira credentials securely
 */

import { stdin as input, stdout as output } from 'process';
import readline from 'readline';
import https from 'https';
import { execSync } from 'child_process';
import os from 'os';

const rl = readline.createInterface({ input, output });

// ═══════════════════════════════════════════════════════════
// 🎨 COLORS & FORMATTING
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function testJiraConnection(url, email, token) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${email}:${token}`).toString('base64');
    const apiUrl = new URL('/rest/api/3/myself', url);
    
    const options = {
      hostname: apiUrl.hostname,
      path: apiUrl.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const user = JSON.parse(data);
            resolve(user);
          } catch (e) {
            reject(new Error('Invalid response from Jira'));
          }
        } else {
          reject(new Error(`Authentication failed (${res.statusCode})`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function setEnvironmentVariable(name, value) {
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      // Windows: Use setx for persistent user environment variables
      execSync(`setx ${name} "${value}"`, { stdio: 'pipe' });
      process.env[name] = value; // Set for current session
    } else {
      // Unix: Add to shell profile
      const shell = process.env.SHELL || '/bin/bash';
      const profileFile = shell.includes('zsh') ? '~/.zshrc' : '~/.bashrc';
      const exportLine = `export ${name}="${value}"`;
      
      log(`\n📝 Add this line to your ${profileFile}:`, 'yellow');
      log(`   ${exportLine}`, 'cyan');
      log('\nOr run:', 'yellow');
      log(`   echo '${exportLine}' >> ${profileFile}`, 'cyan');
      log(`   source ${profileFile}`, 'cyan');
    }
    return true;
  } catch (error) {
    log(`⚠️  Warning: Could not set system environment variable: ${error.message}`, 'yellow');
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// 🎯 MAIN WIZARD
// ═══════════════════════════════════════════════════════════

async function main() {
  console.clear();
  
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                            ║', 'cyan');
  log('║          🎫 JIRA MCP SERVER - CONFIGURATION WIZARD         ║', 'cyan');
  log('║                                                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log('');
  
  log('This wizard will help you configure Jira integration securely.', 'green');
  log('Your credentials will be stored in environment variables.\n');

  // Step 1: Jira URL
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('📍 STEP 1: Jira URL', 'bold');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('\nExample: https://your-company.atlassian.net\n', 'yellow');
  
  let jiraUrl = await question('Enter your Jira URL: ');
  jiraUrl = jiraUrl.trim().replace(/\/$/, ''); // Remove trailing slash
  
  if (!jiraUrl.startsWith('http')) {
    jiraUrl = 'https://' + jiraUrl;
  }

  // Step 2: Email
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('📧 STEP 2: Email', 'bold');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('\nThe email address associated with your Jira account.\n', 'yellow');
  
  const email = await question('Enter your Jira email: ');

  // Step 3: API Token
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('🔑 STEP 3: API Token', 'bold');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('\nGenerate an API token at:', 'yellow');
  log('https://id.atlassian.com/manage-profile/security/api-tokens', 'cyan');
  log('\n💡 The token will be hidden as you type (for security).\n', 'yellow');
  
  // Hide input for token
  output.write('Enter your API token: ');
  const token = await new Promise((resolve) => {
    input.setRawMode(true);
    let token = '';
    input.on('data', (char) => {
      char = char.toString('utf8');
      if (char === '\r' || char === '\n') {
        input.setRawMode(false);
        output.write('\n');
        input.removeAllListeners('data');
        resolve(token);
      } else if (char === '\u0003') {
        process.exit();
      } else if (char === '\u007f' || char === '\b') {
        if (token.length > 0) {
          token = token.slice(0, -1);
          output.write('\b \b');
        }
      } else {
        token += char;
        output.write('*');
      }
    });
  });

  // Step 4: Test Connection
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('🧪 STEP 4: Testing Connection', 'bold');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('');
  
  try {
    log('⏳ Connecting to Jira...', 'yellow');
    const user = await testJiraConnection(jiraUrl, email, token);
    
    log('✅ Connection successful!', 'green');
    log(`👤 Logged in as: ${user.displayName}`, 'green');
    log(`📧 Email: ${user.emailAddress}`, 'green');
  } catch (error) {
    log(`\n❌ Connection failed: ${error.message}`, 'red');
    log('\nPlease check your credentials and try again.', 'yellow');
    rl.close();
    process.exit(1);
  }

  // Step 5: Save Configuration
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('💾 STEP 5: Saving Configuration', 'bold');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('');
  
  const saved = setEnvironmentVariable('JIRA_URL', jiraUrl);
  setEnvironmentVariable('JIRA_EMAIL', email);
  setEnvironmentVariable('JIRA_API_TOKEN', token);
  
  if (saved && os.platform() === 'win32') {
    log('✅ Environment variables saved!', 'green');
  }

  // Step 6: Register MCP Server
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('🔌 STEP 6: Register with Copilot', 'bold');
  log('════════════════════════════════════════════════════════════', 'cyan');
  log('\nDo you want to register this MCP server with Copilot now?', 'yellow');
  
  const register = await question('Register now? (y/n): ');
  
  if (register.toLowerCase() === 'y') {
    log('\n⏳ Registering MCP server...', 'yellow');
    try {
      execSync('node setup/register-mcp.js', { stdio: 'inherit' });
    } catch (error) {
      log('⚠️  Auto-registration failed. You can register manually later.', 'yellow');
    }
  } else {
    log('\n💡 You can register later by running:', 'yellow');
    log('   npm run register', 'cyan');
  }

  // Final Success
  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log('║                                                            ║', 'green');
  log('║                    ✅ SETUP COMPLETE! ✅                   ║', 'green');
  log('║                                                            ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝', 'green');
  log('');
  log('🚀 You can now use Jira commands in Copilot:', 'green');
  log('   - "Show me my Jira tickets"', 'cyan');
  log('   - "Get details for IIAB-12345"', 'cyan');
  log('   - "Search Jira for bugs in project XYZ"', 'cyan');
  log('');
  log('📚 For more examples, see: docs/usage.md', 'yellow');
  log('');
  
  rl.close();
}

main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
