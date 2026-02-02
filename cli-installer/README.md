# CLI AI Skills Installer

Install AI skills for **GitHub Copilot CLI** and **Claude Code** with a single command.

```bash
npx cli-ai-skills install
```

## ✨ Features

- 🎯 **Interactive Installation** - Choose skills, platforms, and scope
- 🔍 **Smart Version Detection** - Automatically detects outdated skills
- 📦 **Multi-Platform Support** - GitHub Copilot CLI and Claude Code
- 🌍 **Global or Local** - Install globally or per-repository
- 🔗 **Symlink Support** - Auto-updates with repository changes
- 📊 **Progress Gauge** - Visual progress tracking
- 🐍 **Python Requirements** - Auto-installs Python dependencies for skills that need them
- 🏥 **Doctor Command** - Diagnose installation issues

## 🚀 Quick Start

### Install All Skills

```bash
npx cli-ai-skills install --all
```

### Install Specific Skill

```bash
npx cli-ai-skills install prompt-engineer
```

### Interactive Installation

```bash
npx cli-ai-skills install
```

You'll be prompted to select:
- **Scope**: Global or Local
- **Platforms**: GitHub Copilot CLI, Claude Code, or both
- **Skills**: Which skills to install

## 📦 Available Skills

- **prompt-engineer** - Transform prompts using 11 established frameworks
- **skill-creator** - Create new skills interactively
- **youtube-summarizer** - Extract and summarize YouTube videos
- **audio-transcriber** 🐍 - Transcribe audio to text with meeting minutes and summaries

> 🐍 = Requires Python dependencies (auto-installed during setup)

## 📖 Commands

### `install [skills...]`

Install AI skills.

```bash
# Install all skills
npx cli-ai-skills install --all

# Install specific skills
npx cli-ai-skills install prompt-engineer skill-creator

# Install for specific platform
npx cli-ai-skills install --copilot
npx cli-ai-skills install --claude

# Install locally (in current repository)
npx cli-ai-skills install --local

# Silent installation (skip prompts)
npx cli-ai-skills install --all --yes
```

**Options:**
- `-a, --all` - Install all available skills
- `-g, --global` - Install globally (default)
- `-l, --local` - Install in current repository
- `--copilot` - Install only for GitHub Copilot CLI
- `--claude` - Install only for Claude Code
- `-y, --yes` - Skip confirmations
- `--copy` - Copy files instead of symlinks

### `list`

List available and installed skills.

```bash
npx cli-ai-skills list
```

Shows:
- ✅ Installed skills with versions
- ⚠️ Skills with updates available
- ⬜ Skills not yet installed

### `update [skills...]`

Update installed skills.

```bash
# Update all skills
npx cli-ai-skills update --all

# Update specific skill
npx cli-ai-skills update prompt-engineer
```

### `uninstall <skill>`

Remove an installed skill.

```bash
npx cli-ai-skills uninstall youtube-summarizer
```

### `doctor`

Diagnose installation issues.

```bash
npx cli-ai-skills doctor
```

Checks:
- ✅ Node.js version
- ✅ Platform installations (Copilot/Claude)
- ✅ Directory permissions
- ✅ Network connectivity
- ✅ Python environment (for audio-transcriber skill)
- ✅ Whisper and ffmpeg installation

## 🐍 Python Requirements

Some skills (like **audio-transcriber**) require Python dependencies. The installer handles this automatically:

### Automatic Installation

```bash
$ npx cli-ai-skills install audio-transcriber

📦 Downloading audio-transcriber v1.0.0...
✅ Installed successfully

📦 This skill requires Python dependencies
✅ Python detected: 3.11.7
? Install Python requirements now? (Y/n) Y

🔧 Running install-requirements.sh...
✅ pkg-config installed
✅ ffmpeg installed
✅ openai-whisper installed

🎉 audio-transcriber ready to use!
```

### Manual Installation

If you skip auto-install, you can run it later:

```bash
# Using the skill's install script
bash ~/.copilot/skills/audio-transcriber/scripts/install-requirements.sh

# Or manually with pip
pip install --user openai-whisper
brew install ffmpeg  # macOS
```

### Checking Python Status

```bash
npx cli-ai-skills doctor
```

Shows Python version, Whisper, and ffmpeg status.

## 🎨 Example Usage

### First-Time Installation

```bash
$ npx cli-ai-skills install

🤖 CLI AI Skills Installer v1.0.0

[████░░░░░░░░░░░░░░░░] 20% - Step 1/5: Detecting platforms
🔍 Platform Detection:
  ✅ GitHub Copilot CLI found (gh version 2.50.0)
  ✅ Claude Code detected (~/.claude/)

📍 Where do you want to install skills?
❯ Global (available for all projects)
  Local (current repository only)

📦 Select platforms to install skills for:
❯◉ GitHub Copilot CLI (~/.copilot/skills/)
 ◉ Claude Code (~/.claude/skills/)

🎯 Which skills do you want to install?
❯◉ prompt-engineer v1.0.0 - Transform prompts
 ◉ skill-creator v1.1.0 - Create new skills
 ◯ youtube-summarizer v1.0.0 - Summarize videos
 ◯ All skills

[████████████████████] 100% - Installation complete!

🎉 2 skills installed successfully on 2 platforms!
```

### Updating Skills

```bash
$ npx cli-ai-skills list

📦 CLI AI Skills

✅ prompt-engineer v1.0.0 (installed)
⚠️  skill-creator v1.0.0 (v1.1.0 available)
⬜ youtube-summarizer v1.0.0

$ npx cli-ai-skills update skill-creator

🔄 Updating skill-creator v1.0.0 → v1.1.0...
✅ Updated successfully

🎉 skill-creator updated to v1.1.0!
```

## 🔧 Global vs Local Installation

### Global Installation (Default)

```bash
npx cli-ai-skills install --global
```

- Skills available in **all projects**
- Installed in `~/.copilot/skills/` and `~/.claude/skills/`
- Uses **symlinks** (auto-updates on `git pull`)

### Local Installation

```bash
npx cli-ai-skills install --local
```

- Skills available **only in current repository**
- Installed in `.github/skills/` and `.claude/skills/`
- Uses **copy** (commit to share with team)

## 🐛 Troubleshooting

### Platforms Not Detected

```bash
npx cli-ai-skills doctor
```

This will diagnose:
- Missing GitHub Copilot CLI or Claude Code
- Permission issues
- Network connectivity problems

### Skills Not Working After Installation

1. **Open a new terminal** (environment needs to refresh)
2. Verify installation: `npx cli-ai-skills list`
3. Check permissions: `npx cli-ai-skills doctor`

### Update Fails

If update fails, try reinstalling:

```bash
npx cli-ai-skills uninstall <skill>
npx cli-ai-skills install <skill>
```

## 📝 Requirements

- **Node.js** >= 14.0.0
- **GitHub Copilot CLI** (optional) - [Install](https://docs.github.com/copilot/cli)
- **Claude Code** (optional) - [Install](https://claude.ai/code)

At least one AI platform is required.

## 🤝 Contributing

Found a bug or have a feature request? [Open an issue](https://github.com/ericgandrade/cli-ai-skills/issues).

## 📄 License

MIT © Eric Andrade

## 🔗 Links

- **Repository**: https://github.com/ericgandrade/cli-ai-skills
- **Skills Documentation**: https://github.com/ericgandrade/cli-ai-skills#readme
- **GitHub Copilot**: https://docs.github.com/copilot/cli
- **Claude Code**: https://claude.ai/code

---

**Made with ❤️ for AI-assisted development**
