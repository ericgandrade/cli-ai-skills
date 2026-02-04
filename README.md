# 🤖 CLI AI Skills v1.5.0

Reusable AI skills for **GitHub Copilot CLI**, **Claude Code**, and **OpenAI Codex** — install once, use everywhere.

![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Skills](https://img.shields.io/badge/skills-4-brightgreen.svg)
![Platforms](https://img.shields.io/badge/platforms-3-orange.svg)

## 🚀 Quick Start

```bash
# Zero-config installation
npx cli-ai-skills

# Or choose a bundle
npx cli-ai-skills --bundle essential -y
```

That's it! All skills are now available across your projects.

## ✨ Features

- **4 Universal Skills** - Work on all platforms
- **Zero-Config Install** - Run once, works everywhere
- **Curated Bundles** - Install exactly what you need
- **Smart Search** - Find skills by keyword
- **3 Platform Support** - GitHub Copilot, Claude Code, Codex
- **Command Shortcuts** - `i`, `ls`, `up`, `rm`, `doc`
- **Short Flags** - `-a`, `-g`, `-l`, `-y`, `-q`

## 📦 Available Skills

| Skill | Version | Category | Purpose |
|-------|---------|----------|---------|
| **skill-creator** | v1.3.0 | Meta | Automate skill creation |
| **prompt-engineer** | v1.1.0 | Automation | Optimize prompts using 11 frameworks |
| **youtube-summarizer** | v1.2.0 | Content | Summarize YouTube videos |
| **audio-transcriber** | v1.2.0 | Content | Transcribe audio to Markdown |

## 🎯 Curated Bundles

```bash
# Essential Skills (recommended for beginners)
npx cli-ai-skills --bundle essential -y

# Content Creation (video & audio)
npx cli-ai-skills --bundle content -y

# Skill Developer (for creating custom skills)
npx cli-ai-skills --bundle developer -y

# All Skills (complete collection)
npx cli-ai-skills --bundle all -y
```

See [Bundles Guide](docs/bundles/bundles.md) for details.

## 🔍 Search Skills

```bash
npx cli-ai-skills --search "prompt"
npx cli-ai-skills --search "video"
```

## 💻 Supported Platforms

- **GitHub Copilot CLI** - Terminal AI assistant
- **Claude Code** - Anthropic's Claude in development
- **OpenAI Codex** - GPT-powered coding assistant

## 📚 Documentation

- **[Getting Started](docs/guides/getting-started.md)** - First-time user guide
- **[Skill Anatomy](docs/guides/skill-anatomy.md)** - How skills work
- **[Bundles Guide](docs/bundles/bundles.md)** - Curated collections
- **[Quality Standards](docs/guides/quality-standards.md)** - Best practices
- **[Full Catalog](CATALOG.md)** - Complete skill listing

## ⚡ CLI Commands & Shortcuts

| Command | Shortcut | Purpose |
|---------|----------|---------|
| `install` | `i` | Install skills |
| `list` | `ls` | List installed skills |
| `update` | `up` | Update skills |
| `uninstall` | `rm` | Remove skills |
| `doctor` | `doc` | Check installation |

```bash
npx cli-ai-skills i -a -y -q    # Install all, skip prompts, quiet mode
npx cli-ai-skills ls -q         # List with minimal output
npx cli-ai-skills --list-bundles # Show available bundles
```

## 📋 System Requirements

- Node.js 14+ (for installer)
- One or more supported platforms installed
- Python 3.8+ (for some skills with dependencies)

## 🤝 Contributing

We welcome contributions! Check [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

- Create new skills using the [skill-creator](https://github.com/ericgandrade/cli-ai-skills) skill
- Follow [Quality Standards](docs/guides/quality-standards.md)
- Report issues and suggestions

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.

## 🔗 Quick Links

- 📚 [Full Catalog](CATALOG.md) - All skills with metadata
- 🛠️ [Skills Development Guide](docs/references/skills-development.md) - Create custom skills
- 📝 [Changelog](CHANGELOG.md) - Release history
- 🐛 [Issues](https://github.com/ericgandrade/cli-ai-skills/issues) - Report problems
- 💬 [Discussions](https://github.com/ericgandrade/cli-ai-skills/discussions) - Share ideas

---

**Built with ❤️ by [Eric Andrade](https://github.com/ericgandrade)**

*Version 1.5.0 | February 2026*

## 🎁 Get Started

Choose a bundle that fits your workflow:

- **[Essential](docs/bundles/bundles.md#-essential-bundle)** - skill-creator, prompt-engineer
- **[Content](docs/bundles/bundles.md#-content-creation-bundle)** - youtube-summarizer, audio-transcriber  
- **[Developer](docs/bundles/bundles.md#-developer-bundle)** - skill-creator for power users
- **[All](docs/bundles/bundles.md#-all-skills-bundle)** - Complete toolkit

See [detailed comparison](docs/bundles/bundles.md#-bundle-comparison).

## 🛠️ Advanced Usage

- **[Skill Anatomy](docs/guides/skill-anatomy.md)** - How to build skills
- **[Skills Development](docs/references/skills-development.md)** - Advanced creation
- **[Changelog](CHANGELOG.md)** - Version history

---

**Getting Started? Check [Quick Start](docs/guides/getting-started.md) or run `npx cli-ai-skills` now!**
