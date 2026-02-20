# 🤖 Claude Superskills v1.12.0

Reusable AI CLI skills for GitHub Copilot and Claude Code.

![Version](https://img.shields.io/badge/version-1.12.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Skills](https://img.shields.io/badge/skills-12-brightgreen.svg)
![Platforms](https://img.shields.io/badge/platforms-8-orange.svg)

## 🚀 Quick Install

**One-liner (recommended):**
```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

**Or use NPX (zero-install):**
```bash
npx claude-superskills
```

**Other methods:**
```bash
# npm global
npm install -g claude-superskills

# With bundles
npx claude-superskills --bundle essential -y
```

**Local install (no npm/npx required):**

If you have cloned the repository and want to install skills directly, without any internet download or Node.js:
```bash
git clone https://github.com/ericgandrade/claude-superskills
cd claude-superskills

# Interactive — choose which platforms to install to
./scripts/local-install.sh

# Auto-install to all detected platforms
./scripts/local-install.sh -y

# Silent auto-install (CI / scripted environments)
./scripts/local-install.sh -y -q
```

The script reads directly from `skills/`, detects your installed platforms, and copies everything into the right directories. No Node.js, no npm, no internet.

See [Installation Guide](docs/INSTALLATION.md) for all methods and troubleshooting.

**Uninstall:**
```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/uninstall.sh | bash
```

## ✨ Features

- **12 Universal Skills** - Work on all platforms
- **Zero-Config Install** - Run once, works everywhere
- **Curated Bundles** - Install exactly what you need
- **Smart Search** - Find skills by keyword
- **8 Platform Support** - GitHub Copilot, Claude Code, Codex, OpenCode, Gemini, Antigravity, Cursor, AdaL
- **Discovery & Orchestration** - Find and plan with available resources
- **Command Shortcuts** - `i`, `ls`, `up`, `rm`, `doc`
- **Short Flags** - `-a`, `-g`, `-l`, `-y`, `-q`

## 📦 Available Skills

### 🔍 Discovery & Orchestration
| Skill | Version | Purpose |
|-------|---------|---------|
| **agent-skill-discovery** | v1.1.0 | Scan installed resources and current repository resources (agents, skills, MCPs) |
| **agent-skill-orchestrator** | v1.1.0 | Intelligent task planning with automatic prompt optimization and resource matching |

### 🛠️ Development & Automation
| Skill | Version | Purpose |
|-------|---------|---------|
| **skill-creator** | v1.3.1 | Automate skill creation with guided workflow |
| **prompt-engineer** | v1.1.0 | Optimize prompts using 11 frameworks (RTF, RISEN, Chain of Thought, etc.) |

### 🧭 Planning & Execution
| Skill | Version | Purpose |
|-------|---------|---------|
| **brainstorming** | v1.0.0 | Mandatory pre-implementation design clarification workflow |
| **writing-plans** | v1.0.0 | Build detailed, actionable implementation plans before coding |
| **executing-plans** | v1.0.0 | Execute plans in batches with checkpoints and review gates |

### 🔬 Research & Analysis
| Skill | Version | Purpose |
|-------|---------|---------|
| **deep-research** | v1.0.0 | Multi-step research workflow with citations using native web tools (no Google API required) |
| **us-program-research** | v1.0.0 | Structured US academic program research, ranking, and application action-plan generation |

### 📝 Content Processing
| Skill | Version | Purpose |
|-------|---------|---------|
| **youtube-summarizer** | v1.2.1 | Extract YouTube transcripts and generate comprehensive summaries |
| **audio-transcriber** | v1.2.1 | Transform audio recordings into professional Markdown documentation |
| **docling-converter** | v1.0.0 | Convert PDF/Office/image documents to Markdown/JSON/HTML with optional OCR |

## 🎯 Curated Bundles

```bash
# Essential Skills (recommended for beginners)
npx claude-superskills --bundle essential -y

# Content Creation (video & audio)
npx claude-superskills --bundle content -y

# Planning & Execution
npx claude-superskills --bundle planning -y

# Research & Analysis
npx claude-superskills --bundle research -y

# Skill Developer (for creating custom skills)
npx claude-superskills --bundle developer -y

# All Skills (complete collection)
npx claude-superskills --bundle all -y
```

See [Bundles Guide](docs/bundles/bundles.md) for details.

## 🔍 Search Skills

```bash
npx claude-superskills --search "prompt"
npx claude-superskills --search "video"
```

## 🚀 Quick Start Examples

### Discovery & Planning Workflow

```bash
# 1. Discover what's available
claude  # or: gh copilot, gemini, opencode, codex
> "What do I have installed?"

# Output: Lists installed and current-repository plugins, skills, MCPs

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
- **OpenCode** - Open source AI coding assistant (`~/.agent/skills/`)
- **Gemini CLI** - Google's Gemini in terminal (`~/.gemini/skills/`)
- **Antigravity** - AI coding assistant (`~/.agent/skills/`)
- **Cursor IDE** - AI-powered code editor (`~/.cursor/skills/`)
- **AdaL CLI** - AI development assistant (`~/.adal/skills/`)

**Note on Codex:** The installer automatically handles Codex's unique directory structure. Skills are installed to `~/.codex/vendor_imports/skills/skills/.curated/` and should appear in the Codex App after restart.

## ⌨️ Compatibility & Invocation

These skills follow the universal `SKILL.md` format and work with any AI coding assistant that supports agentic skills.

| Tool | Type | Invocation Example | Path |
|------|------|--------------------|------|
| **Claude Code** | CLI | `/skill-name help me...` | `.claude/skills/` |
| **Gemini CLI** | CLI | `Use skill-name to...` | `.gemini/skills/` |
| **Codex CLI** | CLI | `Use skill-name to...` | `.codex/skills/` |
| **Antigravity** | IDE | *(Agent Mode)* `Use skill...` | `.agent/skills/` |
| **Cursor** | IDE | `@skill-name` in Chat | `.cursor/skills/` |
| **Copilot** | Ext | *(Paste skill content manually)* | N/A |
| **OpenCode** | CLI | `opencode run @skill-name` | `.agent/skills/` |
| **AdaL CLI** | CLI | *(Auto)* Skills load on-demand | `.adal/skills/` |

> **Tip — Universal Path:** Clone to `.agent/skills/`. Most modern tools (Antigravity, recent CLIs) look here by default.

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
npx claude-superskills i -a -y -q    # Install all, skip prompts, quiet mode
npx claude-superskills ls -q         # List with minimal output
npx claude-superskills --list-bundles # Show available bundles
```

## 📋 System Requirements

- Node.js 14+ (for installer)
- One or more supported platforms installed
- Python 3.8+ (for some skills with dependencies)

## 🤝 Contributing

We welcome contributions! Check [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

- Create new skills using the [skill-creator](https://github.com/ericgandrade/claude-superskills) skill
- Follow [Quality Standards](docs/guides/quality-standards.md)
- Report issues and suggestions

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.

## 🔗 Quick Links

- 📚 [Full Catalog](CATALOG.md) - All skills with metadata
- 🛠️ [Skills Development Guide](docs/references/skills-development.md) - Create custom skills
- 📝 [Changelog](CHANGELOG.md) - Release history
- 🐛 [Issues](https://github.com/ericgandrade/claude-superskills/issues) - Report problems
- 💬 [Discussions](https://github.com/ericgandrade/claude-superskills/discussions) - Share ideas

---

**Built with ❤️ by [Eric Andrade](https://github.com/ericgandrade)**

*Version 1.12.0 | February 2026*

## 🎁 Get Started

Choose a bundle that fits your workflow:

- **[Essential](docs/bundles/bundles.md#-essential-bundle)** - skill-creator, prompt-engineer
- **[Content](docs/bundles/bundles.md#-content-creation-bundle)** - youtube-summarizer, audio-transcriber, docling-converter  
- **[Planning](docs/bundles/bundles.md#-planning--execution-bundle)** - brainstorming, writing-plans, executing-plans
- **[Research](docs/bundles/bundles.md#-research--analysis-bundle)** - deep-research, us-program-research + discovery
- **[Developer](docs/bundles/bundles.md#-developer-bundle)** - skill-creator for power users
- **[All](docs/bundles/bundles.md#-all-skills-bundle)** - Complete toolkit

See [detailed comparison](docs/bundles/bundles.md#-bundle-comparison).

## 🛠️ Advanced Usage

- **[Skill Anatomy](docs/guides/skill-anatomy.md)** - How to build skills
- **[Skills Development](docs/references/skills-development.md)** - Advanced creation
- **[Changelog](CHANGELOG.md)** - Version history

---

**Getting Started? Check [Quick Start](docs/guides/getting-started.md) or run `npx claude-superskills` now!**
