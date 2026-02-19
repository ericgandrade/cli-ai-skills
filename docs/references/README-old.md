# 🤖 CLI AI Skills

Reusable AI skills for **GitHub Copilot CLI**, **Claude Code**, and **OpenAI Codex CLI/App** that work globally across all your projects.

---

## 🧠 What Is This Project?

This repository provides **reusable skills** for **terminal-based AI assistants** like GitHub Copilot CLI, Claude Code, and OpenAI Codex CLI/App.

### What Are Skills?

Skills are "specialized instructions" that teach AI assistants how to perform specific tasks (like optimizing prompts, summarizing YouTube videos, creating new skills, etc.). Think of them as plugins or extensions that add new capabilities to your AI tools.

### Who Is This For?

If you use **GitHub Copilot CLI**, **Claude Code**, or **OpenAI Codex** in your terminal and want to extend their capabilities with specialized workflows, this project is for you.

---

## 🛠️ Supported Tools

### GitHub Copilot CLI

**What it is:** GitHub's AI assistant that runs in your terminal. It answers questions, generates code, and executes commands.

**How to install:**
- Requires GitHub Copilot subscription ([pricing info](https://github.com/features/copilot/plans))
- Installation: `gh extension install github/gh-copilot`
- Official docs: [docs.github.com/copilot/github-copilot-in-the-cli](https://docs.github.com/en/copilot/github-copilot-in-the-cli)

**Example usage:**
```bash
gh copilot suggest "create REST API in Python"
```

---

### Claude Code

**What it is:** Anthropic's AI-powered development environment that runs in your terminal. It edits code, executes commands, and answers questions.

**How to install:**
- Visit [claude.ai/code](https://claude.ai/code)
- Requires Anthropic account (free or paid plans available)
- Official docs: [code.claude.com/docs](https://code.claude.com/docs)

**Example usage:**
```bash
claude
# Starts interactive terminal session
```

---

### OpenAI Codex CLI/App

**What it is:** OpenAI's intelligent coding assistant available both as a **CLI tool** and **desktop application**. Built on the Codex model (powers GitHub Copilot), it provides conversational AI assistance for coding tasks directly in your terminal or dedicated app.

**What's included:**
- **Codex CLI:** Terminal-based interface for command-line workflows
- **Codex App (Desktop):** Standalone desktop application with enhanced UI (launched Feb 2, 2026)

**How to install:**
- **CLI:** `npm install -g @openai/codex-cli` (requires OpenAI API key)
- **Desktop App:** Download from [openai.com/codex/app](https://openai.com/codex/app)
- Official docs: [platform.openai.com/docs/guides/codex](https://platform.openai.com/docs/guides/codex)

**Example usage:**
```bash
# CLI
codex "create a Python REST API"

# With skills (manual invocation)
codex "@prompt-engineer improve: create REST API"
```

**Key difference:** Codex requires **manual skill invocation** using `@skill-name` syntax (no automatic triggers like Copilot/Claude).

---

### ✨ What This Project Adds

With the **skills** in this repository, you add new specialized capabilities to all three platforms:

- 🎯 **prompt-engineer**: Transforms simple prompts into optimized prompts using 11 frameworks
- 🎥 **youtube-summarizer**: Automatically summarizes YouTube videos
- 🛠️ **skill-creator**: Creates new custom skills with best practices built-in
- 🎙️ **audio-transcriber**: Transcribes audio with intelligent summaries using LLM integration

**Without skills:** The tools only answer basic questions.  
**With skills:** They gain specialized superpowers! 🚀

---

## 📦 Available Skills

### 🎯 **prompt-engineer** v1.0.2

Transform raw prompts into optimized prompts using **11 established frameworks**.

**Status:** ✨ Zero-Config | 🌍 Universal

**Supported Frameworks:**
- **RTF** (Role-Task-Format): Role-based tasks
- **Chain of Thought**: Step-by-step reasoning
- **RISEN** (Role, Instructions, Steps, End goal, Narrowing): Structured projects
- **RODES** (Role, Objective, Details, Examples, Sense check): Complex design
- **Chain of Density**: Summarization and compression
- **RACE** (Role, Audience, Context, Expectation): Communication tasks
- **RISE** (Research, Investigate, Synthesize, Evaluate): Investigation
- **STAR** (Situation, Task, Action, Result): Contextual problem-solving
- **SOAP** (Subjective, Objective, Assessment, Plan): Structured documentation
- **CLEAR** (Collaborative, Limited, Emotional, Appreciable, Refinable): Goal-setting
- **GROW** (Goal, Reality, Options, Will): Coaching and development

**Triggers:**
- `melhore este prompt`
- `otimize prompt`
- `refine prompt`
- `prompt engineering`
- `transforme em prompt`
- `crie prompt para`

**Features:**
- 🎯 Intelligent intent analysis
- 🔄 Framework blending (combines 2-3 frameworks when needed)
- ❓ Interactive clarification when ambiguous
- 📏 Adaptive output (short/long based on context)
- 🪄 Magic mode (no technical explanations)

**[→ Full Documentation](./.github/skills/prompt-engineer/README.md)**

---

### 🛠️ **skill-creator** v1.1.1

Automate CLI skill creation with best practices built-in.

**Status:** ✨ Zero-Config | 🌍 Universal | 🔧 Meta-Skill

**Capabilities:**
- 🎯 Interactive brainstorming workflow (5 phases with progress tracking)
- ✨ Template-driven file generation
- 🔍 Automatic validation (YAML + content + style)
- 📦 Flexible installation (local/global/hybrid)
- 📊 Visual progress bar (`[████████████░░░░░░] 60% - Step 3/5`)
- 🔗 Optional prompt-engineer integration

**Triggers:**
- `create a new skill`
- `build a skill`
- `make a custom skill`
- `develop a CLI skill`
- `extend the CLI`

**Features:**
- 🎯 Step 0: Discovery pattern (runtime platform detection)
- 📏 Anthropic best practices enforcement
- 📝 Progressive disclosure (SKILL.md + bundled resources)
- ✅ Writing style validation (imperative/third-person)
- 📊 Word count optimization (1.5-2k ideal)
- 🔧 Bundled resources structure (references/examples/scripts)

**[→ Full Documentation](./.github/skills/skill-creator/README.md)**

---

### 🎥 **youtube-summarizer** v1.2.0

Extract transcripts from YouTube videos and generate comprehensive, detailed summaries. Powered by [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) by [Julien Depoix](https://github.com/jdepoix).

**Status:** ✨ Zero-Config | 🌍 Universal

**Capabilities:**
- 📹 Automatic transcript extraction using [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api)
- ✅ Video validation (checks accessibility and transcript availability)
- 🌍 Multi-language support (Portuguese/English with auto-fallback)
- 📊 Comprehensive summaries using STAR + R-I-S-E framework
- 📝 Structured Markdown output with sections and insights
- 🔍 Includes video metadata (title, channel, duration, URL)
- 🛠️ Automatic dependency management
- 📊 Visual progress gauge during transcript extraction and summarization
- 💾 Save summary to .md file (with optional raw transcript)

**Triggers:**
- `resume este video`
- `resumir video do youtube`
- `extrair transcript youtube`
- `summarize youtube video`

**Features:**
- 🎯 Validates YouTube URL format (multiple formats supported)
- ✅ Checks video and transcript availability before processing
- 📝 Generates verbose summaries prioritizing completeness
- 💡 Extracts key insights, concepts, and terminology
- 🔗 Documents resources and references mentioned in video
- ⚡ Clear error messages for all failure scenarios
- 📦 Bundled scripts for dependency installation and transcript extraction

**[→ Full Documentation](./.github/skills/youtube-summarizer/README.md)**

---

### 🎙️ **audio-transcriber** v1.1.1

Transform audio recordings into professional Markdown documentation with **intelligent atas/summaries using LLM integration** (Claude/Copilot CLI) and **automatic prompt engineering**.

**Status:** ✨ Zero-Config | 🌍 Universal | 🤖 AI-Enhanced | 🐍 Python | 🎯 Interactive

**🆕 New in v1.1.1:**
- ✨ **LLM Integration** - Claude CLI (primary) or GitHub Copilot CLI (fallback) for intelligent processing
- 🧠 **Smart Prompts** - Automatic integration with prompt-engineer skill
  - User prompts → Automatically improved → Show both versions → User chooses
  - No prompt → Analyzes transcript → Suggests format → Generates structured prompt → User confirms
- 📊 **Progress Indicators** - Visual progress bars (tqdm) and spinners (rich)
- 📁 **Timestamp Filenames** - `transcript-YYYYMMDD-HHMMSS.md` + `ata-YYYYMMDD-HHMMSS.md`
- 🧹 **Auto-Cleanup** - Removes temporary `metadata.json` and `transcription.json`
- 🎨 **Rich Terminal UI** - Beautiful formatted output with panels and colors

**Core Capabilities:**
- 📝 Rich Markdown output with technical metadata (file size, duration, language, speakers)
- 🎙️ Speaker diarization (automatically identifies different speakers)
- 📋 Automatic meeting minutes generation (topics, decisions, action items) **via LLM**
- 💡 Executive summaries (3-5 paragraphs with key points) **via LLM**
- 🌍 99 languages with automatic detection
- ⚡ Auto-install dependencies (Whisper + ffmpeg + tqdm + rich via script)
- 🔒 100% local processing (privacy-first, no cloud uploads for Whisper)
- 🚀 Intelligent or transcript-only mode (user choice)
- ⚙️ Uses Faster-Whisper (4-5x faster) or OpenAI Whisper (fallback)

**Triggers:**
- `transcribe audio to markdown`
- `transcreva este áudio`
- `convert audio file to text`
- `extract speech from audio`

**Requirements:**
- Python 3.8+ (auto-checked)
- `openai-whisper` or `faster-whisper` (auto-installed via script)
- `tqdm` and `rich` (auto-installed for UI)
- `ffmpeg` (optional, auto-installed on macOS via Homebrew)
- **Optional:** Claude CLI or GitHub Copilot CLI (for intelligent ata/summary generation)
- **Optional:** prompt-engineer skill (for automatic prompt optimization)

**Supported Audio Formats:**
MP3, WAV, M4A, OGG, FLAC, WEBM, MP4

**Inspired by:** [Plaud AI](https://www.plaud.ai/) recorder

**[→ Full Documentation](./.github/skills/audio-transcriber/README.md)** | **[→ Changelog](./github/skills/audio-transcriber/CHANGELOG.md)**

---

### 🗺️ Roadmap

Upcoming features in development:

- ✅ **npx installer** — ~~Install skills directly via `npx`, without manual clone or symlink~~ **RELEASED v1.0.0** 🎉
- ✅ **Codex CLI/App support** — ~~Native skill support for OpenAI Codex integration~~ **RELEASED v1.4.0** 🎉
- 🤖 **Gemini skill** — Native skill for Google Gemini integration ([#2](https://github.com/ericgandrade/claude-superskills/issues/2))
- 💻 **OpenCode skill** — Native skill for OpenCode integration ([#3](https://github.com/ericgandrade/claude-superskills/issues/3))

**Want to contribute?** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📚 Frameworks Reference

The skills in this library leverage established prompting frameworks to optimize AI interactions. Below is a comprehensive reference of all frameworks used.

### Prompt Engineering Frameworks (Used by `prompt-engineer`)

| Framework | Acronym | Best For | Key Components |
|-----------|---------|----------|----------------|
| **Role-Task-Format** | RTF | Role-based tasks requiring specific expertise | Role → Task → Format |
| **Chain of Thought** | CoT | Step-by-step reasoning, debugging, logic | Problem → Steps → Solution |
| **RISEN** | RISEN | Structured multi-phase projects | Role, Instructions, Steps, End goal, Narrowing |
| **RODES** | RODES | Complex design and system architecture | Role, Objective, Details, Examples, Sense check |
| **Chain of Density** | CoD | Summarization and iterative compression | Verbose → Iterative compression → Dense |
| **RACE** | RACE | Communication and presentations | Role, Audience, Context, Expectation |
| **RISE** | RISE | Investigation and systematic analysis | Research, Investigate, Synthesize, Evaluate |
| **STAR** | STAR | Contextual problem-solving | Situation, Task, Action, Result |
| **SOAP** | SOAP | Structured documentation and records | Subjective, Objective, Assessment, Plan |
| **CLEAR** | CLEAR | Goal-setting and measurable objectives | Collaborative, Limited, Emotional, Appreciable, Refinable |
| **GROW** | GROW | Coaching and personal development | Goal, Reality, Options, Will |

### Framework Selection Logic

The **prompt-engineer** skill analyzes your input and:
1. **Detects task type** (coding, writing, analysis, design, etc.)
2. **Identifies complexity** (simple, moderate, complex)
3. **Selects primary framework** (best match for your task)
4. **Blends secondary frameworks** when it improves results

**Common Framework Blends:**
- **RODES + Chain of Thought** → Complex technical projects requiring step-by-step planning
- **CLEAR + GROW** → Leadership and personal development goals
- **RACE + STAR** → Strategic communication with rich context

**You never choose the framework manually** - the skill does it automatically based on your needs.

### Further Reading

- **[Prompt Engineering Guide](https://www.promptingguide.ai)** - Comprehensive guide to prompting techniques
- **[Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)** - Claude-specific best practices
- **[OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)** - GPT best practices
- **[PromptCowboy](https://promptcowboy.com/)** - Framework-driven prompt optimization inspiration

---

## 📋 System Requirements

### Base Requirements (All Skills)

- **Operating System:** macOS, Linux, or Windows (WSL recommended)
- **GitHub Copilot CLI** or **Claude Code** (see [Supported Tools](#-supported-tools))

### Skill-Specific Dependencies

Some skills require additional dependencies for full functionality:

#### 🎥 youtube-summarizer

**Required:**
- **Python 3.8+** with pip

**Python Package:**
- `youtube-transcript-api` (auto-installed by skill)

**Installation:**
```bash
# The skill offers automatic installation, or install manually:
pip3 install youtube-transcript-api
```

---

#### 🎙️ audio-transcriber

**Required:**
- **Python 3.8+** with pip
- **ffmpeg** (for audio format conversion)

**Python Packages (choose one):**
- `faster-whisper` (recommended, faster performance)
- `openai-whisper` (alternative, original Whisper)

**Installation:**
```bash
# The skill offers automatic installation via bundled script:
~/.copilot/skills/audio-transcriber/scripts/install-requirements.sh

# Or install manually:
# Option 1: Faster-Whisper (recommended)
pip3 install faster-whisper

# Option 2: OpenAI Whisper
pip3 install openai-whisper

# System dependencies
# macOS:
brew install ffmpeg

# Linux:
sudo apt install ffmpeg  # Debian/Ubuntu
sudo yum install ffmpeg  # CentOS/RHEL
```

---

#### 🎯 prompt-engineer

**No external dependencies required** - Works out of the box! ✨

---

#### 🛠️ skill-creator

**No external dependencies required** - Works out of the box! ✨

---

### Dependency Installation

Skills with dependencies follow a **zero-config philosophy**:

1. **Automatic detection** - Skills check if dependencies are installed
2. **Interactive installation** - Offers to install missing dependencies automatically
3. **Bundled scripts** - Each skill includes installation scripts in `scripts/` folder
4. **Manual fallback** - Clear instructions provided if automatic installation fails

**Example workflow:**
```bash
# When you trigger a skill with dependencies
copilot> summarize this video: https://youtube.com/watch?v=xyz

# Skill checks dependencies
✅ Python 3.11 detected
❌ youtube-transcript-api not found

# Offers installation
Would you like to install youtube-transcript-api now? [Y/n]

# Installs automatically
📦 Installing youtube-transcript-api...
✅ Installation complete!
```

---

## 🚀 Installation

### ⚡ Quick Install via npx (Easiest - Recommended)

[![npm version](https://img.shields.io/npm/v/claude-superskills.svg)](https://www.npmjs.com/package/claude-superskills)
[![npm downloads](https://img.shields.io/npm/dm/claude-superskills.svg)](https://www.npmjs.com/package/claude-superskills)

**NEW in v1.4.0:** Smart installer with automatic platform detection and interactive selection!

```bash
# Smart installer - detects installed AI CLI tools and prompts which to use
npx claude-superskills

# Or use legacy commands:
npx claude-superskills install         # Interactive mode
npx claude-superskills install --all   # Install for all detected platforms
npx claude-superskills list            # List available skills
npx claude-superskills update          # Update installed skills
npx claude-superskills doctor          # Diagnose installation issues
```

**How it works:**
1. 🔍 **Auto-detects** installed AI CLI tools (GitHub Copilot, Claude Code, OpenAI Codex)
2. 📋 **Interactive menu** - select which platforms to install skills for (multi-select)
3. 🔗 **Creates symlinks** to appropriate directories for each platform
4. ✅ **Done!** Skills are immediately available

**Features:**
- 🚀 **No git clone required** - works from any directory
- 🎯 **Tri-platform support** - Copilot, Claude, and Codex detected automatically
- 📊 **Visual progress** - real-time feedback during installation
- ✅ **Version checking** - automatically detects outdated skills and offers updates
- 🔍 **Smart detection** - auto-discovers all three AI CLI tools
- 🛠️ **Built-in diagnostics** - `doctor` command for troubleshooting

**Installation locations:**
- **GitHub Copilot CLI:** `~/.github/skills/` (global) or `.github/skills/` (local)
- **Claude Code:** `~/.claude/skills/` (global) or `.claude/skills/` (local)
- **OpenAI Codex:** `~/.codex/skills/` (global) or `.codex/skills/` (local)

---

### 🔧 Install from Source (Advanced)

For development or if you want auto-updates via `git pull`:

1. **Clone this repository:**
   ```bash
   git clone https://github.com/ericgandrade/claude-superskills.git
   cd claude-superskills
   ```

2. **Run the install script:**
   ```bash
   ./scripts/install-skills.sh ~/path/to/claude-superskills
   
   # Or use current directory
   ./scripts/install-skills.sh $(pwd)
   ```

   This creates **symlinks** in:
   - `~/.copilot/skills/` (for GitHub Copilot CLI)
   - `~/.claude/skills/` (for Claude Code)

3. **Open a NEW terminal** and test:
   ```bash
   # GitHub Copilot - use any trigger (English or Portuguese)
   gh copilot -p "improve this prompt: create REST API"
   
   # Claude Code - start interactive session
   claude
   ```

**Benefits of symlink installation:**
- ✅ Updates automatically when you `git pull`
- ✅ No config file editing needed
- ✅ Single source of truth

---

### Manual Installation

#### GitHub Copilot CLI

Skills auto-discover from `~/.copilot/skills/`:

```bash
# Create skills directory
mkdir -p ~/.copilot/skills

# Copy or symlink skills
cp -r claude-superskills/.github/skills/* ~/.copilot/skills/

# Or create symlink (recommended)
ln -s /full/path/to/claude-superskills/.github/skills/prompt-engineer ~/.copilot/skills/prompt-engineer
```

#### Claude Code

Skills auto-discover from `~/.claude/skills/`:

```bash
# Create skills directory
mkdir -p ~/.claude/skills

# Copy or symlink skills
cp -r claude-superskills/.claude/skills/* ~/.claude/skills/

# Or create symlink (recommended)
ln -s /full/path/to/claude-superskills/.claude/skills/prompt-engineer ~/.claude/skills/prompt-engineer
```

---

## 🎯 Quick Start

### Example 1: Improve a Simple Prompt (GitHub Copilot / Claude Code)

**Input:**
```bash
copilot> improve this prompt: help me write python code
```

**Skill asks:**
```
What type of Python code do you need?
- [ ] Data analysis
- [ ] Web scraping
- [ ] Task automation
```

**You select:** "Web scraping"

**Output:**
````markdown
```
You are a Python developer expert in web scraping.

Task: Create a Python script to scrape [specify target website].

Requirements:
- Use BeautifulSoup or Scrapy
- Implement pagination and rate limiting
- Store data in structured format (CSV or JSON)

Output format: Complete and commented Python code with usage examples.
```
````

---

### Example 2: Using Skills with OpenAI Codex

**OpenAI Codex requires manual skill invocation** using `@skill-name`:

```bash
# Prompt engineering
codex> @prompt-engineer improve: create REST API in Python

# Create new skill
codex> @skill-creator new skill for database migrations

# Summarize YouTube video
codex> @youtube-summarizer https://youtube.com/watch?v=dQw4w9WgXcQ

# Transcribe audio
codex> @audio-transcriber meeting-recording.m4a summarize key decisions
```

**Key difference:** Copilot and Claude support automatic triggers, but Codex requires explicit `@skill-name` invocation.

---

## 📚 Resources

### For Users

- **[Prompt Engineer Documentation](./.github/skills/prompt-engineer/README.md)** - Full user guide for the prompt-engineer skill

### For Developers

- **[Skills Development Guide](./resources/skills-development.md)** - Learn how to create your own AI skills
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute new skills to this repository
- **[Versioning Guide](./VERSIONING.md)** - Tri-platform versioning strategy and sync rules

---

## 🛠️ Creating Your Own Skills

Want to create your own AI skills? Check out our comprehensive guide:

**[→ Skills Development Guide](./resources/skills-development.md)**

Topics covered:
- ✅ Zero-Config Design Principles
- ✅ Skill structure and conventions
- ✅ Tri-platform synchronization (Copilot ↔ Claude ↔ Codex)
- ✅ README requirements
- ✅ Versioning guidelines
- ✅ Platform-specific adaptations (triggers, invocation methods)
- ✅ Testing & validation

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Create new skills** following the [Skills Development Guide](./resources/skills-development.md)
2. **Improve existing skills** with better detection, examples, or documentation
3. **Report issues** if you find bugs or have feature requests
4. **Share feedback** on how you're using these skills

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) for details.

You're free to:
- ✅ Use these skills commercially
- ✅ Modify and distribute
- ✅ Create derivative works

Attribution appreciated but not required.

---

## 🌟 Why Use Global Skills?

### Traditional Approach
```
project-A/.github/skills/  ← skill duplicated
project-B/.github/skills/  ← skill duplicated
project-C/.github/skills/  ← skill duplicated
```

**Problems:**
- Skills duplicated across projects
- Updates require changing every project
- Inconsistent skill versions

### Global Skills Approach
```
~/.copilot/config.json  →  points to  →  claude-superskills/
All projects share the same skill library
```

**Benefits:**
- ✅ Single source of truth
- ✅ Update once, affects all projects
- ✅ Skills work everywhere (not project-specific)

---

## ❓ FAQ for Beginners

**Q: Do I need to know how to code?**  
A: Not necessarily. The tools (Copilot/Claude) help with code, but you can use skills just to optimize prompts or summarize videos.

**Q: Is it free?**  
A: The **skills are free**. However, you need access to GitHub Copilot (paid) or Claude Code (has free tier).

**Q: Does it work on Windows/Mac/Linux?**  
A: Yes! Skills work on any operating system that supports the underlying tools.

**Q: Do I need to install skills for each project?**  
A: No. Skills are **global** - install once and they work across all your projects.

**Q: Can I create my own skills?**  
A: Absolutely! Check our [Skills Development Guide](./resources/skills-development.md) or use the `skill-creator` skill to automate the process.

---

## 🔗 Official References

### Tools
- **GitHub Copilot CLI**: [Official Documentation](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- **GitHub Copilot Pricing**: [github.com/features/copilot/plans](https://github.com/features/copilot/plans)
- **Claude Code**: [claude.ai/code](https://claude.ai/code)
- **Anthropic Documentation**: [docs.anthropic.com](https://docs.anthropic.com)

### Skills & Agent Development
- **Agent Skills Standard**: [agentskills.io](https://agentskills.io)
- **Anthropic Prompt Engineering**: [docs.anthropic.com/prompt-engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- **Prompt Engineering Guide**: [promptingguide.ai](https://www.promptingguide.ai)
- **GitHub Copilot Agent Skills**: [docs.github.com/copilot/concepts/agents](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)

---

## 🙏 Acknowledgments

Inspired by:
- **[PromptCowboy](https://promptcowboy.com/)** - For framework-driven prompt optimization
- **[Anthropic's Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)**
- **The AI CLI community** for sharing best practices

**External Dependencies:**

Skills in this repository use the following open-source projects:

- **[youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api)** by [Julien Depoix](https://github.com/jdepoix) - Python library for YouTube transcript extraction (used by `youtube-summarizer`)
- **[faster-whisper](https://github.com/SYSTRAN/faster-whisper)** by [SYSTRAN](https://github.com/SYSTRAN) - Fast, accurate speech recognition engine (used by `audio-transcriber`)
- **[openai-whisper](https://github.com/openai/whisper)** by [OpenAI](https://github.com/openai) - Robust speech recognition model (alternative for `audio-transcriber`)
- **[ffmpeg](https://ffmpeg.org/)** - Multimedia framework for audio/video processing (used by `audio-transcriber`)

---

**Built with ❤️ by [Eric Andrade](https://github.com/eric.andrade)**

*Version 1.4.0 | Last updated: February 3, 2026*
