# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reusable AI skills library for **5 AI CLI platforms**: GitHub Copilot CLI, Claude Code, OpenAI Codex, OpenCode, and Gemini CLI. Skills are Markdown-based workflow specifications (`SKILL.md`) that teach AI agents how to perform specific tasks. The project includes:

1. **Universal Skills Library** - Skills that work across all platforms
2. **NPM Installer Package** - `cli-ai-skills` package for zero-config installation
3. **Zero-Config Philosophy** - Skills auto-discover project structure at runtime

## Repository Architecture

This is a **monorepo** with two main components:

```
cli-ai-skills/
├── skills/                    # Master skills source (single source of truth)
│   ├── skill-creator/
│   ├── prompt-engineer/
│   ├── youtube-summarizer/
│   └── audio-transcriber/
│
├── .github/skills/            # GitHub Copilot CLI (auto-synced from skills/)
├── .claude/skills/            # Claude Code (auto-synced from skills/)
├── .codex/skills/             # OpenAI Codex (auto-synced from skills/)
├── .opencode/skills/          # OpenCode (auto-synced from skills/)
├── .gemini/skills/            # Gemini CLI (auto-synced from skills/)
│
├── cli-installer/             # NPM package that installs skills
│   ├── bin/cli.js            # Main CLI entry point
│   ├── lib/                  # Platform-specific installers
│   │   ├── copilot.js        # GitHub Copilot installer
│   │   ├── claude.js         # Claude Code installer
│   │   ├── codex.js          # OpenAI Codex installer
│   │   ├── opencode.js       # OpenCode installer
│   │   ├── gemini.js         # Gemini CLI installer
│   │   ├── detector.js       # Platform detection
│   │   ├── bundles.js        # Skill bundle definitions
│   │   ├── search.js         # Skill search functionality
│   │   └── version-checker.js # Update notifications
│   ├── package.json          # NPM package manifest (v1.7.2)
│   └── skills/               # Bundled skills for distribution
│
├── scripts/                   # Build, validation, and automation
│   ├── build-skills.sh       # Syncs skills/ to all platform directories
│   ├── validate-skill-yaml.sh
│   ├── validate-skill-content.sh
│   ├── create-skill.sh
│   ├── generate-catalog.py   # Auto-generates CATALOG.md
│   ├── generate-skills-index.py # Auto-generates README.md
│   ├── pre-publish-check.sh  # NPM publish validation
│   └── bump-version.sh       # Version management
│
├── resources/
│   └── skills-development.md # Comprehensive developer guide
│
└── docs/                      # User documentation
    ├── guides/
    │   ├── getting-started.md
    │   ├── skill-anatomy.md
    │   └── quality-standards.md
    └── bundles/
        └── bundles.md
```

### Key Architecture Principles

1. **Single Source of Truth**: All skills are maintained in `skills/` directory
2. **Build-Time Sync**: `./scripts/build-skills.sh` syncs to all platform directories
3. **Platform-Specific Installers**: Each platform has its own installer in `cli-installer/lib/`
4. **Auto-Discovery**: Skills discover project structure at runtime (no hardcoded paths)
5. **Bundle System**: Skills are grouped into curated bundles (essential, content, developer, all)

## Development Commands

### Skill Development

```bash
# Create new skill (creates in skills/ directory)
./scripts/create-skill.sh <skill-name>

# Validate a single skill's YAML frontmatter (kebab-case naming, required fields)
./scripts/validate-skill-yaml.sh skills/<skill-name>

# Validate a single skill's content quality (word count 1500-2000 ideal, writing style)
./scripts/validate-skill-content.sh skills/<skill-name>

# Validate all skills at once
for skill in skills/*/; do
  ./scripts/validate-skill-yaml.sh "$skill"
  ./scripts/validate-skill-content.sh "$skill"
done

# Build: sync skills/ to all platform directories (.github/, .claude/, .codex/, .opencode/, .gemini/)
./scripts/build-skills.sh

# Check which AI tools are installed on the system
./scripts/check-tools.sh
```

### CLI Installer Development

```bash
# Navigate to installer package
cd cli-installer

# Install dependencies
npm install

# Test CLI locally (links globally)
npm link

# Run CLI after linking
cli-ai-skills --help
cli-ai-skills --list-bundles

# Run tests
npm test

# Build skills and generate documentation (runs build + catalog + index)
npm run generate-all

# Just build skills (syncs to platform directories and cli-installer/skills/)
npm run build

# Generate CATALOG.md
npm run generate-catalog

# Generate skills index README.md
npm run generate-index

# Unlink after testing
npm unlink -g cli-ai-skills
```

### Publishing Workflow

```bash
# 1. Ensure all skills are synced and validated
./scripts/build-skills.sh

# 2. Bump version (updates package.json and tags)
./scripts/bump-version.sh [patch|minor|major]

# 3. Run pre-publish checks
./scripts/pre-publish-check.sh

# 4. Publish to npm (done via GitHub Actions, but can be manual)
cd cli-installer && npm publish

# Note: GitHub Actions workflow (.github/workflows/publish-npm.yml) handles automated publishing
```

### Testing

**Test locally with npm link:**
```bash
cd cli-installer
npm link
cli-ai-skills install --all --yes

# Test in a new terminal session
gh copilot -p "improve this prompt: create REST API"  # GitHub Copilot
# or
claude -p "improve this prompt: create REST API"      # Claude Code
```

**Test NPX without installation:**
```bash
# Test the installer (uses local version)
npx cli-ai-skills --help

# Test skill triggers (after installation)
gh copilot -p "improve this prompt: create REST API"
```

### Pre-commit Validation Checklist

Before committing new or modified skills, confirm all three pass:

1. **YAML frontmatter** — `name` is kebab-case; `name`, `description`, `version` present; version is SemVer (X.Y.Z)
2. **Content** — Word count 1500–2000 (max 5000); no second-person ("you should"); imperative form used; 3–5 realistic examples included
3. **Structure** — Required sections present: Purpose, When to Use, Workflow, Critical Rules, Example Usage; Step 0: Discovery included if the skill interacts with project structure

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

## Important Notes

### Version Consistency

The package version is defined in `cli-installer/package.json` (currently v1.7.2). However, there are version references in multiple places:

- `cli-installer/package.json`: **v1.7.2** (source of truth for npm)
- `cli-installer/bin/cli.js`: **v1.6.0** (hardcoded, needs update)
- `README.md`: States **v1.7.1** and **v1.5.0** in different places

**When bumping versions:**
1. Run `./scripts/bump-version.sh [patch|minor|major]` to update package.json
2. Manually update `VERSION` constant in `cli-installer/bin/cli.js`
3. Update version badges/references in README.md
4. Update CHANGELOG.md with release notes

### Build Before Commit

Always run build script before committing skill changes:

```bash
# 1. Edit skills in skills/ directory
# 2. Build to sync to all platforms
./scripts/build-skills.sh
# 3. Commit all changed platform directories
git add skills/ .github/ .claude/ .codex/ .opencode/ .gemini/ cli-installer/skills/
git commit -m "feat: update skill-name"
```

### NPM Package Structure

The `cli-installer/skills/` directory is bundled into the npm package. The build script syncs `skills/` → `cli-installer/skills/` so users get the latest skills when they run `npm install -g cli-ai-skills`.

## Commit Convention

```bash
feat: add <skill-name> skill v1.0.0      # New skill
feat(<skill-name>): <improvement>         # Enhancement
fix(<skill-name>): <bug fix>             # Bug fix
docs(<skill-name>): <update>             # Documentation
chore: bump version to X.Y.Z              # Version bump
build: rebuild skills for all platforms   # Build changes
```

## CLI Installer Architecture

The `cli-installer/` package provides a zero-config multi-platform installer. Key components:

### CLI Entry Point (`bin/cli.js`)

- **Command Aliases**: `i` (install), `ls` (list), `up` (update), `rm` (uninstall), `doc` (doctor)
- **Short Flags**: `-a` (--all), `-g` (--global), `-l` (--local), `-y` (--yes), `-q` (--quiet)
- **Version Checking**: Automatically checks for updates on launch
- **ESC Key Support**: Press ESC to cancel interactive prompts (v1.7.0+)

### Platform Installers (`lib/`)

Each platform has a dedicated installer module:

- **`copilot.js`**: Installs to `~/.github/skills/` (GitHub Copilot CLI)
- **`claude.js`**: Installs to `~/.claude/skills/` (Claude Code)
- **`codex.js`**: Installs to `~/.codex/skills/` (OpenAI Codex)
- **`opencode.js`**: Installs to `~/.opencode/skills/` (OpenCode)
- **`gemini.js`**: Installs to `~/.gemini/skills/` (Gemini CLI)

All installers:
1. Detect if the platform is installed (`detector.js`)
2. Copy skills from `cli-installer/skills/` to platform-specific directory
3. Create skill directories with `SKILL.md` and optional `README.md`
4. Handle updates (overwrite existing) and uninstalls (remove directories)

### Bundle System (`lib/bundles.js`)

Curated skill collections:
- **essential**: `skill-creator`, `prompt-engineer` (recommended for beginners)
- **content**: `youtube-summarizer`, `audio-transcriber` (content creation)
- **developer**: `skill-creator` (for skill development)
- **all**: Complete collection

### Search Functionality (`lib/search.js`)

Keyword-based skill search that matches:
- Skill name
- Description
- Category
- Tags

Example: `cli-ai-skills --search "prompt"` finds `prompt-engineer`

## Platform Synchronization

**IMPORTANT**: Edit skills in `skills/` directory only, then run build script.

```bash
# 1. Edit skill in source directory
vim skills/my-skill/SKILL.md

# 2. Run build to sync to all platforms
./scripts/build-skills.sh

# This syncs to:
# - .github/skills/     (GitHub Copilot)
# - .claude/skills/     (Claude Code)
# - .codex/skills/      (OpenAI Codex)
# - .opencode/skills/   (OpenCode)
# - .gemini/skills/     (Gemini CLI)
# - cli-installer/skills/ (for npm package)
```

Tool name conversions (skills are platform-agnostic, but documentation may reference tools):
| Claude Code | GitHub Copilot |
|-------------|----------------|
| `Read`      | `view`         |
| `Edit`      | `edit`         |
| `Write`     | `edit`         |
| `Bash`      | `bash`         |

## Automation Scripts

### Python Scripts

- **`generate-catalog.py`**: Auto-generates `CATALOG.md` from skill metadata
  - Parses YAML frontmatter from all skills in `skills/`
  - Creates markdown table with skill details
  - Run: `python3 scripts/generate-catalog.py`

- **`generate-skills-index.py`**: Auto-generates skill index README files
  - Updates `.github/skills/README.md` and `.claude/skills/README.md`
  - Run: `python3 scripts/generate-skills-index.py`

### Validation Scripts

- **`validate-skill-yaml.sh`**: Validates YAML frontmatter
  - Checks required fields: name, description, version
  - Enforces kebab-case naming
  - Validates SemVer version format

- **`validate-skill-content.sh`**: Validates content quality
  - Word count: 1500-2000 ideal, max 5000
  - No second-person ("you should")
  - Imperative form usage
  - 3-5 examples required

- **`validate-workflows.sh`**: Validates GitHub Actions YAML syntax

### Build & Version Management

- **`build-skills.sh`**: Master build script
  - Syncs `skills/` to all platform directories using rsync
  - Excludes `.git`, `node_modules`, `.DS_Store`
  - Verifies sync completion

- **`bump-version.sh`**: Semantic version bumping
  - Usage: `./scripts/bump-version.sh [patch|minor|major]`
  - Updates `cli-installer/package.json`
  - Creates git tag
  - Commits version change

- **`pre-publish-check.sh`**: NPM publish validation
  - Checks package.json exists
  - Verifies version not already published
  - Runs tests
  - Calculates package size
  - Runs security audit

### Skill Types

Skills in this repository fall into categories:

- **Meta-skills** — Create or manage other skills (e.g., `skill-creator`)
- **Automation** — Workflow optimization (e.g., `prompt-engineer`)
- **Content** — Media processing (e.g., `youtube-summarizer`, `audio-transcriber`)
- **Analysis** — Code review, exploration (future)
- **Documentation** — Generate docs, READMEs (future)
