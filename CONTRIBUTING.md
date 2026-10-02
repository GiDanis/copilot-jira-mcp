# Contributing to Copilot Jira MCP

Thank you for your interest in contributing! 🎉

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/copilot-jira-mcp.git
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- Use **ES6+ modules** (`import`/`export`)
- Follow **existing code formatting**
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for creating issues
fix: handle timeout errors gracefully
docs: update installation instructions
chore: bump dependencies
```

### Testing

Before submitting a PR:

```bash
# Run linter
npm run lint

# Test manually
npm run setup
npm start
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Environment:**
   - OS (Windows/Mac/Linux)
   - Node.js version
   - Jira instance type (Cloud/Server)

2. **Steps to reproduce**

3. **Expected vs actual behavior**

4. **Error messages** (if any)

5. **Logs** (from stderr)

## 💡 Suggesting Features

Feature requests are welcome! Please:

1. **Check existing issues** first
2. **Describe the use case** clearly
3. **Explain the benefits**
4. **Consider implementation complexity**

## 🔧 Development Setup

### Environment Variables

For development, create a `.env.local` file:

```bash
JIRA_URL=https://your-test-instance.atlassian.net
JIRA_EMAIL=your-test-email@example.com
JIRA_API_TOKEN=your-test-token
```

### Project Structure

```
src/
  index.js           # MCP server implementation
  cli.js             # CLI entry point (future)
  
setup/
  config-wizard.js   # Interactive configuration
  register-mcp.js    # MCP registration
  
docs/
  *.md               # Documentation
  
examples/
  *.md               # Usage examples
```

## 📚 Documentation

When adding features:

- Update `README.md`
- Add examples to `examples/`
- Update `docs/` if needed
- Add JSDoc comments to code

## 🧪 Testing Checklist

Before submitting PR:

- [ ] Code runs without errors
- [ ] No hardcoded credentials
- [ ] Works on Windows/Mac/Linux (if possible)
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] `npm audit` passes
- [ ] Follows existing code style

## 🎯 Priority Areas

We especially welcome contributions in:

1. **🌐 Internationalization** - Translate UI/messages
2. **✨ New Features** - Issue transitions, creating tickets, etc.
3. **🧪 Testing** - Unit/integration tests
4. **📖 Documentation** - Tutorials, videos, examples
5. **🐛 Bug Fixes** - Check open issues

## 🔄 Pull Request Process

1. **Update documentation** if needed
2. **Follow commit message conventions**
3. **Link related issues** in PR description
4. **Wait for review** (usually within 48 hours)
5. **Address feedback** promptly
6. **Squash commits** before merge (if requested)

## 📜 Code of Conduct

Be respectful and professional:

- ✅ Be kind and courteous
- ✅ Respect different viewpoints
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the project
- ❌ No harassment or discrimination
- ❌ No personal attacks
- ❌ No trolling or insulting comments

## 🙏 Recognition

Contributors will be:

- Listed in `README.md`
- Credited in release notes
- Appreciated forever! ❤️

## 📞 Questions?

- Open a [Discussion](https://github.com/GiDanis/copilot-jira-mcp/discussions)
- Comment on relevant issues
- Reach out to maintainers

---

**Thank you for making this project better! 🚀**
