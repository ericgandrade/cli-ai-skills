# Skills Development Guide

Comprehensive guide for creating and maintaining AI Skills for **GitHub Copilot CLI** and **Claude Code**.

---

## 📚 Official References

### Documentation

| Resource | URL | Purpose |
|----------|-----|---------|
| **Claude Code Skills** | https://code.claude.com/docs/en/skills | Official Claude skills documentation |
| **GitHub Copilot Agents** | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills | Copilot agent skills guide |
| **Agent Skills Standard** | https://agentskills.io | Open standard for AI agent skills |
| **Anthropic Prompt Engineering** | https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering | Best practices for Claude prompts |
| **Anthropic Agents & Tools** | https://docs.anthropic.com/en/docs/agents-and-tools | Building agents with Claude |

### Key Principles from Anthropic

This guide incorporates Anthropic's best practices for building effective AI agents:

1. **Clear Instructions** - Skills should have explicit, step-by-step workflows
2. **Contextual Information** - Provide relevant context through discovery phases
3. **Examples** - Include concrete examples (few-shot learning)
4. **Structured Output** - Define expected output formats clearly
5. **Error Handling** - Specify how to handle edge cases and missing resources
6. **Iterative Refinement** - Build discovery mechanisms that ask when uncertain

**Further Reading:**
- [Anthropic's Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [Building Effective Agents](https://docs.anthropic.com/en/docs/agents-and-tools)

---

## 🎯 What is a Skill?

A **skill** is a Markdown file (`SKILL.md`) containing structured instructions that teach an AI agent how to perform specific tasks.

### Core Components

- **SKILL.md file** - The skill specification with frontmatter and workflow
- **README.md** (optional but recommended) - User-facing documentation
- **Auxiliary files** (optional) - Scripts, templates, or resources

### Key Characteristics

- ✅ **Self-contained** - All instructions in one file
- ✅ **Structured workflow** - Step-by-step process
- ✅ **Trigger-based** - Activated by specific phrases or context
- ✅ **Tool-agnostic** - Works across different AI platforms

---

## 🏗️ Zero-Config Design Principles

Modern skills follow a **zero-configuration philosophy** for maximum portability and user experience.

### Core Principles

1. **No hardcoded paths** - Discover file/folder structure at runtime
2. **No hardcoded values** - Extract valid values from actual files when possible
3. **No configuration files** - Skills work out of the box
4. **Ask when ambiguous** - Interactive clarification instead of assumptions
5. **Context-agnostic** - Works with any project structure or methodology

### Discovery Pattern

Most skills that interact with project structure should include a **Step 0: Discovery** phase:

**When Step 0 is REQUIRED:**
- Skill creates/validates files based on templates or patterns
- Skill needs to understand project folder structure
- Skill extracts valid values from existing files
- Example: Note creation, file validation skills

**When Step 0 is OPTIONAL:**
- Skill works purely with content (not structure)
- Skill doesn't depend on templates or configuration
- Example: Content analysis, wikilink suggestion skills

**Standard Discovery Pattern:**

```markdown
### Step 0: Discovery

Before executing the main workflow, discover project configuration:

**Resource discovery:**
- Search for relevant directories using patterns (e.g., `*template*`, `*config*`)
- If multiple found → ask user which to use
- If none found → ask user for path OR offer to work without it

**Value extraction:**
- Parse files for valid values (e.g., YAML frontmatter, JSON config)
- Extract enums: `status: draft | review | published` → ["draft", "review", "published"]
- Build dynamic validation rules from discovered values

**Folder structure:**
- Pattern-based detection (avoid exact path matching)
- Example: `*inbox*`, `*project*`, `src/`, `docs/`
- Ask user to confirm when ambiguous
```

### Anti-Patterns to Avoid

❌ **NEVER do:**
- Hardcode absolute paths: `/path/to/folder/`
- Hardcode relative paths: `templates/`, `src/components/`
- Hardcode enum values: `["option1", "option2"]`
- Hardcode detection keywords: `if content.includes("meeting")`
- Assume folder structures exist without checking

✅ **ALWAYS do:**
- Discover at runtime: `search for patterns, ask if ambiguous`
- Extract from files: `parse YAML/JSON for valid values`
- Use pattern matching: `detect by structure, not keywords`
- Provide fallbacks: `offer to work without optional resources`
- Ask user confirmation: `when multiple valid options exist`

---

## 📦 Directory Structure

### Claude Code

```
.claude/
└── skills/
    └── <skill-name>/
        ├── SKILL.md          # Required (uppercase)
        ├── README.md         # Recommended
        ├── scripts/          # Optional
        └── resources/        # Optional
```

### GitHub Copilot

```
.github/
└── skills/
    └── <skill-name>/
        ├── SKILL.md          # Required (uppercase)
        ├── README.md         # Recommended
        ├── scripts/          # Optional
        └── resources/        # Optional
```

### Scope

| Type | Claude Path | Copilot Path | Scope |
|------|-------------|--------------|-------|
| **Project** | `.claude/skills/` | `.github/skills/` | Current project only |
| **Global** | `~/.claude/skills/` | `~/.copilot/skills/` | All projects |

---

## 🌍 Deployment Strategies

### Local (Project-Specific) Skills

**When to use:**
- Skill is specific to this project's structure
- Skill uses project-specific templates or conventions
- You want to version control the skill with the project

**Claude Code:**
```bash
.claude/skills/my-skill/SKILL.md
```

**GitHub Copilot:**
```bash
.github/skills/my-skill/SKILL.md
```

**Advantages:**
- ✅ Version controlled with project
- ✅ Team members get skill automatically
- ✅ Can reference project-specific resources

**Disadvantages:**
- ❌ Only available in this project
- ❌ Duplicated if used across projects

---

### Global (User-Wide) Skills

**When to use:**
- Skill works across any project
- Skill is general-purpose (e.g., prompt engineering, code formatting)
- You want skill available everywhere

**Claude Code:**
```bash
~/.claude/skills/my-skill/SKILL.md
```

**GitHub Copilot:**
```bash
~/.copilot/skills/my-skill/SKILL.md
```

**Advantages:**
- ✅ Available in all projects
- ✅ Single source of truth
- ✅ Update once, affects everywhere

**Disadvantages:**
- ❌ Not version controlled with project
- ❌ Team members must install separately

---

### Hybrid Approach (Recommended)

**Best practice:** Use a dedicated skills repository with global configuration.

**Structure:**
```
~/code/my-ai-skills/          # Git repository
├── .github/skills/
│   └── prompt-engineer/
└── .claude/skills/
    └── prompt-engineer/
```

**Configure tools to point to repository:**

**Claude:**
```bash
# ~/.claude/config.json
{
  "skills": {
    "directories": [
      "/absolute/path/to/my-ai-skills/.claude/skills"
    ]
  }
}
```

**Copilot:**
```bash
# ~/.copilot/config.json
{
  "skills": {
    "directories": [
      "/absolute/path/to/my-ai-skills/.github/skills"
    ]
  }
}
```

**Advantages:**
- ✅ Version controlled
- ✅ Available globally
- ✅ Easy to share (push to GitHub)
- ✅ Can be installed by others

---

### Decision Matrix

| Use Case | Deployment | Location |
|----------|-----------|----------|
| **Team project with custom structure** | Local | `.github/skills/` or `.claude/skills/` |
| **Personal workflow automation** | Global | `~/.copilot/skills/` or `~/.claude/skills/` |
| **Open source skill library** | Hybrid | Git repo + global config |
| **Experimental/testing** | Local | Project directory |

---

## 🔍 Environment Detection

Before creating skills, check which tools are installed on your system.

### Detection Script

Use the provided script to check your environment:

```bash
./scripts/check-tools.sh
```

**Sample output:**
```
🔍 Checking AI CLI tools installation...

✅ GitHub Copilot CLI: INSTALLED
   Version: gh-copilot 1.0.0
   Config: ~/.copilot/

✅ Claude Code: INSTALLED
   Version: claude 0.5.2
   Config: ~/.claude/

────────────────────────────────────────
✅ Both tools installed - create skills for both platforms
```

**Script location:** `scripts/check-tools.sh`

**What it checks:**
- GitHub Copilot CLI installation (`gh copilot`)
- Claude Code installation (`claude` command)
- Configuration directories
- Version information

---

## 🚀 Automated Setup

### Smart Skill Creator

Create skills automatically for only the tools you have installed:

```bash
./scripts/create-skill.sh my-new-skill
```

**What it does:**
1. Detects which tools are installed (Copilot/Claude)
2. Creates `SKILL.md` only for installed tools
3. Uses template with placeholders
4. Sets correct directory structure

**Sample output:**
```
🎯 Creating skill: my-new-skill

✅ Creating for GitHub Copilot...
   Created: .github/skills/my-new-skill/SKILL.md

✅ Creating for Claude Code...
   Created: .claude/skills/my-new-skill/SKILL.md

✅ Skill 'my-new-skill' created successfully!

Next steps:
  1. Edit SKILL.md file(s) with your skill logic
  2. Replace placeholders: [description], [triggers], [workflow]
  3. Add README.md for documentation
  4. Test: copilot> list skills
```

---

### Global Configuration Helper

Configure global skills from a repository:

```bash
./scripts/setup-global-skills.sh ~/code/claude-superskills
```

**What it does:**
1. Checks which tools are installed
2. Creates config files (`~/.copilot/config.json`, `~/.claude/config.json`)
3. Points tools to your skills repository
4. Verifies paths are valid

**Sample output:**
```
🔧 Setting up global skills from:
   /Users/you/code/claude-superskills

✅ Configuring GitHub Copilot...
   Config written to: ~/.copilot/config.json
   Skills path: /Users/you/code/claude-superskills/.github/skills

✅ Configuring Claude Code...
   Config written to: ~/.claude/config.json
   Skills path: /Users/you/code/claude-superskills/.claude/skills

✅ Global skills configured successfully!

Test with:
  copilot> list skills
  claude> list skills
```

---

## 📝 SKILL.md Structure

### Minimal Template

```markdown
---
name: skill-name
description: Use when user asks to "trigger phrase 1", "trigger phrase 2". [What the skill does].
triggers:
  - trigger phrase 1
  - trigger phrase 2
  - trigger phrase 3
version: 1.0.0
---

## Purpose

[What the skill does and why it exists]

## When to Use

- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Workflow

### Step 0: Discovery (if needed)

[Discovery logic for resources/configuration]

### Step 1: [Main Step Name]

[Detailed instructions]

### Step 2: [Next Step Name]

[Detailed instructions]

## Critical Rules

**NEVER:**
- ❌ [Anti-pattern 1]
- ❌ [Anti-pattern 2]

**ALWAYS:**
- ✅ [Best practice 1]
- ✅ [Best practice 2]

## Example Usage

**Example 1: [Scenario]**

Input:
```
user> [command]
```

Output:
```
[Expected result]
```
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ Yes | Unique identifier (lowercase-with-hyphens) |
| `description` | ✅ Yes | When to use + what it does. **Include trigger phrases.** |
| `triggers` | ⚠️ Recommended | Array of trigger phrases for better detection |
| `version` | ⚠️ Recommended | SemVer version (X.Y.Z) |

### Sections

| Section | Required | Purpose |
|---------|----------|---------|
| **Purpose** | ✅ Yes | Detailed explanation of goal |
| **When to Use** | ✅ Yes | Specific scenarios for invocation |
| **Workflow** | ✅ Yes | Step-by-step instructions |
| **Critical Rules** | ✅ Yes | NEVER/ALWAYS guidelines |
| **Example Usage** | ⚠️ Recommended | Real-world examples (3-5) |

---

## 📝 Writing Effective Workflows (Anthropic Best Practices)

### Principle 1: Clear and Specific Instructions

❌ **Vague:**
```markdown
Check if the file is good.
```

✅ **Specific:**
```markdown
Validate the file by checking:
1. Frontmatter has required fields (name, description, version)
2. All sections are present (Purpose, Workflow, Critical Rules)
3. Examples include both input and output
```

---

### Principle 2: Provide Context Through Discovery

Skills should discover context rather than assume it exists:

```markdown
### Step 0: Discover Project Context

**Templates discovery:**
- Search for `*template*` directories using Glob tool
- If multiple found, ask user: "Multiple template directories found: [list]. Which should I use?"
- Extract available types from `template-*.md` filenames

**This provides the AI with:**
- Available note types
- Valid template paths
- Project structure conventions
```

---

### Principle 3: Use Examples (Few-Shot Learning)

Include 3-5 diverse examples showing:
- **Simple cases** - Basic functionality
- **Complex cases** - Advanced usage
- **Edge cases** - Handling missing resources, ambiguity
- **Error handling** - What happens when things fail

**Example structure:**
```markdown
## Example Usage

**Example 1: Simple Case**
Input: [basic command]
Output: [expected result]

**Example 2: Complex Case**
Input: [advanced command]
Output: [detailed result]

**Example 3: Edge Case**
Input: [ambiguous command]
Skill asks: [clarifying question]
User responds: [choice]
Output: [final result]
```

---

### Principle 4: Structured Output

Define output format explicitly:

```markdown
**Output format:**
- Present result in Markdown code block
- Use YAML frontmatter for metadata
- Include validation checklist at the end
```

❌ **Vague:** "Create a note"
✅ **Specific:** "Create a Markdown file with YAML frontmatter, H1 title, and content sections"

---

### Principle 5: Error Handling

Specify fallback behavior for common failure scenarios:

```markdown
**If template not found:**
1. Ask user for template path
2. If user provides path → use it and proceed
3. If user skips → offer to create generic note without template
4. Never fail silently - always inform user of the situation
```

**Common scenarios to handle:**
- Resource not found (templates, config files)
- Multiple matches (ask user to choose)
- Invalid input (provide specific error message)
- Missing permissions (suggest workaround)

---

## 🌐 Language and Localization Guidelines

### Example Code and Prompts: Always English

**Critical Rule:** All code, prompts, and technical examples in SKILL.md **must be in English**.

**Rationale:**
- ✅ Universal understanding (most developers read English)
- ✅ Consistency across skills
- ✅ Better AI model performance (trained primarily on English)
- ✅ Open source collaboration (international contributors)

---

### What to Write in English

**Always English:**
- ✅ Code examples (Python, JavaScript, etc.)
- ✅ User prompts (`copilot>`, `claude>`)
- ✅ Tool commands (`view`, `edit`, `Bash`)
- ✅ Variable names, function names
- ✅ Code comments
- ✅ Output formats (JSON, YAML, Markdown)
- ✅ File names, directory names
- ✅ Field names in frontmatter (`status`, `priority`, not `estado`, `prioridade`)

**Can be Localized:**
- ✅ README.md (can have language-specific versions)
- ✅ Skill description in frontmatter (can be bilingual)
- ✅ User-facing messages in skill output (if target audience is non-English)

---

### Example Format (Correct ✅)

```markdown
## Example Usage

**Example 1: Create a new task**

Input:
```
copilot> create a task for implementing user authentication
```

Output:
```markdown
---
type: task
status: backlog
priority: high
created: 2025-02-01
---

# Implement User Authentication

## Description

Build authentication system with login/logout functionality.

## Acceptance Criteria

- [ ] User can register with email/password
- [ ] User can login with credentials
- [ ] Session management implemented
- [ ] Password hashing with bcrypt
```
```

---

### Anti-Pattern (Incorrect ❌)

```markdown
## Example Usage

**Exemplo 1: Criar uma tarefa**

Input:
```
copilot> criar uma tarefa para implementar autenticação
```

Output:
```markdown
---
tipo: tarefa
status: backlog
prioridade: alta
criado: 2025-02-01
---

# Implementar Autenticação

## Descrição

Construir sistema de autenticação com login/logout.
```
```

**Why this is wrong:**
- ❌ Portuguese prompts make examples less universal
- ❌ Localized field names (`tipo`, `prioridade`) are not standard
- ❌ Reduces portability and international adoption

---

### Bilingual Descriptions (Optional)

If you want to support multiple languages, use this format in frontmatter:

```yaml
---
name: my-skill
description: |
  EN: Creates structured notes with templates and validation.
  PT: Cria notas estruturadas com templates e validação.
triggers:
  - create note
  - criar nota
  - créer note
version: 1.0.0
---
```

**Triggers can be multilingual** (helps detection), but **workflow examples must remain in English**.

---

### Localized README (Optional)

You can create language-specific README files:

```
.github/skills/my-skill/
├── SKILL.md              # Always in English
├── README.md             # Primary (English)
├── README.pt-BR.md       # Portuguese (Brazil)
├── README.es.md          # Spanish
└── README.fr.md          # French
```

Link to localized versions at the top of primary README:

```markdown
# My Skill

**Languages:** [English](./README.md) | [Português](./README.pt-BR.md) | [Español](./README.es.md)

...
```

---

## 📖 README.md Structure

User-facing documentation (recommended for all skills):

```markdown
# Skill Name

**Version:** X.Y.Z  
**Status:** [Zero-Config / Requires Setup]

[Brief description]

## Overview

[What the skill does, why it's useful]

## Features

- ✨ [Feature 1]
- 🎯 [Feature 2]
- 🔄 [Feature 3]

## Quick Start

[How to use with examples]

## Triggers

- `trigger phrase 1`
- `trigger phrase 2`

## Examples

[3-5 realistic examples showing input → output]

## FAQ

[Common questions]

## Installation

[Setup instructions if needed]

---

**v[X.Y.Z]** | [Zero-Config / Custom status]
```

---

## 🔧 Available Tools

### Claude Code

| Tool | Purpose |
|------|---------|
| `Read` | Read file contents |
| `Edit` | Modify existing files |
| `Write` | Create new files |
| `Bash` | Execute shell commands |
| `Glob` | Search files by pattern |
| `Grep` | Search content in files |

### GitHub Copilot

| Tool | Purpose |
|------|---------|
| `view` | Read file contents |
| `edit` | Modify existing files |
| `run` | Execute shell commands |

---

## 🔄 Platform Synchronization

When creating skills for both platforms, maintain functional parity:

### Tool Name Conversion

| Claude Code | GitHub Copilot |
|-------------|----------------|
| `Read` | `view` |
| `Edit` | `edit` |
| `Write` | `edit` (for creation) |
| `Bash` | `run` |
| `Glob` | Manual pattern search |
| `Grep` | Manual content search |

### Synchronization Checklist

**SKILL.md Parity:**
- [ ] Frontmatter `name` is identical
- [ ] Frontmatter `description` has same triggers
- [ ] Frontmatter `triggers` array is identical
- [ ] Frontmatter `version` matches
- [ ] Discovery logic (Step 0) is functionally identical
- [ ] Main workflow steps are equivalent
- [ ] Critical Rules are the same
- [ ] Examples cover same use cases
- [ ] Tool references are correctly converted

**README.md Parity:**
- [ ] Overview is identical
- [ ] Features list is identical
- [ ] Usage examples have correct prompts (`copilot>` vs `claude>`)
- [ ] Version numbers match
- [ ] Installation instructions are platform-specific
- [ ] Status badges are consistent

**Index Updates:**
- [ ] Both index READMEs updated (`.github/skills/README.md`, `.claude/skills/README.md`)
- [ ] Skill description consistent across all files

### Workflow Logic Must Be Identical

⚠️ **Critical:** Only tool names and prompt prefixes should differ between platforms.

**Claude Code prompts:**
```
claude> create a new note
```

**GitHub Copilot prompts:**
```
copilot> create a new note
```

The actual workflow steps should produce the same results.

---

## 📋 Workflow: Creating a New Skill

### Step 0: Check Environment

**Before starting, determine where to create the skill:**

1. **Run detection script:**
   ```bash
   ./scripts/check-tools.sh
   ```

2. **Choose deployment strategy:**
   - **Local:** Create in project directory (`.github/skills/` or `.claude/skills/`)
   - **Global:** Create in `~/.copilot/skills/` or `~/.claude/skills/`
   - **Hybrid (Recommended):** Create in dedicated skills repository

3. **Use automated creator:**
   ```bash
   ./scripts/create-skill.sh my-skill-name
   ```
   
   This creates skill files **only for installed tools**.

---

### 12-Step Process

1. **Define Purpose** - What problem does the skill solve?
2. **List Triggers** - What phrases should activate it?
3. **Design Discovery** (if needed) - What must be discovered at runtime?
4. **Write Workflow** - Step-by-step instructions (following Anthropic principles)
5. **Add Critical Rules** - NEVER/ALWAYS guidelines (focus on zero-config + language)
6. **Create Examples** - 3-5 realistic scenarios **in English** with input/output
7. **Write SKILL.md** - For both platforms (Claude + Copilot)
8. **Write README.md** - For both platforms
9. **Update Index READMEs** - Add skill to both index files
10. **Validate** - Use testing checklist (see Testing & Validation section)
11. **Test Manually** - Invoke skill and verify behavior
12. **Commit** - Semantic commit message with version

---

## 🎨 Versioning Guidelines

Follow **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

### Version Changes

| Type | Version | When to Use |
|------|---------|-------------|
| **Major** | X.0.0 | Breaking changes (workflow restructure, removed features) |
| **Minor** | X.Y.0 | New features, backward-compatible enhancements |
| **Patch** | X.Y.Z | Bug fixes, documentation updates, minor improvements |

### Examples

- `1.0.0` → `2.0.0` - Switched from hardcoded values to zero-config discovery (breaking)
- `1.2.0` → `1.3.0` - Added support for new file types (backward-compatible)
- `1.2.3` → `1.2.4` - Fixed typo in example, updated README (patch)

### Version Fields

Update version in:
- [ ] SKILL.md frontmatter (`version: X.Y.Z`)
- [ ] README.md header (`**Version:** X.Y.Z`)
- [ ] README.md footer (`**vX.Y.Z**`)
- [ ] Index README when adding/updating skill
- [ ] Commit message (`feat: add skill-name v1.0.0`)

---

## ✅ Testing & Validation

### Pre-Commit Checklist

**Code Quality:**
- [ ] No hardcoded paths or values
- [ ] Discovery logic handles edge cases (not found, multiple results)
- [ ] User interaction prompts are clear and concise
- [ ] Tool references are platform-correct
- [ ] Examples use realistic scenarios
- [ ] Follows Anthropic best practices (clear instructions, context, examples, error handling)

**Language Compliance:**
- [ ] All code examples are in English
- [ ] All prompts (`copilot>`, `claude>`) are in English
- [ ] Output examples use English field names
- [ ] No mixed-language examples in workflow
- [ ] If bilingual support needed, triggers include multiple languages but examples stay English

**Documentation:**
- [ ] README.md exists with examples
- [ ] Triggers clearly listed
- [ ] Version numbers consistent across files
- [ ] Index READMEs updated

**Synchronization (if multi-platform):**
- [ ] Both SKILL.md files exist (.github + .claude)
- [ ] Workflow logic is identical
- [ ] Tool names are correctly converted
- [ ] Prompt prefixes are correct (`copilot>` vs `claude>`)

**Manual Testing:**
- [ ] Skill triggers correctly
- [ ] Discovery handles missing resources gracefully
- [ ] Output format is correct
- [ ] Works with different project structures

### Validation Commands

**Check for hardcoded patterns:**
```bash
# Search for common hardcoding anti-patterns
grep -r "00-\|01-\|02-\|03-\|04-\|05-" ".github/skills/your-skill/SKILL.md"
grep -r 'status: \["' ".github/skills/your-skill/SKILL.md"
```

**Check language compliance:**
```bash
# Check for non-English prompts in examples
grep -r "copilot> create\|copilot> make\|claude> create\|claude> make" ".github/skills/your-skill/SKILL.md"

# Check for localized field names in examples
grep -r "tipo:\|prioridade:\|estado:" ".github/skills/your-skill/SKILL.md"
```

**Check version consistency:**
```bash
# Extract versions from all files
grep "version:" ".github/skills/your-skill/SKILL.md"
grep "Version:" ".github/skills/your-skill/README.md"
```

---

## 🤝 Contributing to Skills

### Commit Message Format

Use semantic commit messages:

```bash
# New skill
git commit -m "feat: add <skill-name> skill v1.0.0"

# Enhancement
git commit -m "feat(skill-name): add support for X"

# Bug fix
git commit -m "fix(skill-name): correct Y detection"

# Documentation
git commit -m "docs(skill-name): add example for Z"

# Breaking change
git commit -m "feat(skill-name)!: migrate to zero-config discovery

BREAKING CHANGE: Removed hardcoded paths. Skills now discover structure at runtime."
```

### Pull Request Template

```markdown
## Description
[What does this PR do?]

## Type
- [ ] New skill
- [ ] Enhancement
- [ ] Bug fix
- [ ] Documentation

## Skill Details
- **Name:** [skill-name]
- **Version:** [X.Y.Z]
- **Platforms:** [Copilot / Claude / Both]

## Testing
- [ ] Tested on GitHub Copilot CLI
- [ ] Tested on Claude Code
- [ ] Examples verified
- [ ] Zero-config compliance checked
- [ ] No hardcoded values

## Checklist
- [ ] SKILL.md created for both platforms
- [ ] README.md created for both platforms
- [ ] Index READMEs updated
- [ ] Version numbers consistent
- [ ] Examples are realistic
- [ ] Critical Rules include anti-hardcoding
```

---

## 🛠️ Skill Development Tools

### Directory Setup

**Create new skill:**
```bash
# For both platforms
mkdir -p .github/skills/my-skill .claude/skills/my-skill
touch .github/skills/my-skill/SKILL.md
touch .claude/skills/my-skill/SKILL.md
```

### Quick Validation

**Check skill structure:**
```bash
SKILL_NAME="my-skill"

# Check files exist
test -f ".github/skills/$SKILL_NAME/SKILL.md" && echo "✅ Copilot SKILL.md exists"
test -f ".claude/skills/$SKILL_NAME/SKILL.md" && echo "✅ Claude SKILL.md exists"

# Check frontmatter
grep "^name:" ".github/skills/$SKILL_NAME/SKILL.md"
grep "^version:" ".github/skills/$SKILL_NAME/SKILL.md"
```

---

## 📚 Additional Resources

### Learning

- **Agent Skills Standard:** https://agentskills.io
- **Prompt Engineering Guide:** https://www.promptingguide.ai
- **SemVer Specification:** https://semver.org

### Examples

Study existing skills in this repository:
- `prompt-engineer` - Complex skill with framework selection
- (Add more as they're created)

### Community

- GitHub Discussions: Share skills and get feedback
- Issues: Report bugs or request features

---

## 🎓 Best Practices Summary

### DO ✅

- **Discovery over configuration** - Scan for resources at runtime
- **Ask over assume** - Interactive clarification when ambiguous
- **Patterns over exact matches** - `*template*` not `/templates/`
- **Extract over hardcode** - Parse files for valid values
- **Document with examples** - Show real input → output flows **in English**
- **Version consistently** - Match across all files
- **Test on both platforms** - Ensure parity
- **Follow Anthropic principles** - Clear instructions, context, examples, error handling
- **Use automated tools** - `./scripts/create-skill.sh` for consistency

### DON'T ❌

- **Hardcode paths** - Never assume folder structure
- **Hardcode values** - Never embed enum lists
- **Assume resources exist** - Always check and handle missing cases
- **Skip discovery** - Most skills benefit from Step 0
- **Forget README** - Documentation is critical
- **Break synchronization** - Keep platforms functionally identical
- **Write examples in non-English** - Code, prompts, outputs must be in English
- **Mix languages** - Keep examples consistent (English only)

---

## 📚 Additional Resources

### Learning

- **Anthropic Prompt Engineering:** https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering
- **Anthropic Agents & Tools:** https://docs.anthropic.com/en/docs/agents-and-tools
- **Agent Skills Standard:** https://agentskills.io
- **Semantic Versioning:** https://semver.org

### Scripts in This Repository

- **`./scripts/check-tools.sh`** - Detect installed AI CLI tools
- **`./scripts/create-skill.sh`** - Create new skill for installed tools
- **`./scripts/setup-global-skills.sh`** - Configure global skills

### Examples

Study existing skills in this repository:
- **`prompt-engineer`** - Complex skill with 11 frameworks, intent analysis, magic mode
- (More will be added as they're created)

### Community

- **GitHub Repository:** https://github.com/ericgandrade/claude-superskills
- **Issues:** Report bugs or request features
- **Discussions:** Share skills and get feedback

---

**Version:** 2.0.0  
**Last Updated:** February 2025  
**Status:** Zero-Config Compliant ✨ | Anthropic Best Practices ✅ | Language Guidelines 🌐
