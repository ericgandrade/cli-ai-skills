# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reusable AI skills library for **GitHub Copilot CLI** and **Claude Code**. Skills are Markdown-based workflow specifications (`SKILL.md`) that teach AI agents how to perform specific tasks. The project follows a **zero-config design philosophy** where skills auto-discover at runtime without hardcoded paths or values.

## Repository Structure

```
.github/skills/           # GitHub Copilot CLI skills
.claude/skills/           # Claude Code skills (identical workflow logic)
resources/
  skills-development.md   # Comprehensive developer guide
  templates/              # Skill creation templates
scripts/                  # Validation and automation scripts
```

Skills for both platforms must maintain **functional parity** - only tool names differ (`Read`/`Edit`/`Bash` for Claude vs `view`/`edit`/`run` for Copilot).

## Validation Commands

```bash
# Validate YAML frontmatter (kebab-case naming, required fields)
./scripts/validate-skill-yaml.sh .github/skills/<skill-name>

# Validate content quality (word count 1500-2000 ideal, writing style)
./scripts/validate-skill-content.sh .github/skills/<skill-name>

# Check installed AI tools
./scripts/check-tools.sh

# Create new skill scaffolding
./scripts/create-skill.sh <skill-name>

# Install skills via symlinks
./scripts/install-skills.sh $(pwd)
```

## Skill Architecture

Each skill directory contains:
- `SKILL.md` - Core specification with YAML frontmatter and workflow steps
- `README.md` - User-facing documentation
- `references/` - Detailed documentation (optional)
- `examples/` - Working code samples (optional)
- `scripts/` - Executable utilities (optional)

### SKILL.md Frontmatter Requirements

```yaml
---
name: kebab-case-name        # Required, lowercase with hyphens only
description: "This skill should be used when..."  # Required, third-person
triggers:                    # Recommended
  - "trigger phrase"
version: 1.0.0              # Required, SemVer
---
```

### Required Sections

1. **Purpose** - What the skill does
2. **When to Use** - Activation scenarios
3. **Workflow** - Step-by-step instructions (Step 0: Discovery if needed)
4. **Critical Rules** - NEVER/ALWAYS guidelines
5. **Example Usage** - 3-5 realistic scenarios

## Key Design Principles

### Zero-Config Philosophy
- **No hardcoded paths**: Discover file/folder structure at runtime
- **No hardcoded values**: Extract valid values from actual files
- **Ask when ambiguous**: Interactive clarification instead of assumptions
- **Pattern-based detection**: Use `*template*` not `/templates/`

### Discovery Pattern (Step 0)
Skills that interact with project structure should include a discovery phase that:
- Searches for relevant directories using glob patterns
- Asks user to choose if multiple found
- Offers fallbacks if none found
- Extracts values from YAML/JSON files dynamically

### Writing Style
- Skill names: **kebab-case only** (enforced by validation)
- Instructions: **imperative form** ("Run the command", not "You should run")
- Descriptions: **third-person** ("This skill should be used when...")
- Examples: **always in English** (code, prompts, field names)

## Commit Convention

```bash
feat: add <skill-name> skill v1.0.0      # New skill
feat(<skill-name>): <improvement>         # Enhancement
fix(<skill-name>): <bug fix>             # Bug fix
docs(<skill-name>): <update>             # Documentation
style: <formatting change>                # Style/naming
```

## Platform Synchronization

When modifying skills, update both platforms:
- `.github/skills/<name>/SKILL.md` (Copilot)
- `.claude/skills/<name>/SKILL.md` (Claude)

Tool name conversions:
| Claude Code | GitHub Copilot |
|-------------|----------------|
| `Read`      | `view`         |
| `Edit`      | `edit`         |
| `Write`     | `edit`         |
| `Bash`      | `run`          |
