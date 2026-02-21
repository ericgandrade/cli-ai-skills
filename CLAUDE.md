# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**claude-superskills** is a reusable AI skills library for **8 AI platforms**: GitHub Copilot CLI, Claude Code, OpenAI Codex, OpenCode, Gemini CLI, Antigravity, Cursor IDE, and AdaL CLI. Skills are Markdown-based workflow specifications (`SKILL.md`) that teach AI agents how to perform specific tasks.

- **npm package**: `claude-superskills` (v1.12.10) — `npx claude-superskills`
- **GitHub**: `https://github.com/ericgandrade/claude-superskills`
- **Old package** `cli-ai-skills` is deprecated, redirects to this one

## Repository Architecture

```
claude-superskills/
├── skills/                    # SINGLE SOURCE OF TRUTH for all skills
│   ├── skill-creator/
│   ├── prompt-engineer/
│   ├── youtube-summarizer/
│   ├── audio-transcriber/
│   ├── docling-converter/
│   ├── agent-skill-discovery/
│   ├── agent-skill-orchestrator/
│   ├── brainstorming/
│   ├── writing-plans/
│   ├── executing-plans/
│   ├── deep-research/
│   └── us-program-research/
│
├── cli-installer/             # NPM package (claude-superskills)
│   ├── bin/cli.js            # Main CLI entry point (commands, flags, install flow)
│   ├── lib/
│   │   ├── copilot.js        # GitHub Copilot installer
│   │   ├── claude.js         # Claude Code installer
│   │   ├── codex.js          # OpenAI Codex installer (~/.codex/skills/ — CLI + App)
│   │   ├── opencode.js       # OpenCode installer
│   │   ├── gemini.js         # Gemini CLI installer
│   │   ├── antigravity.js    # Antigravity installer
│   │   ├── cursor.js         # Cursor IDE installer
│   │   ├── adal.js           # AdaL CLI installer
│   │   ├── interactive.js    # Inquirer prompts (platform checkbox, ESC handler)
│   │   ├── cleanup.js        # Process cleanup / signal handlers
│   │   ├── detector.js       # Platform detection (detectTools())
│   │   ├── bundles.js        # Bundle loader (reads bundles.json)
│   │   ├── search.js         # Skill search functionality
│   │   ├── version-checker.js # Installed version comparison
│   │   ├── commands/         # Modular command implementations
│   │   │   ├── install.js
│   │   │   ├── uninstall.js
│   │   │   ├── list.js
│   │   │   ├── update.js
│   │   │   └── doctor.js
│   │   ├── core/
│   │   │   ├── downloader.js          # GitHub download + local cache manager
│   │   │   ├── installer.js           # Core install logic
│   │   │   ├── requirements-installer.js
│   │   │   ├── detector.js            # Core platform detector class
│   │   │   └── version-checker.js
│   │   ├── ui/
│   │   │   ├── table.js        # displayToolsTable()
│   │   │   ├── prompts.js      # UI prompt helpers
│   │   │   └── progress-gauge.js
│   │   └── utils/
│   │       ├── path-resolver.js   # getCachedSkillsPath(), getUserSkillsPath(), getCodexSkillPaths()
│   │       └── skill-versions.js
│   └── package.json          # NPM manifest (v1.12.10) — no skills/ in files
│
├── scripts/
│   ├── build-skills.sh       # Validates skills/ source (no longer syncs)
│   ├── bump-version.sh       # Bumps package.json version + git tag
│   ├── validate-skill-yaml.sh
│   ├── validate-skill-content.sh
│   ├── create-skill.sh
│   ├── generate-catalog.py
│   ├── generate-skills-index.py
│   └── pre-publish-check.sh
│
└── docs/
    ├── guides/
    │   ├── getting-started.md
    │   ├── skill-anatomy.md
    │   └── quality-standards.md
    └── bundles/
        └── bundles.md
```

### ⛔ NEVER DO THIS — The Platform Dirs Rule

> **Skills must NEVER exist in platform directories inside this repository.**

The following paths are in `.gitignore` and must stay empty/absent in the repo:

```
.github/skills/      ← GITIGNORED — do not create or commit
.claude/skills/      ← GITIGNORED — do not create or commit
.codex/skills/       ← GITIGNORED — do not create or commit
.agent/skills/       ← GITIGNORED — do not create or commit
.agents/skills/      ← GITIGNORED — do not create or commit
.gemini/skills/      ← GITIGNORED — do not create or commit
.cursor/skills/      ← GITIGNORED — do not create or commit
.adal/skills/        ← GITIGNORED — do not create or commit
cli-installer/skills/ ← GITIGNORED — do not create or commit
```

**Why?** Before v1.10.4 these were synced copies of `skills/`, creating 90 duplicate files (8× every skill). Every skill change required syncing all directories and the repository size bloated with identical content. The problem was discovered when paths diverged, causing Antigravity and OpenCode to install from wrong directories.

**The rule:** Edit skills **only** in `skills/`. The installer downloads them from GitHub at runtime and caches at `~/.claude-superskills/cache/{version}/skills/`. Nothing gets bundled in the npm package. Nothing gets committed to platform dirs.

**If you ever see skills committed under these paths, remove them:**
```bash
git rm -r --cached .github/skills/ .claude/skills/ .codex/skills/ \
  .agent/skills/ .agents/skills/ .gemini/skills/ .cursor/skills/ .adal/skills/ \
  cli-installer/skills/
git commit -m "fix: remove erroneously committed platform skill dirs"
```

---

### Key Architecture Principles (v1.12.0+)

1. **Single Source of Truth**: All skills are maintained in `skills/` only
2. **Download at Install Time**: The installer fetches skills from the GitHub release tag and caches them at `~/.claude-superskills/cache/{version}/skills/` — no skills are bundled in the npm package
3. **Platform-Specific Installers**: Each platform has its own async installer in `cli-installer/lib/`; all copy from the cache using `fs.copy` (no symlinks)
4. **No Platform Dirs in Repo**: `.github/skills/`, `.claude/skills/`, `.codex/skills/`, `.agent/skills/`, `.agents/skills/`, `.gemini/skills/`, `.cursor/skills/`, `.adal/skills/` are all in `.gitignore`
5. **Bundle System**: Skills are grouped into curated bundles (essential, content, developer, orchestration, all)

### Install Flow

```
npx claude-superskills
    → detect installed platforms
    → ensureSkillsCached(version)          # downloads from GitHub if not cached
        → tries release zip first          # github.com/.../archive/refs/tags/v{ver}.zip
        → falls back to API tree walk      # api.github.com/repos/.../git/trees/{ref}
        → caches to ~/.claude-superskills/cache/{version}/skills/
    → copy skills from cache → platform dirs
        copilot     → ~/.github/skills/
        claude      → ~/.claude/skills/
        codex       → ~/.codex/skills/ (CLI + App — single path, no duplicates)
        opencode    → ~/.agent/skills/
        gemini      → ~/.gemini/skills/
        antigravity → ~/.agent/skills/
        cursor      → ~/.cursor/skills/
        adal        → ~/.adal/skills/
```

## Development Commands

### Skill Development

```bash
# Create new skill (creates in skills/ directory)
./scripts/create-skill.sh <skill-name>

# Validate YAML frontmatter (kebab-case naming, required fields)
./scripts/validate-skill-yaml.sh skills/<skill-name>

# Validate content quality (word count, writing style)
./scripts/validate-skill-content.sh skills/<skill-name>

# Validate all skills at once
for skill in skills/*/; do
  ./scripts/validate-skill-yaml.sh "$skill"
  ./scripts/validate-skill-content.sh "$skill"
done

# Validate skills source (counts skills, no syncing needed)
./scripts/build-skills.sh
```

### CLI Installer Development

```bash
cd cli-installer

# Install dependencies
npm install

# Link locally for testing
npm link
claude-superskills --help
claude-superskills --list-bundles
claude-superskills -y -q   # install all, no prompts

# Run tests
npm test

# Generate CATALOG.md
npm run generate-catalog

# Generate skills index
npm run generate-index

# Unlink after testing
npm unlink -g claude-superskills
```

### Publishing Workflow

Publishing is automated via GitHub Actions on `v*` tag pushes.

```bash
# 1. Validate skills source
./scripts/build-skills.sh

# 2. Update CHANGELOG.md and README.md (version badges + footer)

# 3. Bump version in package.json (no git tag yet)
./scripts/bump-version.sh [patch|minor|major]

# 4. Stage all changed files, commit, create tag, push
git add cli-installer/package.json cli-installer/package-lock.json \
        CHANGELOG.md README.md CLAUDE.md
git commit -m "fix: <description> and bump to vX.Y.Z"
git tag vX.Y.Z
git push origin main && git push origin vX.Y.Z
# ↑ tag push triggers GitHub Actions publish workflow automatically
```

> **Note:** `bump-version.sh` uses `--no-git-tag-version` — it only updates `package.json`. The git tag must be created and pushed manually after the commit.

### Testing the Download Flow

```bash
# Clear cache to force re-download
rm -rf ~/.claude-superskills/cache/

# Install (will download from GitHub)
npx claude-superskills -y -q

# Verify cache was created
ls ~/.claude-superskills/cache/
```

### Pre-commit Validation Checklist

Before committing new or modified skills:

1. **YAML frontmatter** — `name` is kebab-case; `name`, `description`, `version` present; version is SemVer (X.Y.Z)
2. **Content** — Word count 1500–2000 (max 5000); no second-person ("you should"); imperative form used; 3–5 realistic examples
3. **Structure** — Required sections: Purpose, When to Use, Workflow, Critical Rules, Example Usage; Step 0: Discovery if skill interacts with project structure

## Skill Architecture

Each skill directory contains:
- `SKILL.md` — Core specification with YAML frontmatter and workflow steps
- `README.md` — User-facing documentation
- `references/` — Detailed documentation (optional)
- `examples/` — Working code samples (optional)
- `scripts/` — Executable utilities (optional)

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

1. **Purpose** — What the skill does
2. **When to Use** — Activation scenarios
3. **Workflow** — Step-by-step instructions (Step 0: Discovery if needed)
4. **Critical Rules** — NEVER/ALWAYS guidelines
5. **Example Usage** — 3-5 realistic scenarios

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

## Version Management

The package version is defined in `cli-installer/package.json` (currently **v1.12.10**).

- `cli-installer/package.json` — source of truth for npm
- `cli-installer/bin/cli.js` — reads version dynamically from package.json
- `README.md` — version badges need manual update after bump
- `CHANGELOG.md` — must be updated before publishing

**Bumping:**
```bash
./scripts/bump-version.sh patch   # 1.12.10 → 1.12.11
# Updates package.json, commits, creates tag, pushes → triggers publish workflow
# Then update README.md badges manually
# Then update CHANGELOG.md
```

**Full bump + publish sequence:**
```bash
# 1. Edit CHANGELOG.md and README.md (badges + footer version)
# 2. Run bump script (updates package.json only, no git tag)
./scripts/bump-version.sh patch
# 3. Stage everything, commit, tag, push
git add cli-installer/package.json cli-installer/package-lock.json \
        README.md CHANGELOG.md CLAUDE.md
git commit -m "fix: ... and bump to vX.Y.Z"
git tag vX.Y.Z && git push origin main && git push origin vX.Y.Z
# GitHub Actions detects the tag and publishes to npm automatically
```

## Commit Convention

```bash
feat: add <skill-name> skill v1.0.0       # New skill
feat(<skill-name>): <improvement>          # Enhancement
fix(<skill-name>): <bug fix>              # Bug fix
fix: correct <issue>                       # General bug fix
docs: <update>                             # Documentation only
chore: bump version to X.Y.Z              # Version bump
refactor: <change>                         # Code restructure
```

## CLI Installer Architecture

### CLI Entry Point (`bin/cli.js`)

- **Command Aliases**: `i` (install), `ls` (list), `up` (update), `rm` (uninstall), `doc` (doctor)
- **Short Flags**: `-a` (--all), `-g` (--global), `-l` (--local), `-y` (--yes), `-q` (--quiet)
- **Cache Warming**: `warmCache(quiet)` calls `ensureSkillsCached(VERSION)` before any install
- **All installer calls are `async/await`**

### Platform Installers (`lib/`)

All 8 installers share the same async signature:
```js
async function install(cacheDir, skills = null, quiet = false)
```

| File | Platform | Install target |
|------|----------|----------------|
| `copilot.js` | GitHub Copilot CLI | `~/.github/skills/` |
| `claude.js` | Claude Code | `~/.claude/skills/` |
| `codex.js` | OpenAI Codex (CLI + App) | `~/.codex/skills/` |
| `opencode.js` | OpenCode | `~/.agent/skills/` |
| `gemini.js` | Gemini CLI | `~/.gemini/skills/` |
| `antigravity.js` | Antigravity | `~/.agent/skills/` |
| `cursor.js` | Cursor IDE | `~/.cursor/skills/` |
| `adal.js` | AdaL CLI | `~/.adal/skills/` |

OpenCode and Antigravity share `~/.agent/skills/` as the universal agent path.

### Downloader (`lib/core/downloader.js`)

- `ensureSkillsCached(version)` — downloads if not cached, returns `cacheDir`
- Download strategy: release zip → GitHub API tree walk (fallback)
- Cache location: `~/.claude-superskills/cache/{version}/skills/`
- `clearCache()` — wipes `~/.claude-superskills/cache/`

> **GitHub 403 / rate limit**: On corporate networks or after repeated installs, the API fallback (`api.github.com`) may return 403. The installer prioritizes release zip download (`github.com`/`codeload.github.com`) to avoid API limits. If 403 persists, retry later or review network/proxy policy for GitHub domains.

### Bundle System (`lib/bundles.js`)

Curated skill collections:
- **essential**: core workflow skills including `skill-creator`, `prompt-engineer`, discovery/orchestration, and planning trio
- **planning**: `brainstorming`, `writing-plans`, `executing-plans`, `agent-skill-orchestrator`
- **research**: `deep-research`, `us-program-research`, `agent-skill-discovery`, `prompt-engineer`
- **content**: `youtube-summarizer`, `audio-transcriber`, `docling-converter`
- **developer**: `skill-creator`
- **orchestration**: `agent-skill-discovery`, `agent-skill-orchestrator`
- **all**: all 12 skills

## Automation Scripts

- **`build-skills.sh`** — Validates `skills/` source; lists skill count; no longer syncs to platform dirs
- **`bump-version.sh`** — `npm version [patch|minor|major]`; pushes main + tag; triggers CI publish
- **`pre-publish-check.sh`** — Checks version not already published, runs tests, audits size
- **`validate-skill-yaml.sh`** — Required fields, kebab-case, SemVer
- **`validate-skill-content.sh`** — Word count, writing style, examples
- **`generate-catalog.py`** — Auto-generates `CATALOG.md` from skill YAML frontmatter
- **`generate-skills-index.py`** — Auto-generates skill index README files

## Skill Types

- **Meta-skills** — Create or manage other skills (`skill-creator`)
- **Automation** — Workflow optimization (`prompt-engineer`)
- **Orchestration** — Resource discovery and task planning (`agent-skill-discovery`, `agent-skill-orchestrator`)
- **Planning** — Pre-implementation design and execution (`brainstorming`, `writing-plans`, `executing-plans`)
- **Research** — Deep research and academic analysis (`deep-research`, `us-program-research`)
- **Content** — Media and document processing (`youtube-summarizer`, `audio-transcriber`, `docling-converter`)

### Orchestration Skills

#### agent-skill-discovery (v1.1.0)
Dual-scope discovery: scans installed resources globally + current repository resources locally. Works across all 8 platforms. Detects MCP servers, agents, skills, plugins.

#### agent-skill-orchestrator (v1.1.0)
Analyzes user requirements, matches to available resources with confidence scoring (trigger 30% + semantic 25% + tools 20% + category 15% + MCP 10%), generates primary + alternative execution plans with user approval before proceeding.
