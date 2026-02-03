# Changelog

All notable changes to cli-ai-skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-02-07

### Added
- **OpenAI Codex CLI/App support** for all 4 skills
- `.codex/skills/` complete infrastructure (prompt-engineer, skill-creator, youtube-summarizer, audio-transcriber)
- **Smart installer** with automatic tool detection (gh copilot, claude, codex)
- Interactive platform selection via `inquirer` (multi-select checkbox)
- Tri-platform architecture (Copilot + Claude + Codex)
- `lib/detector.js` - Auto-detection of installed AI CLI tools
- `lib/interactive.js` - Interactive platform selection
- `lib/codex.js` - Codex-specific installer
- `.codex/skills/README.md` index file
- Codex-specific installation instructions across all READMEs

### Changed
- `cli-installer` now detects installed AI CLI tools automatically
- Updated installation workflow to be platform-aware
- Removed `triggers:` from Codex SKILL.md files (manual invocation via `@skill-name`)
- Updated all Codex examples (`copilot>` → `codex>`)
- Skills bumped to v1.0.2, v1.1.1, v1.1.1, v1.1.1 (PATCH - Codex adaptation)
- Enhanced README.md with tri-platform support table
- Updated VERSIONING.md with tri-platform sync rules
- package.json: description updated, keywords added (codex, openai-codex)

### Fixed
- Inconsistent versioning across skill READMEs
- Missing installation instructions for Codex platform
- Documentation gaps in platform-specific workflows

### Maintained
- 100% workflow parity across all 3 platforms
- Zero-config design philosophy
- All 11 frameworks in prompt-engineer (RTF, RISEN, CoT, RODES, Chain of Density, RACE, RISE, STAR, SOAP, CLEAR, GROW)
- LLM integration in audio-transcriber v1.1.0
- Python script dependencies (youtube-summarizer, audio-transcriber)

## [1.3.1] - 2026-02-03

### Added
- audio-transcriber v1.1.0 with intelligent LLM integration
- Smart prompt enhancement using prompt-engineer
- Auto-analysis and suggestion workflow when no prompt provided
- Progress gauge UI for transcription workflow

### Changed
- audio-transcriber: Improved LLM workflow (always enhance prompts, suggest formats)
- Updated all skill indexes (.github/skills/README.md, .claude/skills/README.md)
- Synchronized README versions across platforms

### Fixed
- Version control inconsistencies across repository
- Missing git tags (v1.3.1)
- Outdated skill listings

## [1.2.1] - 2026-02-02

### Fixed
- Bug fixes and stability improvements

## [1.2.0] - 2026-01-30

### Added
- youtube-summarizer skill v1.1.0
- skill-creator skill v1.1.0

## [1.0.1] - 2026-01-15

### Added
- prompt-engineer skill v1.0.1 (11 frameworks)

## [1.0.0] - 2026-01-01

### Added
- Initial release
- Dual-platform support (GitHub Copilot CLI + Claude Code)
