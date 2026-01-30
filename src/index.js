#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import https from 'https';

// Configurazione Jira (da variabili d'ambiente)
const JIRA_URL = process.env.JIRA_URL || 'https://generali-iiab.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Verifica credenziali
if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error('❌ Errore: Configura JIRA_EMAIL e JIRA_API_TOKEN nelle variabili d\'ambiente');
  process.exit(1);
}

// Credenziali Basic Auth
const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

// Funzione helper per chiamate API Jira
function jiraApiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, JIRA_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Funzione per estrarre testo dalla descrizione Jira (formato ADF)
function extractTextFromADF(adf) {
  if (!adf || !adf.content) return '';
  
  let text = '';
  for (const content of adf.content) {
    if (content.content) {
      for (const item of content.content) {
        if (item.text) {
          text += item.text + ' ';
        }
      }
    }
    text += '\n';
  }
  return text.trim();
}

// Crea il server MCP
const server = new Server(
  {
    name: 'jira-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Lista dei tool disponibili
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'jira_get_ticket',
        description: 'Recupera i dettagli di un ticket Jira specifico tramite la sua chiave (es. IIAB-81069)',
        inputSchema: {
          type: 'object',
          properties: {
            ticket_key: {
              type: 'string',
              description: 'La chiave del ticket Jira (es. IIAB-81069)',
            },
          },
          required: ['ticket_key'],
        },
      },
      {
        name: 'jira_search_tickets',
        description: 'Cerca ticket Jira usando JQL (Jira Query Language). Esempi: "project = IIAB AND status = Open", "assignee = currentUser()", "labels = backend"',
        inputSchema: {
          type: 'object',
          properties: {
            jql: {
              type: 'string',
              description: 'Query JQL per cercare i ticket',
            },
            max_results: {
              type: 'number',
              description: 'Numero massimo di risultati (default: 20)',
              default: 20,
            },
          },
          required: ['jql'],
        },
      },
      {
        name: 'jira_get_my_tickets',
        description: 'Recupera tutti i ticket assegnati all\'utente corrente',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Filtra per stato (es. "In Progress", "Open", "To Do")',
            },
            max_results: {
              type: 'number',
              description: 'Numero massimo di risultati (default: 20)',
              default: 20,
            },
          },
        },
      },
    ],
  };
});

// Handler per l'esecuzione dei tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'jira_get_ticket') {
      const ticketKey = args.ticket_key;
      const issue = await jiraApiCall(`/rest/api/3/issue/${ticketKey}`);
      
      const fields = issue.fields;
      const description = extractTextFromADF(fields.description);
      
      const result = {
        key: issue.key,
        summary: fields.summary,
        status: fields.status.name,
        type: fields.issuetype.name,
        priority: fields.priority?.name,
        assignee: fields.assignee?.displayName,
        reporter: fields.reporter?.displayName,
        description: description,
        labels: fields.labels || [],
        created: fields.created,
        updated: fields.updated,
        url: `${JIRA_URL}/browse/${issue.key}`
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'jira_search_tickets') {
      const jql = args.jql;
      const maxResults = args.max_results || 20;
      
      const body = {
        jql: jql,
        maxResults: maxResults,
        fields: ['summary', 'status', 'assignee', 'priority', 'issuetype', 'labels', 'created', 'updated']
      };

      const response = await jiraApiCall('/rest/api/3/search', 'POST', body);
      
      const results = response.issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        type: issue.fields.issuetype.name,
        priority: issue.fields.priority?.name,
        assignee: issue.fields.assignee?.displayName,
        labels: issue.fields.labels || [],
        created: issue.fields.created,
        updated: issue.fields.updated,
        url: `${JIRA_URL}/browse/${issue.key}`
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              total: response.total,
              count: results.length,
              tickets: results
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'jira_get_my_tickets') {
      let jql = 'assignee = currentUser()';
      
      if (args.status) {
        jql += ` AND status = "${args.status}"`;
      }
      
      jql += ' ORDER BY updated DESC';
      
      const maxResults = args.max_results || 20;
      
      const body = {
        jql: jql,
        maxResults: maxResults,
        fields: ['summary', 'status', 'priority', 'issuetype', 'labels', 'updated']
      };

      const response = await jiraApiCall('/rest/api/3/search', 'POST', body);
      
      const results = response.issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        type: issue.fields.issuetype.name,
        priority: issue.fields.priority?.name,
        labels: issue.fields.labels || [],
        updated: issue.fields.updated,
        url: `${JIRA_URL}/browse/${issue.key}`
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              total: response.total,
              count: results.length,
              tickets: results
            }, null, 2),
          },
        ],
      };
    }

    throw new Error(`Tool sconosciuto: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Errore: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Avvia il server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Jira MCP Server avviato');
}

main().catch((error) => {
  console.error('Errore fatale:', error);
  process.exit(1);
});
