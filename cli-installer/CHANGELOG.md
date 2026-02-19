# Changelog

All notable changes to claude-superskills will be documented in this file.

## [1.9.0] - 2026-02-07

### Added
- ✨ Synced `agent-skill-discovery` v1.1.0 to all packaged platforms
- 📁 Added repository-aware discovery behavior documentation in packaged skill files

### Changed
- 📝 Updated packaged `agent-skill-discovery` README/SKILL docs for dual-scope discovery
- 📦 Package version bumped to `1.9.0`

## [1.7.1] - 2026-02-06

### Added
- 🚀 **Shell installer**: Universal one-liner install via curl/wget (`install.sh`)
- 🗑️ **Shell uninstaller**: Clean removal script (`uninstall.sh`)
- 📚 **Installation guide**: Comprehensive docs at `docs/INSTALLATION.md`
- 🔧 **Install options**: `--yes`, `--verbose`, `--skip-node-check`, `--help`, `--version`
- 🔧 **Uninstall options**: `--yes`, `--dry-run`, `--purge`
- 🔍 **Node.js detection**: Auto-detect Node.js >= 16 and offer nvm install
- 📊 **AI tools table**: Visual display of detected platforms with versions
- 🎯 **OS detection**: Support macOS, Linux, WSL with automatic detection
- 📖 **Troubleshooting**: Extensive troubleshooting guide in docs

### Changed
- 📝 **README.md**: Added prominent one-liner install section
- 📝 **cli-installer/README.md**: Reference to shell installer
- 🔄 **Installation methods**: Now 4 ways to install (shell, npx, npm, git clone)

### Technical
- Created `scripts/install.sh` (15KB, 500+ lines)
- Created `scripts/uninstall.sh` (11KB, 400+ lines)
- Created `docs/INSTALLATION.md` (9KB comprehensive guide)
- Both scripts executable with proper shebang
- Error handling with cleanup traps
- Color output for better UX
- Version comparison for Node.js check

## [1.7.0] - 2026-02-06

### Added
- ✨ **ESC key cancellation**: Press ESC during installation to cancel with confirmation
- ✨ **5-platform support**: Added OpenCode and Gemini CLI support (total: Copilot, Claude, Codex, OpenCode, Gemini)
- ✨ **Visual tools table**: Display detected AI tools with versions in formatted table
- ✨ **Version checking**: Auto-detect installed claude-superskills version and suggest updates
- ✨ **Reinstall option**: Offer reinstall when all skills are up-to-date
- 📊 **Enhanced detection**: Tools now return detailed info (installed, version, path)
- 🗑️ **Improved uninstall**: Support for all 5 platforms with better UX
- 🔄 **Enhanced update**: Reinstall option and multi-platform support

### Changed
- 🔄 **detector.js structure**: Now returns objects with `{installed, version, path}` instead of booleans
- 🔄 **Platform count**: 3 → 5 platforms (+67%)
- 🔄 **build-skills.sh**: Syncs to 5 platform directories
- 🔄 **Interactive prompts**: Improved messaging with ESC hint

### Fixed
- 🐛 **Cleanup on cancel**: Partial installations are now cleaned up automatically
- 🐛 **Version display**: Consistent version display across all tools

### Technical
- Created `.opencode/skills/` and `.gemini/skills/` directories
- Added `lib/cleanup.js` for installation cleanup
- Added `lib/version-checker.js` for version comparison
- Added `lib/ui/table.js` for visual output
- Added `lib/opencode.js` and `lib/gemini.js` installers
- Enhanced `interactive.js` with ESC handler

## [1.6.0] - 2026-02-06

Initial multi-platform release with 5 platforms support (preparation).

## [1.5.0] - 2026-01-31

### Added
- Command shortcuts: `i`, `ls`, `up`, `rm`, `doc`
- Short flags: `-a`, `-g`, `-l`, `-y`, `-q`
- Curated bundles: essential, content, developer, all
- Bundle CLI: `--bundle <name>` for curated installations
- Search functionality: `--search <keyword>`

### Changed
- Modernized installer with better UX
- Improved documentation structure
- Enhanced error messages
