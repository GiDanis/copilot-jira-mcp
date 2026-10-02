# Usage Examples

Once installed and configured, you can interact with Jira naturally through GitHub Copilot CLI, Claude Desktop, Cursor, or any MCP client.

## Basic Queries

### Get Your Assigned Tickets

```
> Show me my Jira tickets
> What tickets are assigned to me that are In Progress?
> List my open issues
```

### Search by Status

```
> Show me all open tickets
> Find tickets in progress
> List completed issues from last week
```

### Search by Project

```
> Show me tickets in project PROJ
> Find bugs in project BACKEND
> List all stories in project WEB
```

### Search by Priority

```
> Show me high priority tickets
> Find critical bugs in project PROJ
> List all blockers
```

## Advanced Searches & JQL

### JQL Queries

```
> Search Jira with JQL: project = PROJ AND status = Open
> Find issues with: assignee = currentUser() AND priority = High
> Query: sprint in openSprints() AND status != Done
```

### Complex Filters

```
> Show me tickets updated in the last 3 days
> Find bugs created this month
> List tickets with no assignee in project PROJ
> Show me overdue tasks
```

## Ticket Details & History

### Full Information

```
> Get details for PROJ-12345
> Show me ticket PROJ-789
> What's the status of issue PROJ-456?
```

### Comments & Discussions

```
> Show me comments on PROJ-12345
> Get discussion thread for ticket PROJ-789
> List recent comments on PROJ-456
```

### Subtasks & Links

```
> Show subtasks for PROJ-12345
> List child issues of PROJ-100
> What are the linked blockers for PROJ-789?
```

## Managing Issues & Workflow (Write Operations)

### Adding Comments

```
> Add a comment to PROJ-12345: "Code review completed, PR merged."
> Post a note on PROJ-789 explaining the workaround.
```

### Transitioning Ticket Status

```
> What transitions are available for PROJ-12345?
> Move ticket PROJ-12345 to "In Progress"
> Close PROJ-12345 with status "Done" and comment "Resolved in v2.0"
```

### Creating Tickets

```
> Create a Bug in project PROJ with summary "Cart checkout fails with 500 error" and priority High
> Create a Task in project DEV: "Update database migration scripts"
```

### Updating Tickets

```
> Update PROJ-12345 summary to "Refactor authentication flow"
> Change priority of PROJ-456 to High
```

## Team Coordination & Standup

### Morning Standup Prep

```
> What did I work on yesterday?
> Any open bugs assigned to me?
> What is high priority in the current sprint?
```

### Verifying Account & Access

```
> Who am I logged in as in Jira?
> List all accessible Jira projects
```

---

**Have a cool usage example?** Share it in [Discussions](https://github.com/GiDanis/copilot-jira-mcp/discussions)!
