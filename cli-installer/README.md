# claude-superskills v1.11.0

🚀 **NPX Installer for AI Skills**

Install reusable skills for GitHub Copilot CLI, Claude Code, OpenAI Codex, OpenCode, Gemini CLI, Antigravity, Cursor IDE, and AdaL CLI in one command.

![Version](https://img.shields.io/badge/version-1.11.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## 🚀 Quick Start

```bash
# Interactive zero-config install
npx claude-superskills

# Auto-install to all detected platforms
npx claude-superskills -y -q

# Bundle install examples
npx claude-superskills --bundle essential -y
npx claude-superskills --bundle planning -y
npx claude-superskills --bundle research -y
```

See [Installation Guide](../docs/INSTALLATION.md) for full methods.

## 📦 What It Does

1. Detects installed AI tools and IDEs.
2. Fetches the matching skills release cache.
3. Installs skills into correct platform directories.
4. Validates installation and reports status.

## 💻 Supported Platforms

- GitHub Copilot CLI: `~/.github/skills/`
- Claude Code: `~/.claude/skills/`
- OpenAI Codex: `~/.codex/vendor_imports/skills/skills/.curated/`
- OpenCode: `~/.agent/skills/`
- Gemini CLI: `~/.gemini/skills/`
- Antigravity: `~/.agent/skills/`
- Cursor IDE: `~/.cursor/skills/`
- AdaL CLI: `~/.adal/skills/`

## 📚 Available Skills (10)

1. `agent-skill-discovery` (v1.1.0)
2. `agent-skill-orchestrator` (v1.1.0)
3. `brainstorming` (v1.0.0)
4. `writing-plans` (v1.0.0)
5. `executing-plans` (v1.0.0)
6. `deep-research` (v1.0.0)
7. `skill-creator` (v1.3.1)
8. `prompt-engineer` (v1.1.0)
9. `youtube-summarizer` (v1.2.1)
10. `audio-transcriber` (v1.2.1)

## 📦 Bundles

- `essential`
- `planning`
- `research`
- `content`
- `developer`
- `orchestration`
- `all`

```bash
npx claude-superskills --list-bundles
```

## 🔍 Search

```bash
npx claude-superskills --search "planning"
npx claude-superskills --search "research"
```

## ⚡ Shortcuts

- `i` => `install`
- `ls` => `list`
- `up` => `update`
- `rm` => `uninstall`
- `doc` => `doctor`

## 📖 Useful Commands

```bash
npx claude-superskills i -a -y -q
npx claude-superskills ls -q
npx claude-superskills up
npx claude-superskills doc
```
