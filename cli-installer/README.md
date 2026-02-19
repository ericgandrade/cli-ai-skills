# claude-superskills v1.7.2

🚀 **NPX Installer for AI Skills**

Install reusable skills for GitHub Copilot CLI, Claude Code, OpenAI Codex, OpenCode, and Gemini CLI in one command.

![Version](https://img.shields.io/badge/version-1.7.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## 🚀 Quick Start

**Shell installer (recommended):**
```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

**Or use NPX:**
```bash
# Zero-config installation (interactive)
npx claude-superskills

# Auto-install all platforms (skip prompts)
npx claude-superskills -y -q

# Install specific bundle
npx claude-superskills --bundle essential -y
```

See [Installation Guide](../docs/INSTALLATION.md) for all methods.

## 📦 What It Does

1. 🔍 **Detects** installed AI CLI tools (Copilot, Claude, Codex, OpenCode, Gemini)
2. 📋 **Lists** all 4 available AI skills
3. ⚙️ **Installs** skills to the correct platform directories
4. ✅ **Validates** installation success

## ⚡ Command Shortcuts

| Shortcut | Full Form | Purpose |
|----------|-----------|---------|
| `i` | `install` | Install skills (default) |
| `ls` | `list` | List installed skills |
| `up` | `update` | Update skills |
| `rm` | `uninstall` | Remove skills |
| `doc` | `doctor` | Check installation |

Examples:
```bash
npx claude-superskills i -y       # Install with confirmation skip
npx claude-superskills ls -q      # List quietly
npx claude-superskills up         # Check for updates
```

## 🚩 Short Flags

| Flag | Full Form | Purpose |
|------|-----------|---------|
| `-a` | `--all` | Operate on all platforms |
| `-g` | `--global` | Global installation |
| `-l` | `--local` | Local installation |
| `-y` | `--yes` | Skip all prompts |
| `-q` | `--quiet` | Minimal output |

Combine flags:
```bash
npx claude-superskills i -a -y -q    # Install all, skip prompts, quiet
```

## 📦 Curated Bundles

Instead of installing everything, choose a bundle:

```bash
# Essential (skill-creator, prompt-engineer)
npx claude-superskills --bundle essential -y

# Content (youtube-summarizer, audio-transcriber)
npx claude-superskills --bundle content -y

# Developer (skill-creator)
npx claude-superskills --bundle developer -y

# All (complete toolkit)
npx claude-superskills --bundle all -y
```

See all bundles:
```bash
npx claude-superskills --list-bundles
```

## 🔍 Search Skills

Find skills by keyword:

```bash
npx claude-superskills --search "prompt"
npx claude-superskills --search "video"
npx claude-superskills --search "transcription"
```

## 💻 Supported Platforms

- **GitHub Copilot CLI** (`~/.copilot/skills/`)
- **Claude Code** (`~/.claude/skills/`)
- **OpenAI Codex** (`~/.codex/skills/`)

## 📚 Available Skills

All 4 skills are universal and work on all platforms:

1. **skill-creator** (v1.3.0) - Create custom skills
2. **prompt-engineer** (v1.1.0) - Optimize prompts
3. **youtube-summarizer** (v1.2.0) - Summarize videos
4. **audio-transcriber** (v1.2.0) - Transcribe audio

## 🔧 Installation Methods

### Method 1: NPX (Easiest - Recommended)

```bash
# One-time use (always latest)
npx claude-superskills

# Or install globally
npm install -g claude-superskills
claude-superskills
```

### Method 2: From Source

```bash
git clone https://github.com/ericgandrade/claude-superskills.git
cd claude-superskills/cli-installer
npm link
claude-superskills
```

## 📖 Command Reference

### install / i
Install AI skills to selected platforms.

```bash
npx claude-superskills install                  # Interactive
npx claude-superskills i -a -y                  # All platforms, auto-confirm
npx claude-superskills install skill-creator    # Specific skill
```

### list / ls
List installed skills.

```bash
npx claude-superskills list
npx claude-superskills ls -q
```

### update / up
Check and update skills.

```bash
npx claude-superskills update
npx claude-superskills up
```

### doctor / doc
Diagnose installation issues.

```bash
npx claude-superskills doctor
npx claude-superskills doc
```

### --bundle
Install curated skill collections.

```bash
npx claude-superskills --bundle essential
npx claude-superskills --bundle content -y
npx claude-superskills --bundle all
```

### --search
Find skills by keyword.

```bash
npx claude-superskills --search "optimization"
npx claude-superskills --search "content"
```

### --list-bundles
Show all available bundles.

```bash
npx claude-superskills --list-bundles
```

## 🆕 New in v1.5.0

- ✨ **Command Shortcuts** - `i`, `ls`, `up`, `rm`, `doc`
- 🚩 **Short Flags** - `-a`, `-g`, `-l`, `-y`, `-q`
- 📦 **Bundle Support** - `--bundle <name>`
- 🔍 **Search Functionality** - `--search <keyword>`
- 🎯 **Zero-Config Install** - Run with no args, auto-detects all platforms
- 📊 **List Bundles** - `--list-bundles`

## ⚙️ System Requirements

- **Node.js** 14.0.0 or higher
- **npm** or **yarn**
- One or more AI CLI tools installed:
  - GitHub Copilot CLI
  - Claude Code
  - OpenAI Codex

## 🆘 Troubleshooting

### "Command not found"

```bash
# Ensure Node.js is installed
node --version

# Try with full npx path
npx claude-superskills
```

### "No platforms detected"

Make sure at least one of these is installed:
- `gh` (GitHub CLI with Copilot)
- `claude` (Claude Code)
- `codex` (OpenAI Codex CLI)

### "Permission denied"

```bash
# Check file permissions
chmod +x ~/.copilot/skills/*/
```

## 📦 What Gets Installed

The installer creates symlinks or copies skill files to:

```
~/.copilot/skills/              # GitHub Copilot
~/.claude/skills/               # Claude Code
~/.codex/skills/                # OpenAI Codex
```

Each skill includes:
- `SKILL.md` - Skill definition and documentation
- Support files and scripts
- Platform-specific configurations

## 🔗 Links

- **[Main Repository](https://github.com/ericgandrade/claude-superskills)**
- **[Skills Catalog](https://github.com/ericgandrade/claude-superskills#-available-skills)**
- **[Documentation](https://github.com/ericgandrade/claude-superskills#-documentation)**
- **[Contributing](https://github.com/ericgandrade/claude-superskills/blob/main/CONTRIBUTING.md)**

## 📄 License

MIT - Free to use, modify, and distribute.

---

**Ready to get started? Run `npx claude-superskills` now!** 🚀
