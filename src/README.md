# Source Architecture

This directory contains the core implementation of the Copilot Jira MCP Server.

## Modules

* **`index.js`** - MCP Server initialization, tool registration (using `@modelcontextprotocol/sdk/server/mcp.js`), Zod schema validation, and stdio transport lifecycle.
* **`jira-client.js`** - Jira REST API v3 client with native `fetch`, authentication (Basic Auth and Bearer PAT), pagination, issue CRUD, and workflow transitions.
* **`adf-parser.js`** - Bidirectional converter between Atlassian Document Format (ADF) AST and clean Markdown text.
* **`cli.js`** - Binary entrypoint for the `jira-mcp` CLI command (`start`, `setup`, `register`, `test`).
