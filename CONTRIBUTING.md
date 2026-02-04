# Contributing to CLI AI Skills

Thank you for your interest in contributing! This guide will help you create high-quality AI skills.

---

## 🎯 How to Contribute

### 1. **Create New Skills**

Follow our guides:
- **[Skill Anatomy Guide](./docs/guides/skill-anatomy.md)** - Structure and metadata
- **[Quality Standards](./docs/guides/quality-standards.md)** - Best practices checklist
- **[Skills Development Guide](./docs/references/skills-development.md)** - Advanced creation

Key requirements:
- ✅ Zero-config design (no hardcoded paths/values)
- ✅ All 3 platforms supported (Copilot, Claude, Codex)
- ✅ Comprehensive documentation (1500-2000 words)
- ✅ Complete metadata (category, tags, risk, platforms)
- ✅ Semantic versioning (SemVer)
- ✅ Realistic examples (3-5 scenarios)

### 2. **Improve Existing Skills**

You can enhance existing skills by:
- Adding better detection patterns
- Improving clarifying questions
- Expanding framework coverage
- Adding more examples to documentation
- Fixing bugs or edge cases

### 3. **Report Issues**

Found a problem? [Open an issue](https://github.com/eric.andrade/cli-ai-skills/issues) with:
- **Skill name and version**
- **Platform** (GitHub Copilot CLI or Claude Code)
- **Input** (what you typed)
- **Expected behavior**
- **Actual behavior**

---

## 🚀 CI/CD & Version Control Guidelines

Before making contributions, please review our CI/CD guidelines to avoid common errors:

### Documentation

- **GitHub Actions Workflows:** See [.github/WORKFLOWS.md](.github/WORKFLOWS.md) for workflow structure, YAML best practices, and troubleshooting
- **Package Versioning:** See [cli-installer/VERSIONING.md](cli-installer/VERSIONING.md) for SemVer guidelines and release workflow

### Validation Scripts

Run validation scripts before pushing:

```bash
# Validate GitHub Actions workflows
./scripts/validate-workflows.sh

# Validate skills
./scripts/validate-skill-yaml.sh <skill-path>
./scripts/validate-skill-content.sh <skill-path>

# Check package before publishing
./scripts/pre-publish-check.sh

# Bump version safely
./scripts/bump-version.sh [patch|minor|major]
```

### Pre-Push Checklist

Before pushing changes:

- [ ] Code tested locally
- [ ] Skills validated with validation scripts (if applicable)
- [ ] Workflows validated with `./scripts/validate-workflows.sh` (if modified)
- [ ] If modified `package.json`: version bumped with `./scripts/bump-version.sh`
- [ ] If modified `package.json`: tests passed with `npm test`
- [ ] Commit message follows [Conventional Commits](https://www.conventionalcommits.org/) (feat/fix/docs/chore)
- [ ] README updated if necessary

---

## 📋 Contribution Workflow

### Step 1: Fork & Clone

```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/cli-ai-skills.git
cd cli-ai-skills
```

### Step 2: Create a Branch

```bash
git checkout -b feature/new-skill-name
# or
git checkout -b fix/issue-description
```

### Step 3: Develop Your Skill

**⚠️ Important:** Skills are maintained in `skills/` directory (single source).

**DO NOT edit** `.github/skills/`, `.claude/skills/`, or `.codex/skills/` directly (auto-generated).

**Follow the guide:** [Skills Development Guide](./resources/skills-development.md)

**Workflow for creating/editing skills:**

```bash
# 1. Create new skill (or edit existing in skills/)
./scripts/create-skill.sh your-skill
# This creates: skills/your-skill/

# 2. Edit the skill
vim skills/your-skill/SKILL.md
vim skills/your-skill/README.md

# 3. Build (sync to platforms)
./scripts/build-skills.sh

# 4. Validate
./scripts/validate-skill-yaml.sh skills/your-skill
./scripts/validate-skill-content.sh skills/your-skill

# 5. Update generated files (if metadata changed)
cd cli-installer
npm run generate-all

# 6. Commit everything
git add skills/ .github/ .claude/ .codex/ skills_index.json CATALOG.md
git commit -m "feat: add your-skill v1.0.0"
```

### Step 4: Test Your Skill

**Test checklist:**
- [ ] Skill triggers correctly
- [ ] Detection works for various inputs
- [ ] Clarifying questions are clear and concise
- [ ] Output is formatted correctly
- [ ] Works on both platforms (Copilot + Claude)
- [ ] Zero-config (no hardcoded values)
- [ ] README examples are accurate

### Step 5: Commit Your Changes

Use **semantic commit messages**:

```bash
# For new skills
git commit -m "feat: add <skill-name> skill v1.0.0"

# For improvements
git commit -m "feat(prompt-engineer): add support for framework X"

# For bug fixes
git commit -m "fix(prompt-engineer): correct detection pattern for Y"

# For documentation
git commit -m "docs(prompt-engineer): add example for use case Z"
```

### Step 6: Push & Create Pull Request

```bash
git push origin feature/new-skill-name
```

Then create a Pull Request on GitHub.

---

## ✅ Pull Request Guidelines

Your PR should include:

1. **Clear description** of what was added/changed
2. **Examples** demonstrating the skill in action
3. **Testing notes** showing you validated the skill works
4. **Updated documentation** (READMEs, index files)
5. **Version bumps** if modifying existing skills (follow SemVer)

**PR Template:**

```markdown
## Description
[What does this PR do?]

## Type of Change
- [ ] New skill
- [ ] Enhancement to existing skill
- [ ] Bug fix
- [ ] Documentation update

## Skill Name & Version
- **Skill:** [name]
- **Version:** [X.Y.Z]
- **Platforms:** [Copilot / Claude / Both]

## Testing
- [ ] Tested on GitHub Copilot CLI
- [ ] Tested on Claude Code
- [ ] Examples in README verified
- [ ] Zero-config compliance checked

## Examples
[Paste example usage showing input → output]

## Checklist
- [ ] Followed skills-development.md guide
- [ ] Created/updated README.md
- [ ] Updated index files
- [ ] Semantic commit messages
- [ ] No hardcoded values
```

---

## 🏗️ Code Standards

### SKILL.md Structure

Must include:
- **Frontmatter** (name, description, triggers, version)
- **Purpose** - What the skill does
- **When to Use** - Scenarios for invocation
- **Step 0: Discovery** (if applicable)
- **Workflow** - Step-by-step process
- **Critical Rules** - NEVER/ALWAYS guidelines
- **Example Usage** - 3-5 realistic examples

### README.md Structure

Must include:
- **Header** (name, version, status)
- **Overview** - High-level description
- **Features** - Bullet list of capabilities
- **Quick Start** - Trigger examples
- **Use Cases** - Practical scenarios
- **FAQ** - Common questions
- **Installation** - Global setup instructions

### Platform Synchronization

- **GitHub Copilot:** Uses `view`, `edit`, `bash` tools, prompts shown as `copilot>`
- **Claude Code:** Uses `Read`, `Edit`, `Bash` tools, prompts shown as `claude>`

**Workflow logic must be identical** across platforms - only tool names and prompt prefixes differ.

---

## 🐛 Reporting Bugs

**Template for bug reports:**

```markdown
**Skill:** [name] v[X.Y.Z]
**Platform:** [GitHub Copilot CLI / Claude Code]

**Input:**
```
[What you typed]
```

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- OS: [macOS / Linux / Windows]
- Tool version: [copilot CLI version or Claude version]

**Additional Context:**
[Any other relevant info]
```

---

## 💡 Feature Requests

Have an idea for a new skill or enhancement?

[Open an issue](https://github.com/eric.andrade/cli-ai-skills/issues) with:
- **Skill name** (if new skill)
- **Problem statement** - What pain point does this solve?
- **Proposed solution** - How would the skill work?
- **Example usage** - Show input/output flow
- **Frameworks** (if prompt engineering) - Which frameworks would it use?

---

## 📚 Resources

- **[Skills Development Guide](./resources/skills-development.md)** - Complete skill creation guide
- **[Repository README](./README.md)** - Project overview
- **[Existing Skills](./.github/skills/)** - Reference implementations

---

## 🙏 Thank You!

Your contributions make this library better for everyone. We appreciate:
- ⭐ Stars on GitHub
- 🐛 Bug reports
- 💡 Feature ideas
- 🚀 New skills
- 📖 Documentation improvements

**Questions?** Open an issue or discussion on GitHub.

---

**Happy coding! 🤖**
