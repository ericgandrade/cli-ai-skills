# Copilot Instructions for CLI AI Skills

This repository contains reusable AI skills for **GitHub Copilot CLI**, **Claude Code**, and **OpenAI Codex**. Skills are Markdown-based workflow specifications (`SKILL.md`) that teach AI agents specific tasks.

## ⚠️ Important: Single Source of Truth

Skills are maintained in **`skills/`** directory (single source) and automatically synchronized to platform directories.

**DO NOT EDIT:**
- ❌ `.github/skills/` (auto-generated)
- ❌ `.claude/skills/` (auto-generated)
- ❌ `.codex/skills/` (auto-generated)

**DO EDIT:**
- ✅ `skills/` (source of truth)

After editing, run:
```bash
./scripts/build-skills.sh
# or
cd cli-installer && npm run build
```

## Build, Test, and Lint Commands

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

### Skill Installation via NPM (End Users)

The repository includes a CLI installer package (`cli-installer/`) that users can run to install skills:

```bash
# Zero-config installation (interactive)
npx claude-superskills

# Install specific bundle
npx claude-superskills --bundle essential -y    # skill-creator, prompt-engineer
npx claude-superskills --bundle content -y      # youtube-summarizer, audio-transcriber
npx claude-superskills --bundle developer -y    # skill-creator only
npx claude-superskills --bundle all -y          # All skills

# Install all skills
npx claude-superskills --all -y

# Search for skills
npx claude-superskills --search "prompt"

# List installed skills
npx claude-superskills list    # or: ls

# Update skills
npx claude-superskills update  # or: up

# Uninstall skills
npx claude-superskills uninstall <skill-name>  # or: rm

# Check installation health
npx claude-superskills doctor  # or: doc
```

Bundles are defined in `bundles.json` at repository root.

### Manual Testing

Test skills by installing them and running through trigger phrases:

```bash
# Install skills first
./scripts/install-skills.sh $(pwd)

# Test in new terminal session
gh copilot -p "improve this prompt: create REST API"

# Validate individual skill components
./scripts/validate-skill-yaml.sh .github/skills/prompt-engineer
./scripts/validate-skill-content.sh .github/skills/prompt-engineer
```

## Architecture

### Multi-Platform Design

Skills maintain **functional parity** across three platforms:

- **GitHub Copilot CLI** (`.github/skills/`) - Uses `view`, `edit`, `bash` tools
- **Claude Code** (`.claude/skills/`) - Uses `Read`, `Edit`, `Bash` tools
- **OpenAI Codex** (`.codex/skills/`) - Uses similar tool conventions

Only tool names and prompt prefixes differ (`copilot>`, `claude>`, `codex>`). Workflow logic is identical across all platforms.

### Skill Structure

Each skill is a directory containing:

```
skill-name/
├── SKILL.md           # Core specification with YAML frontmatter + workflow
├── README.md          # User-facing documentation
├── references/        # Optional: Detailed docs
├── examples/          # Optional: Working code samples
└── scripts/           # Optional: Executable utilities
```

### SKILL.md Anatomy

```yaml
---
name: kebab-case-name        # Required, lowercase with hyphens only
description: "This skill should be used when..."  # Required, third-person
triggers:                    # Recommended
  - "trigger phrase"
version: 1.0.0              # Required, SemVer
---

## Purpose
[What the skill does]

## When to Use
[Activation scenarios]

## Workflow
### Step 0: Discovery (if applicable)
[Runtime discovery of paths/values]

### Step 1: [Action]
[Instructions]

## Critical Rules
[NEVER/ALWAYS guidelines]

## Example Usage
[3-5 realistic scenarios]
```

### Zero-Config Philosophy

Skills follow a **zero-configuration design** to work universally:

1. **No hardcoded paths** - Discover file/folder structure at runtime using glob patterns
2. **No hardcoded values** - Extract valid values from actual files (YAML, JSON, etc.)
3. **No configuration files** - Skills work out of the box
4. **Ask when ambiguous** - Interactive clarification instead of assumptions
5. **Pattern-based detection** - Use `*template*` not `/templates/`

**Discovery Pattern (Step 0):**

Skills that interact with project structure should include a discovery phase:

- Search for relevant directories using patterns (e.g., `*template*`, `*config*`)
- Ask user to choose if multiple found
- Offer fallbacks if none found
- Extract values from YAML/JSON files dynamically

### Bundles System

The repository uses a **curated bundles system** defined in `bundles.json` at the root:

**Bundle Structure:**
```json
{
  "bundles": {
    "bundle-name": {
      "name": "Display Name",
      "description": "User-facing description",
      "skills": ["skill-1", "skill-2"],
      "use_cases": ["Use case 1", "Use case 2"],
      "target": "Target audience"
    }
  }
}
```

**Available Bundles:**

| Bundle | Skills Included | Target Audience |
|--------|-----------------|-----------------|
| **essential** | skill-creator, prompt-engineer | Beginners, skill developers |
| **content** | youtube-summarizer, audio-transcriber | Content creators, researchers |
| **developer** | skill-creator | Skill developers, power users |
| **all** | All 4 skills | Power users, comprehensive setup |

**When to update bundles.json:**
- Adding a new skill → Add to appropriate bundle(s)
- Removing a skill → Remove from all bundles
- Creating skill category → Consider creating new bundle
- Bundle changes require version bump in `cli-installer/package.json`

**Bundle documentation location:** `docs/bundles/bundles.md`

## Key Conventions

### Naming & Writing Style

- **Skill names:** kebab-case only (e.g., `prompt-engineer`, not `promptEngineer`)
- **Instructions:** Imperative form ("Run the command", not "You should run")
- **Descriptions:** Third-person ("This skill should be used when...")
- **Examples:** Always in English (code, prompts, field names)

### Platform Synchronization

When modifying skills, **update all three platforms**:

1. `.github/skills/<name>/SKILL.md` (Copilot)
2. `.claude/skills/<name>/SKILL.md` (Claude)
3. `.codex/skills/<name>/SKILL.md` (Codex)

When adding new skills, also update all index files:
- `.github/skills/README.md`
- `.claude/skills/README.md`
- `.codex/skills/README.md`

Tool name conversions:

| Claude Code | Codex | GitHub Copilot |
|-------------|-------|----------------|
| `Read`      | `Read`| `view`         |
| `Edit`      | `Edit`| `edit`         |
| `Write`     | `Write`| `edit`        |
| `Bash`      | `Bash`| `bash`         |

Prompt prefix conversions:
- Copilot examples: `copilot> [command]`
- Claude examples: `claude> [command]`
- Codex examples: `codex> [command]`

### Commit Conventions

```bash
feat: add <skill-name> skill v1.0.0      # New skill
feat(<skill-name>): <improvement>         # Enhancement
fix(<skill-name>): <bug fix>             # Bug fix
docs(<skill-name>): <update>             # Documentation
style: <formatting change>                # Style/naming
chore: <maintenance task>                 # Tooling, dependencies
```

### Version Bumping

```bash
# Use the automated script to bump version
./scripts/bump-version.sh patch   # Bug fixes (1.5.0 → 1.5.1)
./scripts/bump-version.sh minor   # New features/skills (1.5.0 → 1.6.0)
./scripts/bump-version.sh major   # Breaking changes (1.5.0 → 2.0.0)

# Script automatically:
# - Updates cli-installer/package.json
# - Updates cli-installer/package-lock.json
# - Creates git commit with conventional message
# - Creates git tag (v1.5.1)
# - Pushes commit and tag to origin

# Pre-publish validation
./scripts/pre-publish-check.sh
# Checks:
# - Package version is not already published on npm
# - package-lock.json exists
# - All tests pass
# - Working directory is clean
```

### NPM Publishing Workflow

The repository uses GitHub Actions to automatically publish to npm when a version tag is pushed:

1. Bump version with script: `./scripts/bump-version.sh [patch|minor|major]`
2. GitHub Actions workflow `.github/workflows/publish-npm.yml` automatically triggers
3. Package is published from `cli-installer/` subdirectory
4. Publishing requires `NPM_TOKEN` secret to be configured

**Manual publishing (if needed):**
```bash
cd cli-installer
npm publish
```

### Validation Requirements

Before committing new/modified skills:

1. **YAML frontmatter validation:**
   - Name must be kebab-case
   - Required fields: `name`, `description`, `version`
   - Version must follow SemVer (X.Y.Z)

2. **Content validation:**
   - Word count: 1500-2000 ideal (5000 max)
   - Avoid second-person ("you should")
   - Use imperative form for instructions
   - Include 3-5 realistic examples

3. **Structure validation:**
   - Required sections: Purpose, When to Use, Workflow, Critical Rules, Example Usage
   - Include Step 0: Discovery if skill interacts with project structure
   - Provide NEVER/ALWAYS guidelines in Critical Rules

### Documentation Structure

- **SKILL.md** - Technical specification for AI agent
- **README.md** - User-facing documentation with installation, features, use cases, FAQ
- **resources/skills-development.md** - Comprehensive developer guide
- **resources/templates/** - Skill creation templates

### Generated Files

The repository maintains auto-generated index files that should **not be edited manually**:

**skills_index.json** (root directory)
- Generated by: `npm run generate-index` or `npm run generate-all`
- Contains: All skills metadata (name, version, description, category, tags, risk, platforms, triggers)
- Used by: CLI installer for search, listing, and skill discovery
- Regenerate after: Adding/removing skills, updating SKILL.md frontmatter

**CATALOG.md** (root directory)
- Generated by: `npm run generate-catalog` or `npm run generate-all`
- Contains: Formatted skill catalog with full metadata
- Used by: Documentation, GitHub README
- Regenerate after: Any skill metadata changes

**Important:** Always run `npm run generate-all` after modifying skills to keep these files in sync.

### File Organization

```
skills/                    # ← SOURCE OF TRUTH
  audio-transcriber/
    SKILL.md
    README.md
  prompt-engineer/
  skill-creator/
  youtube-summarizer/
.github/
  skills/                  # ← AUTO-GENERATED (do not edit!)
    README.md              # Warning about auto-generation
    audio-transcriber/
    ...
  workflows/               # GitHub Actions CI/CD
    publish-npm.yml        # Auto-publish to npm on version tags
    validate.yml           # CI validation on push/PR
  WORKFLOWS.md             # Workflow documentation
.claude/
  skills/                  # ← AUTO-GENERATED (do not edit!)
    README.md
    ...
.codex/
  skills/                  # ← AUTO-GENERATED (do not edit!)
    README.md
    ...
cli-installer/             # NPM package for skill installation
  bin/                     # CLI executable
  lib/                     # Installer logic
  package.json             # Package manifest (version source of truth)
  VERSIONING.md            # Version strategy guide
resources/
  skills-development.md    # Developer guide
  templates/               # Skill creation templates
scripts/
  build-skills.sh          # ← IMPORTANT: Sync source → platforms
  bump-version.sh          # Automated version bumping
  validate-*.sh            # Validation scripts
  create-skill.sh          # Skill scaffolding
examples/                  # Example skill usage
```

## Important Notes

### Creating New Skills

**ALWAYS use the scaffolding script** instead of manual creation:

```bash
./scripts/create-skill.sh my-skill-name
```

This creates skill in `skills/my-skill-name/` then run `./scripts/build-skills.sh` to sync to platforms.

This ensures:
- Correct directory structure in source
- YAML frontmatter template
- Automatic sync to all three platform directories
- Validation-ready skeleton
- Proper kebab-case naming enforcement

**Workflow for creating skills:**
```bash
# 1. Create skill
./scripts/create-skill.sh my-skill

# 2. Edit in source directory
vim skills/my-skill/SKILL.md

# 3. Build (sync to platforms)
./scripts/build-skills.sh

# 4. Validate
./scripts/validate-skill-yaml.sh skills/my-skill
./scripts/validate-skill-content.sh skills/my-skill

# 5. Commit
git add skills/ .github/ .claude/ .codex/
git commit -m "feat: add my-skill v1.0.0"
```

**Never create skill directories manually** - the script handles all required boilerplate and ensures consistency.

### Skill Types

Skills in this repository fall into categories:

- **Universal skills** - Work anywhere (e.g., `prompt-engineer`)
- **Meta-skills** - Create/manage other skills (e.g., `skill-creator`)
- **Analysis skills** - Code review, exploration
- **Documentation skills** - Generate docs, READMEs
- **Testing skills** - Validation, test generation

### Existing Skills

Current skills available in this repository:

| Skill | Version | Category | Platforms |
|-------|---------|----------|-----------|
| **skill-creator** | v1.3.0 | Meta | All 3 platforms |
| **prompt-engineer** | v1.1.0 | Automation | All 3 platforms |
| **youtube-summarizer** | v1.2.0 | Content | All 3 platforms |
| **audio-transcriber** | v1.2.0 | Content | All 3 platforms |

All skills follow the zero-config philosophy and work universally across projects.

### Resources

- **[Skills Development Guide](./resources/skills-development.md)** - Comprehensive skill creation guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[CLAUDE.md](./CLAUDE.md)** - Claude Code specific guidance (similar content)
- **[Templates](./resources/templates/)** - Skill templates and style guides

## References

- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills)
- [GitHub Copilot Agents](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Agent Skills Standard](https://agentskills.io)
- [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [Anthropic Agents & Tools](https://docs.anthropic.com/en/docs/agents-and-tools)
