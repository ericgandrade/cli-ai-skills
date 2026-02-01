# Skills Development Guide

Comprehensive guide for creating and maintaining AI Skills for **GitHub Copilot CLI** and **Claude Code**.

---

## 📚 Official References

| Tool | Documentation |
|------|---------------|
| Claude Code | https://code.claude.com/docs/en/skills |
| GitHub Copilot | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills |
| Agent Skills Standard | https://agentskills.io |

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

### 12-Step Process

1. **Define Purpose** - What problem does the skill solve?
2. **List Triggers** - What phrases should activate it?
3. **Design Discovery** (if needed) - What must be discovered at runtime?
4. **Write Workflow** - Step-by-step instructions
5. **Add Critical Rules** - NEVER/ALWAYS guidelines (focus on zero-config)
6. **Create Examples** - 3-5 realistic scenarios with input/output
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
grep -r "INBOX\|PROJECTS\|AREAS" ".github/skills/your-skill/SKILL.md"
grep -r 'status: \["' ".github/skills/your-skill/SKILL.md"
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
- **Document with examples** - Show real input → output flows
- **Version consistently** - Match across all files
- **Test on both platforms** - Ensure parity

### DON'T ❌

- **Hardcode paths** - Never assume folder structure
- **Hardcode values** - Never embed enum lists
- **Assume resources exist** - Always check and handle missing cases
- **Skip discovery** - Most skills benefit from Step 0
- **Forget README** - Documentation is critical
- **Break synchronization** - Keep platforms functionally identical

---

**Version:** 1.0.0  
**Last Updated:** February 2025  
**Status:** Zero-Config Compliant ✨
