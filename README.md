# 🤖 CLI AI Skills v1.7.3

Reusable AI skills for **GitHub Copilot CLI**, **Claude Code**, **OpenAI Codex**, **OpenCode**, and **Gemini CLI** — install once, use everywhere.

![Version](https://img.shields.io/badge/version-1.7.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Skills](https://img.shields.io/badge/skills-6-brightgreen.svg)
![Platforms](https://img.shields.io/badge/platforms-5-orange.svg)

## 🚀 Quick Install

**One-liner (recommended):**
```bash
curl -fsSL https://raw.githubusercontent.com/ericandrade/cli-ai-skills/main/scripts/install.sh | bash
```

**Or use NPX (zero-install):**
```bash
npx cli-ai-skills
```

**Other methods:**
```bash
# npm global
npm install -g cli-ai-skills

# With bundles
npx cli-ai-skills --bundle essential -y
```

See [Installation Guide](docs/INSTALLATION.md) for all methods and troubleshooting.

**Uninstall:**
```bash
curl -fsSL https://raw.githubusercontent.com/ericandrade/cli-ai-skills/main/scripts/uninstall.sh | bash
```

## ✨ Features

- **6 Universal Skills** - Work on all platforms
- **Zero-Config Install** - Run once, works everywhere
- **Curated Bundles** - Install exactly what you need
- **Smart Search** - Find skills by keyword
- **5 Platform Support** - GitHub Copilot, Claude Code, Codex, OpenCode, Gemini
- **Discovery & Orchestration** - Find and plan with available resources
- **Command Shortcuts** - `i`, `ls`, `up`, `rm`, `doc`
- **Short Flags** - `-a`, `-g`, `-l`, `-y`, `-q`

## 📦 Available Skills

### 🔍 Discovery & Orchestration
| Skill | Version | Purpose |
|-------|---------|---------|
| **agent-skill-discovery** | v1.0.0 | Scan and list all installed plugins, agents, skills, and MCP servers |
| **agent-skill-orchestrator** | v1.0.0 | Intelligent task planning with resource matching and execution strategies |

### 🛠️ Development & Automation
| Skill | Version | Purpose |
|-------|---------|---------|
| **skill-creator** | v1.3.0 | Automate skill creation with guided workflow |
| **prompt-engineer** | v1.1.0 | Optimize prompts using 11 frameworks (RTF, RISEN, Chain of Thought, etc.) |

### 📝 Content Processing
| Skill | Version | Purpose |
|-------|---------|---------|
| **youtube-summarizer** | v1.2.0 | Extract YouTube transcripts and generate comprehensive summaries |
| **audio-transcriber** | v1.2.0 | Transform audio recordings into professional Markdown documentation |

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

## 🚀 Quick Start Examples

### Discovery & Planning Workflow

```bash
# 1. Discover what's available
claude  # or: gh copilot, gemini, opencode, codex
> "What do I have installed?"

# Output: Lists all plugins, skills, MCPs

# 2. Get intelligent execution plan
> "Plan how to build a REST API with authentication"

# Output: Detailed strategy using best available resources with confidence scores
```

### Other Use Cases

```bash
# Create a new skill
gh copilot -p "create a skill for PDF processing"

# Optimize a prompt
claude -p "improve this prompt: create REST API"

# Process content
gh copilot -p "transcribe this audio file: meeting.mp3"

# Orchestrate complex tasks
gemini -p "design a solution for processing meeting notes and creating Jira tickets"
```

## 💻 Supported Platforms

- **GitHub Copilot CLI** - Terminal AI assistant (`~/.github/skills/`)
- **Claude Code** - Anthropic's Claude in development (`~/.claude/skills/`)
- **OpenAI Codex** - GPT-powered coding assistant (`~/.codex/vendor_imports/skills/skills/.curated/`)
- **OpenCode** - Open source AI coding assistant (`~/.opencode/skills/`)
- **Gemini CLI** - Google's Gemini in terminal (`~/.gemini/skills/`)

**Note on Codex:** The installer automatically handles Codex's unique directory structure. Skills are installed to `~/.codex/vendor_imports/skills/skills/.curated/` and should appear in the Codex App after restart.

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
