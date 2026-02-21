# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.13.0] - 2026-02-21

### Added

- **New Universal Skill:** `storytelling-expert` v1.0.0
  - Transforms ideas and data into engaging narratives using 8 elite frameworks (StoryBrand, Golden Circle, Pixar, etc.).
  - Automatically selects the best framework based on context.
  - Adds `storytelling-expert` to `content` and `all` bundles.

## [1.12.12] - 2026-02-21

### Changed

- Antigravity installer path updated from `~/.agent/skills/` to `~/.gemini/antigravity/skills/` across installer logic, version checks, and interactive prompts.
- Documentation aligned to the new Antigravity path in `README.md`, `cli-installer/README.md`, and `CLAUDE.md`.
- Codex path documentation standardized to `~/.codex/skills/` with explicit legacy note for `~/.agents/skills/`.

### Fixed

- Resolved cross-tool path inconsistency where Antigravity could remain without installed skills while other platforms had full installs.

## [1.12.11] - 2026-02-21

### Added

- New `status` command (`st` alias) to show installation diagnostics by platform and scope.
- `status` supports `--scope global|local|both` and prints global/local paths with installed skill counts.

### Changed

- Updated installer documentation and examples for scoped operations and status inspection.

## [1.12.10] - 2026-02-21

### Changed

- Installer scope options (`global`, `local`, `both`) now apply to all supported platforms, not only Claude.
- Interactive UX now defaults to and recommends `global` scope to avoid cross-tool ambiguity.
- Added explicit warning + double confirmation when `both` scope is selected.
- Added `--scope global|local|both` as first-class option and kept `--claude-scope` as backward-compatible alias.
- Install and uninstall flows now respect scope selection consistently (including clean reinstall path).
- Platform installers now accept custom target directories, enabling scoped installs for global/local paths.

### Fixed

- Prevented partial installs by removing destination folders on copy errors across all platform installers.
- Cache handling now avoids reusing partial downloads and keeps installation directories cleaner.

## [1.12.8] - 2026-02-20

### Fixed

- **Codex installer**: reverted separate CLI/App platform split — Codex CLI reads from both `~/.agents/skills/` and `~/.codex/skills/`, causing duplicates when both were installed.
- Unified Codex into a single platform targeting `~/.codex/skills/` only (works for both CLI and App).
- `getCodexSkillPaths()` now returns `~/.codex/skills/` first + `~/.agents/skills/` second so uninstall also cleans any previous installs from the old path.
- Removed `lib/codex-app.js` (merged back into `lib/codex.js`).
- Interactive prompt now shows a single **OpenAI Codex CLI + App** option.

## [1.12.7] - 2026-02-20

### Fixed

- **Codex installer**: Codex CLI and Codex App are now treated as two independent platforms with separate installers and separate target directories.
  - `codex_cli` → `~/.agents/skills/` (Codex CLI)
  - `codex_app` → `~/.codex/skills/` (Codex App)
- Added `lib/codex-app.js` — dedicated installer for the OpenAI Codex desktop app.
- Updated `lib/codex.js` — now explicitly targets `codex_cli` path only.
- Updated `lib/utils/path-resolver.js` — `getUserSkillsPath` handles `codex_cli` and `codex_app` separately; removed incorrect `vendor_imports` fallback paths.
- Updated `lib/interactive.js` — checkbox now shows Codex CLI and Codex App as separate selectable options.
- Updated `bin/cli.js` — install and uninstall flows call the correct installer per platform; removed all references to the merged `'codex'` platform string.

## [1.12.0] - 2026-02-20

### Added

- New universal skills:
  - `docling-converter` v1.0.0
  - `us-program-research` v1.0.0
- New skill directories and assets:
  - `skills/docling-converter/` with `references/` and `scripts/`
  - `skills/us-program-research/` with `references/`

### Changed

- Applied `skill-creator` best-practice structure updates to:
  - `brainstorming` v1.0.0
  - `deep-research` v1.0.0
  - `executing-plans` v1.0.0
  - `writing-plans` v1.0.0
  - `docling-converter` v1.0.0
  - `us-program-research` v1.0.0
- Updated bundles:
  - `content` now includes `docling-converter`
  - `research` now includes `us-program-research`
  - `all` now includes all 12 skills
- Regenerated `CATALOG.md` and `skills_index.json` for 12 total skills.
- Package version bumped to `1.12.0` in `cli-installer/package.json` and `cli-installer/package-lock.json`.
- Updated root docs (`README.md`, `CLAUDE.md`) for 12 skills, new bundles, and `v1.12.0`.

## [1.11.0] - 2026-02-20

### Added

- New universal skills:
  - `brainstorming` v1.0.0
  - `writing-plans` v1.0.0
  - `executing-plans` v1.0.0
  - `deep-research` v1.0.0
- New bundles:
  - `planning` (brainstorming, writing-plans, executing-plans, agent-skill-orchestrator)
  - `research` (deep-research, agent-skill-discovery, prompt-engineer)

### Changed

- `deep-research` adapted to run without Google/Gemini API dependency (native WebSearch/WebFetch workflow).
- `all` and `essential` bundles updated to include planning workflow skills.
- `skills_index.json` and `CATALOG.md` regenerated for 10 total skills.
- `scripts/generate-skills-index.py` now scans `skills/` directly and supports default metadata fallbacks.
- Package version bumped to `1.11.0` in `cli-installer/package.json` and `cli-installer/package-lock.json`.
- Root `README.md` and bundles documentation updated for new skills and NPX bundle examples.

## [1.10.4] - 2026-02-19

### Changed

- **No bundled skills in npm package** — `skills/` directory removed from the npm `files` array
- Installer now downloads skills from the GitHub release tag at first use and caches them at `~/.claude-superskills/cache/{version}/skills/`
- All 8 platform installers rewritten as async functions using `fs.copy` from cache (no more symlinks)
- `downloader.js` rewritten with `ensureSkillsCached(version)`: tries release zip first, falls back to GitHub API tree walk
- `path-resolver.js` simplified: `getCachedSkillsPath(version)` replaces `getSkillsSourcePath()`
- `build-skills.sh` simplified to validation-only (counts skills in `skills/`, no longer syncs to platform dirs)
- All platform skill directories (`.github/skills/`, `.claude/skills/`, `.codex/skills/`, `.agent/skills/`, `.gemini/skills/`, `.cursor/skills/`, `.adal/skills/`) removed from git and added to `.gitignore`
- Fixed stale `opencode` path in `version-checker.js` (`.agents/` → `.agent/`)
- Eliminated ~90 redundant copies of skill files (290 files deleted from repo)

---

## [1.10.3] - 2026-02-18

### Changed

- **Project renamed** from `cli-ai-skills` to `claude-superskills` (GitHub repo + npm package)
- npm package `cli-ai-skills@*` deprecated with redirect message
- GitHub Actions publish workflow updated with deprecation step
- All file references updated across 164 files via bulk rename
- **8-platform support** finalized: added Cursor IDE (`~/.cursor/skills/`) and AdaL CLI (`~/.adal/skills/`)
- README updated with correct Compatibility & Invocation table

---

## [1.10.2] - 2026-02-15

### Changed

- Version bump to trigger npm publish after `v1.10.1` tag conflict

---

## [1.10.1] - 2026-02-15

### Added

- **Cursor IDE** support — installs skills to `~/.cursor/skills/`
- **AdaL CLI** support — installs skills to `~/.adal/skills/`
- New platform installers: `lib/cursor.js`, `lib/adal.js`

### Changed

- **OpenCode and Antigravity** paths consolidated to `~/.agent/skills/` (universal agent path)
- `path-resolver.js`: `opencode` and `antigravity` both map to `.agent` as source and target
- `build-skills.sh`: replaced `.antigravity/skills` and `.opencode/skills` with `.agent/skills`; added `.cursor/skills` and `.adal/skills`
- README updated with corrected install paths for all 8 platforms

### Fixed

- OpenCode was incorrectly installing to `~/.agents/skills/` (plural) — corrected to `~/.agent/skills/`

---

## [1.9.0] - 2026-02-07

### Added

- ✨ **agent-skill-discovery v1.1.0** now performs dual-scope discovery:
  - Installed resources (existing behavior)
  - Current repository resources (new behavior)
- 📁 Current repository scan now detects local agents, local skills, and local MCP configs
- 🧭 Discovery output now separates `Installed Resources` and
  `Current Repository Resources`

### Changed

- 📝 Updated `skills/agent-skill-discovery/SKILL.md` workflow with repository scan step
- 📝 Updated `skills/agent-skill-discovery/README.md` with dual-scope examples
- 📝 Updated root `README.md` discovery description and skill version
- 📚 Regenerated `skills_index.json` and `CATALOG.md`

## [1.7.3] - 2026-02-07

### Added

- ✨ **agent-skill-discovery** - Platform-agnostic resource discovery skill
  - Scans and lists all installed plugins, agents, skills, and MCP servers
  - Works identically on all 5 AI CLI platforms (Claude, Copilot, Gemini, OpenCode, Codex)
  - Zero-config dynamic path discovery
  - Optional filtering by type, category, or keyword
  - Structured markdown output with resource counts

- ✨ **agent-skill-orchestrator** - Intelligent task planning and orchestration skill
  - Analyzes user requirements and creates strategic execution plans
  - Performs intelligent resource matching with confidence scoring (0-100%)
  - Generates multiple execution options with alternatives and fallbacks
  - Always requests explicit user approval before execution
  - Uses agent-skill-discovery as a required dependency

- 🔌 **MCP Server Discovery** - Both new skills support MCP server detection
  - Discovers configured MCP servers from `.mcp.json`
  - Enumerates available tools per server
  - Shows connection status and tool descriptions

- 🧠 **Confidence Scoring Algorithm** - Weighted multi-factor matching
  - Trigger phrase matching (30%)
  - Semantic similarity (25%)
  - Tool availability (20%)
  - Category relevance (15%)
  - MCP integration bonus (10%)

- 📊 **Strategic Planning Features**
  - Primary strategy (recommended approach)
  - Alternative strategy (backup approach)
  - Prerequisites detection and checklist
  - Success criteria definition
  - Risk assessment

### Changed

- 📝 Updated README.md with new skills section (Discovery & Orchestration)
- 🔄 Organized Available Skills table by category
- 📚 Added Quick Start Examples showcasing new workflow
- 🏷️ Version bumped from v1.7.2 to v1.7.3
- 📈 Skills count updated from 4 to 6

### Fixed

- 🐛 Version consistency across all files (cli.js, package.json, README)

---

## [1.7.6] - 2026-02-06

### Changed

- **Codex CLI and App Always Shown Separately**
  - Interactive prompt NOW ALWAYS shows "Codex CLI" and "Codex App" as **separate options**
  - Users can independently select CLI, App, or both
  - Previous behavior showed "Codex CLI + App" when both installed (now removed)
  - Both still install to the same shared directory (`~/.codex/vendor_imports/skills/skills/.curated/`)
  
**Before (v1.7.5):**
```
? Install skills for which platforms?
  ✅ OpenAI Codex CLI + App (...)  ← Combined when both installed
```

**After (v1.7.6):**
```
? Install skills for which platforms?
  ✅ OpenAI Codex CLI (...)         ← Always separate
  ✅ OpenAI Codex App (...)         ← Always separate
```

**Why this matters:**
- Users have clearer control: can choose to install for CLI only, App only, or both
- Better visibility: see exactly which components are detected
- Avoids ambiguity: no combined "CLI + App" label
- Installation still smart: if both selected, installs once to shared directory

---

## [1.7.5] - 2026-02-06

### Added

- **Separate Codex CLI and Codex App Detection**
  - Detector now differentiates between Codex CLI (`codex` command) and Codex App (desktop application)
  - New detection functions: `detectCodexCli()` and `detectCodexApp()`
  - Both shown separately in tools table with distinct status and versions
  - Installer recognizes that both share the same skills directory (`~/.codex/vendor_imports/skills/skills/.curated/`)
  
### Changed

- **Tools Table Display**
  - Now shows 6 platforms instead of 5:
    - GitHub Copilot CLI
    - Claude Code
    - **OpenAI Codex CLI** (new)
    - **OpenAI Codex App** (new)
    - OpenCode
    - Gemini CLI
  - Interactive prompt shows "Codex CLI + App" when both are installed
  - Single installation serves both Codex CLI and Codex App

### Technical Details

**Why this change matters:**
- Users can install Codex CLI via Homebrew: `brew install --cask codex`
- Users can download Codex App separately from OpenAI website
- Some users may have only CLI, only App, or both
- Both share the **exact same** skills directory, so one installation works for both
- Better clarity: users see exactly what they have installed

**Detection logic:**
```javascript
// CLI Detection
codex --version  // → "codex-cli 0.98.0"

// App Detection  
/Applications/Codex.app exists  // → "Codex Desktop"

// Skills path (shared by both)
~/.codex/vendor_imports/skills/skills/.curated/
```

---

## [1.7.4] - 2026-02-06

### Fixed

- **Codex Installer:** Corrected installation path for OpenAI Codex App
  - Now installs to `~/.codex/vendor_imports/skills/skills/.curated/` (actual Codex path)
  - Previously used `~/.codex/skills/` which Codex App doesn't recognize
  - Added multi-path fallback for robustness (tries `.curated/`, `.custom/`, and documented path)
  - Enhanced logging to show exact installation destination
  - Skills now properly appear in Codex App after restart

### Changed

- **Path Resolver:** Updated `getUserSkillsPath('codex')` with intelligent fallback logic
  - Primary: `~/.codex/vendor_imports/skills/skills/.curated/` (official Codex location)
  - Fallback 1: `~/.codex/vendor_imports/skills/skills/.custom/` (future alternative)
  - Fallback 2: `~/.codex/skills/` (documented but unused path)
- **Codex Installer:** Improved error messages and success logging
  - Shows destination path on installation
  - Returns `{installed, failed}` object for programmatic use
  - Better alignment with other platform installers (OpenCode, Gemini)

### Documentation

- **INSTALLATION.md:** Added "Codex App not detecting skills" troubleshooting section
  - Explains Codex's unique path structure
  - Verification commands to check installation
  - Manual installation fallback instructions
  - Note about needing to restart Codex App
- **README.md:** Updated supported platforms section with path information
  - Added note about Codex's special directory structure
  - Clarified that installer handles this automatically

---

## [1.5.0] - 2026-02-04

### Added

- **NPX CLI Shortcuts:** Commands `i` (install), `ls` (list), `up` (update), `rm` (uninstall), `doc` (doctor)
- **NPX CLI Short Flags:** `-a` (--all), `-g` (--global), `-l` (--local), `-y` (--yes), `-q` (--quiet)
- **Zero-Config Installation:** Run `npx claude-superskills` with no arguments to install all skills automatically
- **Bundle Support:** `--bundle <name>` for installing curated skill collections
- **Search Functionality:** `--search <keyword>` to find skills by name, description, tags, or category
- **List Bundles Command:** `--list-bundles` to show all available bundle options
- **Skills Metadata:** Added `category`, `tags`, `risk`, and `platforms` to all 4 skills
- **Skills Index JSON:** Auto-generated `skills_index.json` for programmatic access to skill metadata
- **Bundles Configuration:** `bundles.json` with 4 curated collections (essential, content, developer, all)
- **Documentation Structure:** Reorganized into `docs/` with `guides/`, `bundles/`, and `references/` subdirectories
- **Quality Standards Guide:** `docs/guides/quality-standards.md` with comprehensive best practices
- **Skill Anatomy Guide:** `docs/guides/skill-anatomy.md` explaining skill structure and metadata
- **Getting Started Guide:** `docs/guides/getting-started.md` for new users with quick start
- **Bundles Guide:** `docs/bundles/bundles.md` with detailed bundle descriptions and use cases
- **Issue Templates:** Bug report and feature request templates in `.github/ISSUE_TEMPLATE/`
- **Pull Request Template:** `.github/PULL_REQUEST_TEMPLATE.md` with comprehensive checklist
- **Auto-Generated Catalog:** `CATALOG.md` with complete skill listing and categorization
- **Version Sync Script:** `scripts/verify-version-sync.sh` to ensure version consistency across platforms
- **Generation Scripts:** `scripts/generate-skills-index.py` and `scripts/generate-catalog.py` for automation

### Changed

- **README.md:** Reduced from 724 lines to 126 lines for improved readability and focus
- **cli-installer:** Updated from v1.4.0 to v1.5.0 with modern CLI patterns
- **skill-creator:** Updated from v1.2.0 to v1.3.0 (added metadata, fixed .codex dessync)
- **prompt-engineer:** Updated from v1.0.2 to v1.1.0 (added metadata)
- **youtube-summarizer:** Updated from v1.1.0 to v1.2.0 (added metadata)
- **audio-transcriber:** Updated from v1.0.0 to v1.2.0 (added metadata)
- **Documentation Organization:** Moved from `resources/` to structured `docs/` directory
- **CONTRIBUTING.md:** Updated with references to new documentation structure and quality standards

### Migration Notes

- **100% Backward Compatible:** All existing installations continue working without changes
- **Optional Features:** New commands and flags are additive; old commands still work perfectly
- **Automatic Detection:** Skills automatically detect and use new metadata when present
- **No Breaking Changes:** Users can continue using v1.4.0 patterns indefinitely
- **Version Synchronization:** Fixed skill-creator .codex desynchronization (v1.1.1 → v1.2.0)

### Upgrade Instructions

```bash
# Update the CLI installer
npm install -g claude-superskills@latest

# Or use npx (always uses latest)
npx claude-superskills@latest --version

# Try new features
npx claude-superskills --list-bundles
npx claude-superskills --bundle essential -y
npx claude-superskills --search "prompt"
npx claude-superskills ls -q
```

---

## [1.4.0] - 2026-02-03

### Added
- Codex CLI/App support for OpenAI integration
- Smart platform detection
- Interactive skill selection
- Version checking for updates

---

## [1.3.0] - 2026-01-15

### Added
- CLI installer package
- GitHub Copilot CLI support
- Claude Code support

---

## [1.2.0] - 2026-01-01

### Added
- audio-transcriber skill v1.1.1
- youtube-summarizer skill v1.2.0

---

## [1.1.0] - 2025-12-15

### Added
- prompt-engineer skill v1.0.2
- Initial repository structure

---

## [1.0.0] - 2025-12-01

### Added
- Initial release
- skill-creator skill v1.2.0
- Project documentation

---

## Git Tags

5 git tags have been created for this release:

- **v1.5.0** - Main project release
- **skill-creator-v1.3.0** - Skill version tag
- **prompt-engineer-v1.1.0** - Skill version tag
- **youtube-summarizer-v1.2.0** - Skill version tag
- **audio-transcriber-v1.2.0** - Skill version tag

---

**Documentation:** [README.md](./README.md) | [Full Catalog](./CATALOG.md) | [Guides](./docs/guides/)

**Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md) | [Quality Standards](./docs/guides/quality-standards.md)

**Links:** [GitHub](https://github.com/ericgandrade/claude-superskills) | [NPM](https://www.npmjs.com/package/claude-superskills)
