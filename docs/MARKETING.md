# 📢 Marketing & Launch Playbook for Copilot Jira MCP

Ready-to-use launch announcements, social media posts, and marketing copy for promoting **Copilot Jira MCP v2.0**.

---

## 🚀 1-Minute Pitch

> **Tired of switching tabs to Jira while coding?**  
> **Copilot Jira MCP** brings your entire Jira workflow directly into GitHub Copilot CLI, Claude Desktop, and Cursor. Ask questions, search JQL, read ADF formatted requirements, create tickets, and transition tasks without ever leaving your terminal or editor.  
> 100% open source, zero bloat, enterprise-ready.

---

## 💼 LinkedIn Post (Copy & Paste)

```markdown
🚀 Stop context switching between your IDE and Jira!

How many times a day do you leave your editor just to:
• Look up the acceptance criteria for a ticket?
• Move a task from "To Do" to "In Progress"?
• Post a comment with a PR link or status update?
• Find the key of that bug reported yesterday?

I got tired of the constant tab-hopping, so I built / updated 🎫 Copilot Jira MCP Server (v2.0)!

Now you can just ask your AI pair-programmer:
💬 "What are the requirements for PROJ-123?"
💬 "Show me my assigned bugs in current sprint"
💬 "Move PROJ-123 to In Progress and add a comment"
💬 "Create a High priority bug: Cart checkout error 500"

✨ What's new in v2.0:
✅ Multi-client support: Works seamlessly with GitHub Copilot CLI, Claude Desktop, and Cursor
✅ Full Read & Write: Search, inspect, create, update, and transition tickets
✅ Native ADF Parser: Renders Jira's rich doc format into clean Markdown
✅ 10-Second Setup: Just run `npx copilot-jira-mcp setup`
✅ 100% Privacy & Security: Zero telemetry, your tokens stay strictly local

Give it a try in 1 command:
👉 npx copilot-jira-mcp setup

Check out the repo and leave a ⭐ if it helps your team:
🔗 https://github.com/GiDanis/copilot-jira-mcp

#AI #ModelContextProtocol #MCP #GitHubCopilot #ClaudeAI #Cursor #DeveloperTools #Jira #Productivity #OpenSource
```

---

## 🐦 X / Twitter Thread (Copy & Paste)

```markdown
🧵 1/5
Developers spend up to 20% of their day switching between Jira and their IDE. 

No more. 

Introducing Copilot Jira MCP v2.0 — control Jira entirely in natural language from GitHub Copilot CLI, Claude Desktop & Cursor! 🚀

🔗 https://github.com/GiDanis/copilot-jira-mcp

🧵 2/5
What can you do directly inside your AI chat?
🔍 Search with JQL or plain English
📝 Read ticket specs rendered in clean Markdown
⚡ Transition status (To Do ➔ In Progress ➔ Done)
💬 Post comments & PR updates
🆕 Create bugs & tasks on the fly

🧵 3/5
Why it's fast & reliable:
⚡ Powered by modern @modelcontextprotocol SDK & Zod
📄 Custom bidirectional ADF (Atlassian Document Format) parser
🔒 Enterprise secure: credentials stay in your local environment
🌐 Zero heavy dependencies, pure native fetch

🧵 4/5
Getting started takes 10 seconds. Just run:

$ npx copilot-jira-mcp setup

It tests your credentials, detects your MCP clients, and registers itself automatically!

🧵 5/5
It's 100% free and open-source under MIT. 

If this saves you even 10 minutes a day, consider giving it a ⭐ on GitHub!
👉 https://github.com/GiDanis/copilot-jira-mcp

#MCP #GitHubCopilot #Claude #CursorAI #DevTools
```

---

## 👾 Reddit Post (r/programming, r/webdev, r/ClaudeAI, r/Cursor)

**Title:**  
`I built an open-source MCP server to manage Jira from GitHub Copilot, Claude Desktop, and Cursor (v2.0)`

**Body:**  
```markdown
Hey everyone!

Like many devs, I found myself constantly interrupting my flow to switch tabs, log into Jira, click through boards, copy ticket descriptions, and update statuses.

With the rise of the Model Context Protocol (MCP), I wanted a seamless bridge between Jira and my AI coding assistant. So I built and just released a major v2.0 of **Copilot Jira MCP**.

### 🌟 Key Highlights:
- **Universal MCP Support**: 1-click registration for GitHub Copilot CLI, Claude Desktop, and Cursor.
- **Full Two-Way Interaction**: Not just read-only! You can search via JQL, view full ticket specs, list subtasks, post comments, update fields, create new issues, and advance status transitions.
- **Native Atlassian Document Format (ADF) Parser**: Converts nested Jira ADF trees (headings, lists, code blocks, tables, blockquotes) into clean Markdown that LLMs understand and output clearly.
- **Privacy First**: No third-party servers, no telemetry. It uses standard Basic Auth / Bearer PAT directly to your Jira host.
- **Fast Setup**: Run `npx copilot-jira-mcp setup` to launch the interactive wizard.

### 💻 Examples of what you can say:
- *"Show me all open tickets assigned to me"*
- *"What are the acceptance criteria for PROJ-42?"*
- *"Transition PROJ-42 to Done and leave a comment that unit tests are passing"*
- *"Create a Bug in project CORE: Login fails with status 500"*

Repo: https://github.com/GiDanis/copilot-jira-mcp

Would love to hear your feedback, feature requests, or bug reports!
```

---

## 🟠 Hacker News (Show HN)

**Title:**  
`Show HN: Copilot Jira MCP – Control Jira from Copilot CLI, Claude Desktop, and Cursor`

**Body:**  
```markdown
Hi HN!

I built an open-source MCP (Model Context Protocol) server for Jira: https://github.com/GiDanis/copilot-jira-mcp

Most existing Jira integrations are either read-only or proprietary SaaS wrappers. I wanted a lightweight, self-contained server that lets developer AI tools (GitHub Copilot, Claude Desktop, Cursor) query, create, comment on, and transition Jira issues without browser context switching.

Technical details:
- Built with modern `@modelcontextprotocol/sdk` and Zod validation.
- Implemented a custom recursive ADF (Atlassian Document Format) parser to translate Jira's rich JSON schema to clean Markdown for LLM consumption, and vice-versa for write operations.
- Native Node 18+ `fetch` with robust Atlassian error payload extraction.
- Automatic multi-client registration across `~/.copilot/mcp.json`, Claude Desktop, and Cursor.

To try it:
`npx copilot-jira-mcp setup`

Looking forward to your thoughts and feedback!
```
