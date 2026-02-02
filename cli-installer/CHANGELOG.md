# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-02

### Added
- ✨ Initial release of CLI AI Skills installer
- 📦 `install` command with interactive prompts
  - Platform selection (GitHub Copilot CLI, Claude Code, or both)
  - Scope selection (global or local)
  - Skill selection (individual, multiple, or all)
  - Version checking with update prompts
  - Visual progress gauge with 5-step workflow
- 📋 `list` command to show available and installed skills
  - Version status indicators (installed, outdated, not installed)
  - Platform badges
  - Compact progress gauges for installed skills
- 🔄 `update` command to update outdated skills
  - Automatic outdated skill detection
  - Interactive or batch update mode
  - Version comparison with SemVer
- 🗑️ `uninstall` command to remove skills
  - Single or batch uninstall
  - Platform-specific or all platforms
  - Safety confirmations
- 🔍 `doctor` command for system diagnostics
  - Node.js version check
  - Platform detection (Copilot & Claude)
  - Directory permissions validation
  - GitHub API connectivity test
- 🎨 Visual progress system
  - Multi-step progress gauge with Unicode blocks
  - Inline progress indicators
  - Compact gauge for lists
  - Summary gauge for batch operations
- 🌐 GitHub integration
  - Direct download from GitHub repository
  - Recursive directory downloads for skills with subdirectories
  - Metadata extraction from YAML frontmatter
- 🔗 Installation methods
  - Symlink for global installs (auto-updates on git pull)
  - Copy for local installs (commit to repo)
- 🎯 Platform detection
  - Automatic Copilot CLI detection
  - Automatic Claude Code detection
  - Path resolution for skill directories
- ✅ Version management
  - SemVer-based version comparison
  - YAML frontmatter parsing
  - Installed vs. latest version tracking

### Features
- **Zero-config installation**: Works out of the box without manual setup
- **Dual-platform support**: Installs skills for both Copilot and Claude
- **Interactive UX**: Friendly prompts with multiple-choice options
- **Batch operations**: Install, update, or uninstall multiple skills at once
- **Silent mode**: `--yes` flag for automation and CI/CD
- **Visual feedback**: Progress gauges and status indicators
- **Smart versioning**: Detects outdated skills and prompts for updates
- **Robust error handling**: Clear error messages and recovery suggestions

### Technical Details
- **Dependencies**: chalk v4, commander, inquirer v8, ora v5, axios, fs-extra, js-yaml, semver
- **Node.js**: Requires Node.js >= 14.0.0
- **Platforms**: macOS, Linux, Windows
- **Package size**: ~50KB
- **Installation**: `npx cli-ai-skills` or `npm install -g cli-ai-skills`

### Documentation
- 📖 Comprehensive README with examples
- 📋 Publishing guide for npm
- 🐛 Troubleshooting section
- 📝 Changelog for version tracking

---

## Future Releases (Planned)

### [1.1.0] - TBD
- [ ] Offline mode with cached skills
- [ ] Custom repository support
- [ ] Rollback on partial installation failure
- [ ] Verbose logging mode (`--verbose`)
- [ ] Configuration file support

### [1.2.0] - TBD
- [ ] Private skills support
- [ ] Skill templates for custom skills
- [ ] Skill validation before installation
- [ ] Skill dependencies management

### [2.0.0] - TBD
- [ ] Breaking: ESM migration (require Node.js >= 16)
- [ ] Interactive skill creation wizard
- [ ] Skill marketplace integration
- [ ] Team/organization skill sharing

---

[1.0.0]: https://github.com/ericgandrade/cli-ai-skills/releases/tag/v1.0.0
