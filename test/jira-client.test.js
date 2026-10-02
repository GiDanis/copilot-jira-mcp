import test from 'node:test';
import assert from 'node:assert/strict';
import { JiraClient } from '../src/jira-client.js';

test('JiraClient normalizes URL without trailing slashes and ensures https', () => {
  const client1 = new JiraClient({
    url: 'example.atlassian.net///',
    email: 'test@example.com',
    apiToken: 'token123',
  });
  assert.equal(client1.url, 'https://example.atlassian.net');

  const client2 = new JiraClient({
    url: 'https://jira.company.com/jira/',
    email: 'test@example.com',
    apiToken: 'token123',
  });
  assert.equal(client2.url, 'https://jira.company.com/jira');
});

test('JiraClient throws on missing configuration when validated', () => {
  const client = new JiraClient({ url: '', email: '', apiToken: '' });
  assert.throws(() => client.validateConfig(), /Missing JIRA_URL/);

  const clientWithUrl = new JiraClient({ url: 'https://example.atlassian.net' });
  assert.throws(() => clientWithUrl.validateConfig(), /Missing Jira credentials/);
});

test('JiraClient generates correct Basic and Bearer auth headers', () => {
  const basicClient = new JiraClient({
    url: 'https://example.atlassian.net',
    email: 'user@example.com',
    apiToken: 'secret',
  });
  const expectedBasic = `Basic ${Buffer.from('user@example.com:secret').toString('base64')}`;
  assert.equal(basicClient.getAuthHeader(), expectedBasic);

  const patClient = new JiraClient({
    url: 'https://jira.company.com',
    pat: 'my-personal-access-token',
  });
  assert.equal(patClient.getAuthHeader(), 'Bearer my-personal-access-token');
});
