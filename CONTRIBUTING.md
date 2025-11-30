# Contributing to SkillSwap

First off, thank you for considering contributing to SkillSwap! 🎉

SkillSwap is built by **Team ZenYukti** with the philosophy of *"Learn. Build. Share."* — we believe in growing together as a community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Getting Help](#getting-help)

---

## 📜 Code of Conduct

This project follows the ZenYukti organization's Code of Conduct. Please refer to our organization's [.github repository](https://github.com/ZenYukti/.github) for the complete guidelines.

**In short**: Be respectful, inclusive, and constructive.

---

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please check existing issues. When creating a report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)

### 💡 Suggesting Features

We love feature ideas! Please:

- Check if the feature has already been suggested
- Provide a clear use case
- Describe how it benefits users
- Consider implementation complexity

### 🔧 Code Contributions

1. **Good first issues** - Look for issues labeled `good first issue`
2. **Bug fixes** - Help us squash bugs
3. **Features** - Implement new functionality
4. **Documentation** - Improve docs and comments
5. **Tests** - Add test coverage

---

## 🛠 Development Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Getting Started

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/SkillSwap.git
cd SkillSwap

# Install dependencies
npm run install:all

# Set up environment variables
cp .env.example server/.env
# Edit server/.env with your configuration

# Start development servers
npm run dev
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |
| `npm run install:all` | Install all dependencies |
| `npm test` | Run tests |

---

## 📝 Coding Standards

### JavaScript/React

- Use **ES6+** features (arrow functions, destructuring, etc.)
- Use **functional components** with hooks
- Follow **2-space indentation**
- Use **camelCase** for variables and functions
- Use **PascalCase** for components
- Add **JSDoc comments** for functions

### File Organization

```
components/
  ComponentName/
    index.jsx       # Component file
    ComponentName.css  # Styles
```

### CSS

- Use **CSS custom properties** for theming
- Follow **BEM-like naming** (.component, .component-element, .component--modifier)
- Keep styles **scoped** to components
- Use **rem/em** for sizing

### Example Component

```jsx
import React from 'react'
import './MyComponent.css'

/**
 * MyComponent - A brief description
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 */
export default function MyComponent({ title }) {
  return (
    <div className="my-component">
      <h2 className="my-component-title">{title}</h2>
    </div>
  )
}
```

---

## 💬 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting) |
| `refactor` | Code changes without fixing bugs or adding features |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |

### Examples

```bash
feat: add skill search functionality
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify authentication middleware
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork** with the latest main branch
2. **Create a feature branch** from main
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed

### Creating the PR

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why
3. **Link issues**: Reference related issues with `Closes #123`
4. **Screenshots**: Include for UI changes

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have tested my changes
- [ ] I have updated the documentation
- [ ] My changes don't introduce new warnings

## Related Issues
Closes #

## Screenshots (if applicable)
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Celebrate! 🎉

---

## ❓ Getting Help

Need help? Reach out to us:

| Channel | Link |
|---------|------|
| 💬 **Discord** | [go.zenyukti.in/discord](https://go.zenyukti.in/discord) |
| 📧 **Email** | [info@zenyukti.in](mailto:info@zenyukti.in) |
| 🐛 **Issues** | [GitHub Issues](https://github.com/ZenYukti/SkillSwap/issues) |

---

## 🙏 Thank You!

Every contribution matters, no matter how small. Thank you for helping make SkillSwap better!

---

<div align="center">
  <strong>Learn. Build. Share.</strong>
  <br>
  <em>"To grow together"</em> — Team ZenYukti 💜
</div>
