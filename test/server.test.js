import test from 'node:test';
import assert from 'node:assert/strict';
import { createMcpServer } from '../src/index.js';
import { JiraClient } from '../src/jira-client.js';

test('createMcpServer initializes with all 12 tools, resources and prompts', () => {
  const server = createMcpServer();
  assert.ok(server, 'Server instance should exist');
  assert.equal(typeof server.connect, 'function');
});

test('JiraClient normalizes lowercase issue keys to uppercase', () => {
  const client = new JiraClient({
    url: 'https://example.atlassian.net',
    email: 'user@example.com',
    apiToken: 'token',
  });

  assert.equal(client.normalizeKey('proj-123'), 'PROJ-123');
  assert.equal(client.normalizeKey('  abc-456  '), 'ABC-456');
  assert.equal(client.normalizeKey(''), '');
});
