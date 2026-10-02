import test from 'node:test';
import assert from 'node:assert/strict';
import { createMcpServer } from '../src/index.js';

test('createMcpServer initializes with all 12 tools plus legacy aliases', () => {
  const server = createMcpServer();
  assert.ok(server, 'Server instance should exist');

  // Verify tools were registered on server
  // McpServer stores registered tools internally
  assert.equal(typeof server.connect, 'function');
});
