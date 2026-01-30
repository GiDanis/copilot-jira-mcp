# Usage Examples

Once installed and configured, you can interact with Jira naturally through Copilot.

## Basic Queries

### Get Your Assigned Tickets

```
> Show me my Jira tickets
> What tickets are assigned to me?
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
> Show me tickets in project IIAB
> Find bugs in project CORE
> List all epics in project WEB
```

### Search by Priority

```
> Show me high priority tickets
> Find critical bugs
> List all blockers
```

## Advanced Searches

### JQL Queries

```
> Search Jira with JQL: project = IIAB AND status = Open
> Find issues with: assignee = currentUser() AND priority = High
> Query: sprint = "Sprint 23" AND status != Done
```

### Complex Filters

```
> Show me tickets updated in the last 3 days
> Find bugs created this month
> List tickets with no assignee
> Show me overdue tasks
```

### Date-Based Searches

```
> Tickets created yesterday
> Issues updated this week
> Tasks due next week
> Stories completed last sprint
```

## Ticket Details

### Get Full Information

```
> Get details for IIAB-12345
> Show me ticket PROJ-789
> What's the status of issue CORE-456?
```

### Comments

```
> Show me comments on IIAB-12345
> Get discussion for ticket PROJ-789
> List recent comments on CORE-456
```

### Subtasks

```
> Show subtasks for IIAB-12345
> List child issues of EPIC-123
> What are the subtasks of PROJ-789?
```

### Attachments

```
> List attachments on IIAB-12345
> Show files attached to PROJ-789
> What documents are on CORE-456?
```

## Workflow Analysis

### Sprint Planning

```
> Show me all tickets in current sprint
> List unestimated stories in backlog
> Find blocked tickets in sprint 23
```

### Team Coordination

```
> Show me John's tickets
> What is the team working on?
> List tickets assigned to frontend team
```

### Bug Tracking

```
> How many open bugs do we have?
> Show me critical bugs in production
> List bugs reported this week
```

## Reporting

### Status Reports

```
> Summarize my completed tickets this week
> How many issues did I close this month?
> Show my productivity stats
```

### Project Health

```
> How many open vs closed tickets in project IIAB?
> What's the bug-to-feature ratio?
> Show distribution of tickets by priority
```

## Integration with Development

### Code Review Context

```
> Get details for IIAB-12345
> (While reviewing a PR)
> What does this ticket require?
```

### Commit Messages

```
> Show me IIAB-12345 summary
> (Generates: "IIAB-12345: Fix login authentication bug")
```

### Release Notes

```
> List all tickets completed in sprint 23
> Show me features shipped this month
> Generate release notes from tickets
```

## Power User Tips

### Saved Searches

Create aliases for common queries:

```bash
# Add to your shell profile
alias my-tickets="copilot 'show me my Jira tickets'"
alias team-bugs="copilot 'list open bugs in project IIAB'"
alias sprint-status="copilot 'summarize current sprint progress'"
```

### Automation Examples

```bash
# Morning standup prep
copilot "What did I work on yesterday?" > standup.txt

# Weekly report
copilot "List my completed tickets this week" > weekly-report.txt

# Bug triage
copilot "Show me unassigned critical bugs" > bugs-to-triage.txt
```

### Combining with Other Tools

```bash
# Export to CSV
copilot "Get my tickets" | jq -r '.issues[] | [.key,.summary] | @csv' > tickets.csv

# Send to Slack
copilot "Critical bugs" | slack-cli send #dev-team

# Create GitHub issue from Jira
copilot "Get IIAB-12345" | gh issue create --title "..." --body "..."
```

## Natural Language Examples

Copilot understands various phrasings:

```
✅ "Show my tickets"
✅ "What am I working on?"
✅ "My assigned issues"
✅ "Tickets for me"
✅ "What's on my plate?"

✅ "Find bugs"
✅ "Search for bugs"
✅ "Show me bugs"
✅ "List bug tickets"
✅ "Bug issues"

✅ "Get ticket IIAB-123"
✅ "Show IIAB-123"
✅ "Details for IIAB-123"
✅ "What's IIAB-123 about?"
✅ "Tell me about IIAB-123"
```

## Real-World Scenarios

### Scenario 1: Morning Standup

```
Developer: "What did I work on yesterday?"
Copilot: [Lists tickets updated yesterday]

Developer: "Any blockers?"
Copilot: [Searches for blocked tickets]

Developer: "What's next priority?"
Copilot: [Shows highest priority unstarted tickets]
```

### Scenario 2: Bug Investigation

```
Developer: "Show me IIAB-12345"
Copilot: [Shows ticket details]

Developer: "Are there related bugs?"
Copilot: [Searches for linked issues]

Developer: "Show me comments"
Copilot: [Displays discussion thread]
```

### Scenario 3: Sprint Review

```
Manager: "How many tickets did we complete?"
Copilot: [Counts completed issues]

Manager: "What features shipped?"
Copilot: [Lists story tickets]

Manager: "Any rollover to next sprint?"
Copilot: [Shows incomplete tickets]
```

## Tips & Tricks

1. **Be specific** - "Show IIAB tickets" is better than "Show tickets"
2. **Use JQL** - For complex queries, JQL is more precise
3. **Save common queries** - Create shell aliases for frequently-used searches
4. **Combine queries** - Ask follow-up questions for deeper analysis
5. **Export results** - Pipe output to files or other tools

## Next Steps

- Explore [Configuration Options](configuration.md)
- Check [Troubleshooting Guide](troubleshooting.md)
- Read [Contributing Guide](../CONTRIBUTING.md)

---

**Have a cool usage example?** Share it in [Discussions](https://github.com/gdanise/copilot-jira-mcp/discussions)!
