import { adfToMarkdown, textToADF } from './adf-parser.js';

export class JiraClient {
  /**
   * @param {object} [config]
   * @param {string} [config.url]
   * @param {string} [config.email]
   * @param {string} [config.apiToken]
   * @param {string} [config.pat]
   * @param {number} [config.timeout]
   */
  constructor(config = {}) {
    this.url = (config.url || process.env.JIRA_URL || '').trim().replace(/\/+$/, '');
    this.email = (config.email || process.env.JIRA_EMAIL || '').trim();
    this.apiToken = (config.apiToken || process.env.JIRA_API_TOKEN || '').trim();
    this.pat = (config.pat || process.env.JIRA_PAT || '').trim();
    this.timeout = config.timeout || 30000;

    if (this.url && !this.url.startsWith('http://') && !this.url.startsWith('https://')) {
      this.url = `https://${this.url}`;
    }
  }

  /**
   * Validate that credentials are configured
   */
  validateConfig() {
    if (!this.url) {
      throw new Error(
        'Missing JIRA_URL environment variable. Please configure your Jira instance URL (e.g., https://your-domain.atlassian.net).'
      );
    }
    if (!this.pat && (!this.email || !this.apiToken)) {
      throw new Error(
        'Missing Jira credentials. Please set JIRA_EMAIL and JIRA_API_TOKEN (or JIRA_PAT for Data Center).'
      );
    }
  }

  /**
   * Generates authorization header
   */
  getAuthHeader() {
    if (this.pat) {
      return `Bearer ${this.pat}`;
    }
    const token = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    return `Basic ${token}`;
  }

  /**
   * Low-level fetch wrapper with timeout and standardized error handling
   * @param {string} path - API endpoint path
   * @param {RequestInit} [options] - Fetch options
   * @returns {Promise<any>}
   */
  async request(path, options = {}) {
    this.validateConfig();

    const fullUrl = new URL(path, this.url).toString();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    const headers = {
      Authorization: this.getAuthHeader(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });

      // No content response (e.g. 204)
      if (response.status === 204) {
        return null;
      }

      const text = await response.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (!response.ok) {
        let errorMsg = `Jira API error (${response.status} ${response.statusText})`;
        if (data && typeof data === 'object') {
          if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
            errorMsg += `: ${data.errorMessages.join(' | ')}`;
          } else if (data.errors && typeof data.errors === 'object') {
            const fieldErrors = Object.entries(data.errors)
              .map(([key, val]) => `${key}: ${val}`)
              .join(', ');
            errorMsg += `: ${fieldErrors}`;
          } else if (data.message) {
            errorMsg += `: ${data.message}`;
          }
        } else if (typeof data === 'string' && data.length > 0) {
          errorMsg += `: ${data.slice(0, 300)}`;
        }

        if (response.status === 401) {
          errorMsg += ' - Invalid credentials. Check your JIRA_EMAIL and JIRA_API_TOKEN.';
        } else if (response.status === 403) {
          errorMsg += ' - Access forbidden. Check your permissions.';
        } else if (response.status === 404) {
          errorMsg += ' - Requested resource was not found.';
        }

        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Jira request timed out after ${this.timeout / 1000}s (${fullUrl})`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Get authenticated user profile info
   */
  async getMyself() {
    return this.request('/rest/api/3/myself');
  }

  /**
   * Get single issue details
   * @param {string} issueKey
   */
  async getIssue(issueKey) {
    const issue = await this.request(`/rest/api/3/issue/${encodeURIComponent(issueKey)}`);
    const fields = issue.fields || {};

    return {
      key: issue.key,
      summary: fields.summary || '',
      status: fields.status?.name || 'Unknown',
      statusCategory: fields.status?.statusCategory?.name,
      type: fields.issuetype?.name || 'Issue',
      priority: fields.priority?.name || 'None',
      assignee: fields.assignee?.displayName || 'Unassigned',
      assigneeEmail: fields.assignee?.emailAddress,
      reporter: fields.reporter?.displayName || 'Unknown',
      description: adfToMarkdown(fields.description),
      labels: fields.labels || [],
      subtasks: (fields.subtasks || []).map((sub) => ({
        key: sub.key,
        summary: sub.fields?.summary,
        status: sub.fields?.status?.name,
        type: sub.fields?.issuetype?.name,
      })),
      issueLinks: (fields.issuelinks || []).map((link) => {
        const linked = link.outwardIssue || link.inwardIssue;
        return {
          type: link.type?.name,
          relationship: link.outwardIssue ? link.type?.outward : link.type?.inward,
          key: linked?.key,
          summary: linked?.fields?.summary,
          status: linked?.fields?.status?.name,
        };
      }),
      parent: fields.parent ? { key: fields.parent.key, summary: fields.parent.fields?.summary } : null,
      created: fields.created,
      updated: fields.updated,
      url: `${this.url}/browse/${issue.key}`,
    };
  }

  /**
   * Search issues using JQL
   * @param {string} jql
   * @param {number} [maxResults=20]
   * @param {number} [startAt=0]
   */
  async searchIssues(jql, maxResults = 20, startAt = 0) {
    const body = {
      jql,
      maxResults,
      startAt,
      fields: ['summary', 'status', 'assignee', 'priority', 'issuetype', 'labels', 'created', 'updated'],
    };

    const response = await this.request('/rest/api/3/search', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const issues = (response.issues || []).map((issue) => ({
      key: issue.key,
      summary: issue.fields?.summary || '',
      status: issue.fields?.status?.name || 'Unknown',
      type: issue.fields?.issuetype?.name || 'Issue',
      priority: issue.fields?.priority?.name || 'None',
      assignee: issue.fields?.assignee?.displayName || 'Unassigned',
      labels: issue.fields?.labels || [],
      created: issue.fields?.created,
      updated: issue.fields?.updated,
      url: `${this.url}/browse/${issue.key}`,
    }));

    return {
      total: response.total ?? issues.length,
      startAt: response.startAt ?? startAt,
      maxResults: response.maxResults ?? maxResults,
      count: issues.length,
      issues,
    };
  }

  /**
   * Search tickets assigned to current user
   * @param {string} [status]
   * @param {number} [maxResults=20]
   */
  async getMyIssues(status = null, maxResults = 20) {
    let jql = 'assignee = currentUser()';
    if (status) {
      jql += ` AND status = "${status.replace(/"/g, '\\"')}"`;
    }
    jql += ' ORDER BY updated DESC';
    return this.searchIssues(jql, maxResults);
  }

  /**
   * Get comments for an issue
   * @param {string} issueKey
   * @param {number} [maxResults=20]
   */
  async getIssueComments(issueKey, maxResults = 20) {
    const response = await this.request(
      `/rest/api/3/issue/${encodeURIComponent(issueKey)}/comment?maxResults=${maxResults}&orderBy=-created`
    );

    const comments = (response.comments || []).map((c) => ({
      id: c.id,
      author: c.author?.displayName || 'Unknown',
      body: adfToMarkdown(c.body),
      created: c.created,
      updated: c.updated,
    }));

    return {
      total: response.total ?? comments.length,
      count: comments.length,
      comments,
    };
  }

  /**
   * Add a comment to an issue
   * @param {string} issueKey
   * @param {string} commentText
   */
  async addComment(issueKey, commentText) {
    const body = {
      body: textToADF(commentText),
    };

    const response = await this.request(
      `/rest/api/3/issue/${encodeURIComponent(issueKey)}/comment`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );

    return {
      id: response.id,
      author: response.author?.displayName,
      body: adfToMarkdown(response.body),
      created: response.created,
      url: `${this.url}/browse/${issueKey}?focusedCommentId=${response.id}`,
    };
  }

  /**
   * Create a new Jira issue
   * @param {object} params
   * @param {string} params.projectKey
   * @param {string} params.summary
   * @param {string} [params.issueType='Task']
   * @param {string} [params.description]
   * @param {string} [params.priority]
   * @param {string[]} [params.labels]
   * @param {string} [params.assigneeAccountId]
   */
  async createIssue({
    projectKey,
    summary,
    issueType = 'Task',
    description = '',
    priority = null,
    labels = [],
    assigneeAccountId = null,
  }) {
    const fields = {
      project: { key: projectKey.toUpperCase() },
      summary,
      issuetype: { name: issueType },
      description: textToADF(description),
    };

    if (priority) {
      fields.priority = { name: priority };
    }
    if (Array.isArray(labels) && labels.length > 0) {
      fields.labels = labels;
    }
    if (assigneeAccountId) {
      fields.assignee = { accountId: assigneeAccountId };
    }

    const response = await this.request('/rest/api/3/issue', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    });

    return {
      id: response.id,
      key: response.key,
      url: `${this.url}/browse/${response.key}`,
    };
  }

  /**
   * Update issue fields
   * @param {string} issueKey
   * @param {object} updateFields
   */
  async updateIssue(issueKey, updateFields = {}) {
    const fields = {};

    if (updateFields.summary) {
      fields.summary = updateFields.summary;
    }
    if (updateFields.description !== undefined) {
      fields.description = textToADF(updateFields.description);
    }
    if (updateFields.priority) {
      fields.priority = { name: updateFields.priority };
    }
    if (Array.isArray(updateFields.labels)) {
      fields.labels = updateFields.labels;
    }

    await this.request(`/rest/api/3/issue/${encodeURIComponent(issueKey)}`, {
      method: 'PUT',
      body: JSON.stringify({ fields }),
    });

    return {
      key: issueKey,
      updated: true,
      url: `${this.url}/browse/${issueKey}`,
    };
  }

  /**
   * Get available workflow transitions for an issue
   * @param {string} issueKey
   */
  async getTransitions(issueKey) {
    const response = await this.request(
      `/rest/api/3/issue/${encodeURIComponent(issueKey)}/transitions`
    );

    return (response.transitions || []).map((t) => ({
      id: t.id,
      name: t.name,
      toStatus: t.to?.name,
      category: t.to?.statusCategory?.name,
    }));
  }

  /**
   * Move an issue to a new status
   * @param {string} issueKey
   * @param {string} transitionIdOrName
   * @param {string} [comment]
   */
  async transitionIssue(issueKey, transitionIdOrName, comment = null) {
    // If name is passed instead of id, resolve transition id
    let transitionId = transitionIdOrName;
    if (isNaN(Number(transitionIdOrName))) {
      const transitions = await this.getTransitions(issueKey);
      const match = transitions.find(
        (t) =>
          t.name.toLowerCase() === transitionIdOrName.toLowerCase() ||
          t.toStatus.toLowerCase() === transitionIdOrName.toLowerCase()
      );
      if (!match) {
        const available = transitions.map((t) => `"${t.name}" (to: ${t.toStatus})`).join(', ');
        throw new Error(
          `Transition "${transitionIdOrName}" not found for issue ${issueKey}. Available transitions: ${available}`
        );
      }
      transitionId = match.id;
    }

    const payload = {
      transition: { id: transitionId },
    };

    if (comment) {
      payload.update = {
        comment: [
          {
            add: {
              body: textToADF(comment),
            },
          },
        ],
      };
    }

    await this.request(`/rest/api/3/issue/${encodeURIComponent(issueKey)}/transitions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      key: issueKey,
      transitionId,
      success: true,
      url: `${this.url}/browse/${issueKey}`,
    };
  }

  /**
   * Get subtasks of an issue
   * @param {string} issueKey
   */
  async getIssueSubtasks(issueKey) {
    const issue = await this.getIssue(issueKey);
    return {
      key: issue.key,
      summary: issue.summary,
      subtasks: issue.subtasks,
    };
  }

  /**
   * List accessible projects
   */
  async getProjects() {
    const projects = await this.request('/rest/api/3/project');
    return (projects || []).map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      projectTypeKey: p.projectTypeKey,
    }));
  }
}
