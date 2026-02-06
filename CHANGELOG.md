# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
- **Zero-Config Installation:** Run `npx cli-ai-skills` with no arguments to install all skills automatically
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
npm install -g cli-ai-skills@latest

# Or use npx (always uses latest)
npx cli-ai-skills@latest --version

# Try new features
npx cli-ai-skills --list-bundles
npx cli-ai-skills --bundle essential -y
npx cli-ai-skills --search "prompt"
npx cli-ai-skills ls -q
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

**Links:** [GitHub](https://github.com/ericgandrade/cli-ai-skills) | [NPM](https://www.npmjs.com/package/cli-ai-skills)
