# AGENTS.md

This file provides guidance for AI coding agents working with this repository. It contains build commands, testing instructions, and code style guidelines.

## Build, Lint, and Test Commands

### NPM Package Commands (cli-installer)

```bash
# Run tests
cd cli-installer && npm test

# Link package locally for testing
cd cli-installer && npm link

# Unlink local package
cd cli-installer && npm unlink -g claude-superskills

# Generate skills index and catalog
cd cli-installer && npm run generate-all
# Or individually:
npm run generate-index    # Updates skills_index.json
npm run generate-catalog  # Updates CATALOG.md

# Version bump and publish workflow
./scripts/bump-version.sh [patch|minor|major]  # Updates version, commits, tags
./scripts/pre-publish-check.sh                 # Validates before publishing
```

### Validation Scripts

```bash
# Validate a single skill's YAML frontmatter (kebab-case naming, required fields)
./scripts/validate-skill-yaml.sh skills/<skill-name>

# Validate a single skill's content quality (word count, writing style)
./scripts/validate-skill-content.sh skills/<skill-name>

# Validate all skills
for skill in skills/*/; do
  ./scripts/validate-skill-yaml.sh "$skill"
  ./scripts/validate-skill-content.sh "$skill"
done

# Build skills (sync source to platforms)
./scripts/build-skills.sh

# Validate GitHub Actions workflows
./scripts/validate-workflows.sh

# Verify version consistency across package.json files
./scripts/verify-version-sync.sh
```

### Installation & Setup

```bash
# Check which AI tools are installed (gh copilot, claude)
./scripts/check-tools.sh

# Install skills globally via symlinks (updates automatically on git pull)
./scripts/install-skills.sh $(pwd)

# Create new skill scaffolding
./scripts/create-skill.sh <skill-name>
```

### Running a Single Test

```bash
# Validate a specific skill's YAML
./scripts/validate-skill-yaml.sh skills/prompt-engineer

# Validate a specific skill's content
./scripts/validate-skill-content.sh skills/prompt-engineer

# Test skill creation
./scripts/create-skill.sh test-skill
```

## Code Style Guidelines

### General Principles

1. **Zero-Config Design** - Skills should auto-discover at runtime without hardcoded paths or values
2. **Platform Agnostic** - Code should work across GitHub Copilot CLI, Claude Code, and OpenAI Codex
3. **Self-Contained** - Each skill should be entirely contained in its SKILL.md file
4. **Discoverable** - Use runtime discovery patterns rather than hardcoded assumptions

### Imports and Dependencies

1. **No External Dependencies in Skills** - Skills are Markdown files and cannot import packages
2. **Shell Scripts** - Use standard bash/unix tools available on most systems
3. **Node.js Scripts** - Use dependencies already specified in cli-installer/package.json

### Formatting

1. **Skill Names** - Use kebab-case only (e.g., `prompt-engineer`, not `promptEngineer`)
2. **File Names** - Use lowercase with hyphens for separation
3. **Directory Structure** - Follow the established pattern of `skills/<skill-name>/SKILL.md`
4. **Code Blocks** - Use proper Markdown code blocks with language identifiers
5. **Line Length** - Keep lines under 100 characters when possible

### Types and Naming Conventions

1. **Variables** - Use descriptive names in snake_case for shell scripts
2. **Functions** - Use camelCase for JavaScript/TypeScript functions
3. **Constants** - Use UPPER_SNAKE_CASE for constants
4. **Types** - Use TypeScript interfaces and types when appropriate

### Error Handling

1. **Shell Scripts** - Use `set -e` to exit on errors
2. **Validation** - Always validate inputs and provide clear error messages
3. **Graceful Degradation** - Handle missing resources gracefully with fallbacks
4. **User Guidance** - Provide actionable error messages that guide users to solutions

### Documentation

1. **README Files** - All skills should have a README.md with usage examples
2. **Comments** - Shell scripts should have comments explaining complex operations
3. **Examples** - Include 3-5 realistic examples in skill documentation
4. **Frontmatter** - All SKILL.md files must have proper YAML frontmatter with name, description, and version

### Language Requirements

1. **English Only** - All code, comments, and documentation must be in English
2. **Third-Person Descriptions** - Use "This skill should be used when..." rather than "You should use this skill when..."
3. **Imperative Voice** - Use imperative form for instructions ("Run the command" not "You should run the command")

### Skill Structure

```markdown
---
name: kebab-case-name
description: "This skill should be used when..."
version: 1.0.0
---

## Purpose

[What the skill does]

## When to Use

- [Scenario 1]
- [Scenario 2]

## Workflow

### Step 0: Discovery (if needed)
[Runtime discovery of paths/values]

### Step 1: [Action]
[Instructions]

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

### Platform Synchronization

1. **Tool Names** - Convert tool names appropriately:
   - Claude Code: `Read`, `Edit`, `Bash`
   - GitHub Copilot: `view`, `edit`, `bash`
2. **Prompt Prefixes** - Use appropriate prefixes:
   - Copilot: `copilot>`
   - Claude: `claude>`
3. **Functional Parity** - Maintain identical workflow logic across platforms

### Validation Requirements

Before committing new or modified skills, ensure:

1. **YAML Frontmatter**:
   - Name is kebab-case
   - Required fields present: `name`, `description`, `version`
   - Version follows SemVer (X.Y.Z)

2. **Content Quality**:
   - Word count 1500-2000 ideal (5000 max)
   - No second-person ("you should")
   - Imperative form used
   - 3-5 realistic examples included

3. **Structure**:
   - Required sections present: Purpose, When to Use, Workflow, Critical Rules, Example Usage
   - Step 0: Discovery included if skill interacts with project structure
   - NEVER/ALWAYS guidelines in Critical Rules

### Commit Convention

```bash
feat: add <skill-name> skill v1.0.0      # New skill
feat(<skill-name>): <improvement>         # Enhancement
fix(<skill-name>): <bug fix>             # Bug fix
docs(<skill-name>): <update>             # Documentation
style: <formatting change>                # Style/naming
chore: <maintenance task>                 # Tooling, dependencies
```

### Versioning

Follow Semantic Versioning (SemVer):
- MAJOR version for breaking changes
- MINOR version for new features
- PATCH version for bug fixes

### Testing

1. **Pre-Commit Validation** - Run validation scripts before committing
2. **Manual Testing** - Test skills after installation with trigger phrases
3. **Cross-Platform Testing** - Verify functionality on all supported platforms