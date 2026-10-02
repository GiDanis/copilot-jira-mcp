#!/usr/bin/env node

import 'dotenv/config';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { JiraClient } from './jira-client.js';

/**
 * Creates and configures the Jira MCP Server
 * @param {object} [options]
 * @param {JiraClient} [options.client]
 * @returns {McpServer}
 */
export function createMcpServer(options = {}) {
  const client = options.client || new JiraClient();

  const server = new McpServer(
    {
      name: 'copilot-jira-mcp',
      version: '2.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Helper for error formatting
  const handleAction = async (fn) => {
    try {
      const result = await fn();
      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Jira Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  };

  // 1. jira_get_issue
  server.tool(
    'jira_get_issue',
    'Get comprehensive details of a specific Jira issue (summary, status, description, type, priority, assignee, reporter, subtasks, links, dates, and URL).',
    {
      issue_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
    },
    async ({ issue_key }) => handleAction(() => client.getIssue(issue_key))
  );

  // Backwards compatibility alias: jira_get_ticket
  server.tool(
    'jira_get_ticket',
    '[Legacy alias for jira_get_issue] Get details of a specific Jira issue.',
    {
      ticket_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
    },
    async ({ ticket_key }) => handleAction(() => client.getIssue(ticket_key))
  );

  // 2. jira_search_issues
  server.tool(
    'jira_search_issues',
    'Search Jira issues using JQL (Jira Query Language). E.g. "project = PROJ AND status = Open", "assignee = currentUser() ORDER BY updated DESC".',
    {
      jql: z.string().describe('JQL query string'),
      max_results: z
        .number()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe('Maximum number of issues to return (default: 20)'),
      start_at: z
        .number()
        .min(0)
        .optional()
        .default(0)
        .describe('Index of the first issue to return for pagination (default: 0)'),
    },
    async ({ jql, max_results, start_at }) =>
      handleAction(() => client.searchIssues(jql, max_results, start_at))
  );

  // Backwards compatibility alias: jira_search_tickets
  server.tool(
    'jira_search_tickets',
    '[Legacy alias for jira_search_issues] Search Jira issues using JQL.',
    {
      jql: z.string().describe('JQL query string'),
      max_results: z.number().optional().default(20).describe('Max results (default: 20)'),
    },
    async ({ jql, max_results }) => handleAction(() => client.searchIssues(jql, max_results))
  );

  // 3. jira_get_my_issues
  server.tool(
    'jira_get_my_issues',
    'Retrieve issues assigned to the currently authenticated user, optionally filtered by status.',
    {
      status: z
        .string()
        .optional()
        .describe('Filter by status name (e.g. "In Progress", "To Do", "Done")'),
      max_results: z.number().optional().default(20).describe('Max results (default: 20)'),
    },
    async ({ status, max_results }) => handleAction(() => client.getMyIssues(status, max_results))
  );

  // Backwards compatibility alias: jira_get_my_tickets
  server.tool(
    'jira_get_my_tickets',
    '[Legacy alias for jira_get_my_issues] Retrieve issues assigned to current user.',
    {
      status: z.string().optional().describe('Filter by status name'),
      max_results: z.number().optional().default(20).describe('Max results'),
    },
    async ({ status, max_results }) => handleAction(() => client.getMyIssues(status, max_results))
  );

  // 4. jira_get_comments
  server.tool(
    'jira_get_comments',
    'Retrieve all comments for a specific Jira issue.',
    {
      issue_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
      max_results: z.number().optional().default(20).describe('Max comments to retrieve'),
    },
    async ({ issue_key, max_results }) =>
      handleAction(() => client.getIssueComments(issue_key, max_results))
  );

  // 5. jira_add_comment
  server.tool(
    'jira_add_comment',
    'Add a new comment to an existing Jira issue.',
    {
      issue_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
      comment: z.string().describe('Comment content (plain text or markdown)'),
    },
    async ({ issue_key, comment }) => handleAction(() => client.addComment(issue_key, comment))
  );

  // 6. jira_create_issue
  server.tool(
    'jira_create_issue',
    'Create a new Jira issue (Task, Bug, Story, etc.) with specified fields.',
    {
      project_key: z.string().describe('The project key (e.g. PROJ)'),
      summary: z.string().describe('Title / summary of the issue'),
      issue_type: z
        .string()
        .optional()
        .default('Task')
        .describe('Issue type (e.g. "Task", "Bug", "Story")'),
      description: z.string().optional().describe('Description of the issue (markdown supported)'),
      priority: z
        .string()
        .optional()
        .describe('Priority name (e.g. "Highest", "High", "Medium", "Low", "Lowest")'),
      labels: z.array(z.string()).optional().describe('Array of label tags'),
    },
    async (params) =>
      handleAction(() =>
        client.createIssue({
          projectKey: params.project_key,
          summary: params.summary,
          issueType: params.issue_type,
          description: params.description,
          priority: params.priority,
          labels: params.labels,
        })
      )
  );

  // 7. jira_update_issue
  server.tool(
    'jira_update_issue',
    'Update fields (summary, description, priority, labels) of an existing Jira issue.',
    {
      issue_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
      summary: z.string().optional().describe('New summary for the issue'),
      description: z.string().optional().describe('New description (markdown supported)'),
      priority: z.string().optional().describe('New priority'),
      labels: z.array(z.string()).optional().describe('New list of labels'),
    },
    async ({ issue_key, ...fields }) => handleAction(() => client.updateIssue(issue_key, fields))
  );

  // 8. jira_get_transitions
  server.tool(
    'jira_get_transitions',
    'Retrieve available workflow transitions for an issue (e.g. "In Progress", "Done", "Under Review").',
    {
      issue_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
    },
    async ({ issue_key }) => handleAction(() => client.getTransitions(issue_key))
  );

  // 9. jira_transition_issue
  server.tool(
    'jira_transition_issue',
    'Move a Jira issue to a new workflow status by transition ID or target status name.',
    {
      issue_key: z.string().describe('The Jira issue key (e.g. PROJ-123)'),
      transition: z
        .string()
        .describe('Transition name (e.g. "In Progress", "Done") or numeric transition ID'),
      comment: z.string().optional().describe('Optional comment to attach with this transition'),
    },
    async ({ issue_key, transition, comment }) =>
      handleAction(() => client.transitionIssue(issue_key, transition, comment))
  );

  // 10. jira_get_subtasks
  server.tool(
    'jira_get_subtasks',
    'Get subtasks and child issues linked to a parent Jira issue.',
    {
      issue_key: z.string().describe('The parent Jira issue key (e.g. PROJ-123)'),
    },
    async ({ issue_key }) => handleAction(() => client.getIssueSubtasks(issue_key))
  );

  // 11. jira_get_projects
  server.tool(
    'jira_get_projects',
    'List all Jira projects accessible by the authenticated user.',
    {},
    async () => handleAction(() => client.getProjects())
  );

  // 12. jira_whoami
  server.tool(
    'jira_whoami',
    'Verify Jira connection credentials and retrieve current authenticated user details.',
    {},
    async () =>
      handleAction(async () => {
        const user = await client.getMyself();
        return {
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          accountId: user.accountId,
          timeZone: user.timeZone,
          active: user.active,
          instanceUrl: client.url,
        };
      })
  );

  // ═══════════════════════════════════════════════════════════
  // 📚 MCP RESOURCES
  // ═══════════════════════════════════════════════════════════

  // Resource 1: Single Jira Issue
  server.resource(
    'jira-issue',
    new ResourceTemplate('jira://issue/{key}', { list: undefined }),
    async (uri, { key }) => {
      try {
        const issue = await client.getIssue(key);
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/plain',
              text: `Error loading Jira issue ${key}: ${err.message}`,
            },
          ],
        };
      }
    }
  );

  // Resource 2: My Open Issues
  server.resource(
    'jira-my-open-issues',
    'jira://my-open-issues',
    async (uri) => {
      try {
        const results = await client.getMyIssues('In Progress', 25);
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/plain',
              text: `Error loading my open issues: ${err.message}`,
            },
          ],
        };
      }
    }
  );

  // Resource 3: Accessible Projects
  server.resource(
    'jira-projects',
    'jira://projects',
    async (uri) => {
      try {
        const projects = await client.getProjects();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/plain',
              text: `Error loading projects: ${err.message}`,
            },
          ],
        };
      }
    }
  );

  // ═══════════════════════════════════════════════════════════
  // 💡 MCP PROMPTS
  // ═══════════════════════════════════════════════════════════

  // Prompt 1: Daily Standup Summary
  server.prompt(
    'jira_standup',
    'Generate a daily standup update based on Jira activity and assigned tickets',
    {
      status: z.string().optional().describe('Optional status filter (e.g. "In Progress")'),
    },
    ({ status }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please generate a structured daily standup update using my Jira tickets${
              status ? ` filtered by status "${status}"` : ''
            }. Structure the response with:
1. Yesterday / Recent Accomplishments: Tickets completed or updated
2. Today's Plan: Tasks currently "In Progress" or queued
3. Blockers & Risks: Any issues with blockers, high priority flags, or pending reviews`,
          },
        },
      ],
    })
  );

  // Prompt 2: Sprint & Release Review
  server.prompt(
    'jira_sprint_review',
    'Generate a release or sprint review summarizing delivered features and resolved bugs',
    {
      project: z.string().describe('The project key to review (e.g. PROJ)'),
    },
    ({ project }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review closed and in-progress Jira issues for project "${project}".
Generate:
1. Executive Summary: What main goals were achieved
2. Delivered Features: Grouped by story/feature
3. Resolved Bugs: Fixes shipped and impact
4. Carried-over Tasks: What remains incomplete and reasons`,
          },
        },
      ],
    })
  );

  // Prompt 3: Bug Triage Assistant
  server.prompt(
    'jira_bug_triage',
    'Analyze, categorize, and triage a Jira bug ticket with reproduction steps and severity recommendations',
    {
      issue_key: z.string().describe('The Jira issue key to triage (e.g. PROJ-123)'),
    },
    ({ issue_key }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Analyze and triage Jira bug "${issue_key}".
1. Retrieve its details and description
2. Check if reproduction steps, environment, and logs are complete
3. Recommend priority and severity adjustment if needed
4. Suggest potential root causes or affected codebase components`,
          },
        },
      ],
    })
  );

  return server;
}

/**
 * Starts the MCP server on stdio transport
 */
export async function startServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ Copilot Jira MCP Server v2.0.0 running on stdio');
}

// Auto-start if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    console.error('❌ Fatal error starting Jira MCP Server:', error);
    process.exit(1);
  });
}
