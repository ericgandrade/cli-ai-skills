# 🧠 Codex Skills Catalog

This directory contains **OpenAI Codex CLI/App** compatible AI skills. These skills provide specialized capabilities to Codex users through the `@skill-name` invocation pattern.

## 📋 Available Skills (4)

### 1. **prompt-engineer** (v1.0.2)
**Description:** Transforms user prompts into optimized prompts using frameworks (RTF, RISEN, Chain of Thought, RODES, Chain of Density, RACE, RISE, STAR, SOAP, CLEAR, GROW)

**Use Case:** When you have a raw idea but need a structured, well-crafted prompt

**Invocation:**
```bash
codex> @prompt-engineer optimize: create REST API
codex> @prompt-engineer refine: help me debug Python code
```

**Frameworks:** 11 established prompting frameworks (RTF, RISEN, CoT, RODES, etc.)

---

### 2. **skill-creator** (v1.1.1)
**Description:** Meta-skill for creating new Codex-compatible skills with interactive brainstorming and validation

**Use Case:** When you want to build custom skills for your workflow

**Invocation:**
```bash
codex> @skill-creator create skill for code review
codex> @skill-creator new: API testing workflow
```

**Features:**
- Interactive brainstorming
- SKILL.md generation
- Automatic validation (YAML + content)
- Dual/tri-platform support

---

### 3. **youtube-summarizer** (v1.1.1)
**Description:** Extract transcripts and generate comprehensive summaries from YouTube videos

**Use Case:** When you need to analyze YouTube video content without watching

**Invocation:**
```bash
codex> @youtube-summarizer https://youtube.com/watch?v=VIDEO_ID
codex> @youtube-summarizer summarize: [URL] detailed analysis
```

**Features:**
- Automatic transcript extraction (pytube)
- Multi-format summaries (brief, detailed, technical)
- Timestamp preservation
- LLM-powered analysis

**Requirements:** Python 3.8+, pytube

---

### 4. **audio-transcriber** (v1.1.1)
**Description:** Transcribe audio files to text using OpenAI Whisper API with intelligent LLM post-processing

**Use Case:** When you need accurate transcription + intelligent summarization

**Invocation:**
```bash
codex> @audio-transcriber /path/to/audio.mp3
codex> @audio-transcriber file.wav summarize key points
```

**Features:**
- Whisper API integration (99%+ accuracy)
- Automatic prompt enhancement (via prompt-engineer)
- Smart format suggestions (summary, meeting notes, article, etc.)
- Progress indicators

**Requirements:** Python 3.8+, OpenAI API key, openai package

---

## 🚀 Installation

### Option 1: Codex Skill Installer
```bash
$skill-installer install github:avanade/cli-ai-skills
```

### Option 2: NPM (Symlinks)
```bash
npx cli-ai-skills
# Select "Codex" from detected platforms
```

### Option 3: Manual
```bash
git clone https://github.com/avanade/cli-ai-skills.git
cd cli-ai-skills
ln -s "$(pwd)/.codex/skills/prompt-engineer" ~/.codex/skills/
ln -s "$(pwd)/.codex/skills/skill-creator" ~/.codex/skills/
ln -s "$(pwd)/.codex/skills/youtube-summarizer" ~/.codex/skills/
ln -s "$(pwd)/.codex/skills/audio-transcriber" ~/.codex/skills/
```

---

## 💡 Usage Pattern

### Manual Invocation (Required for Codex)
Codex does NOT support automatic triggers. You must invoke skills explicitly:

```bash
codex> @skill-name your prompt here
```

### Examples:
```bash
# Prompt engineering
codex> @prompt-engineer improve: write Python API

# Skill creation
codex> @skill-creator new skill for database migrations

# YouTube analysis
codex> @youtube-summarizer https://youtube.com/watch?v=abc123

# Audio transcription
codex> @audio-transcriber meeting-recording.m4a summarize action items
```

---

## 🔧 Requirements

### Core Requirements (All Skills)
- **Codex CLI or Codex App Desktop** (v1.0.0+)
- **Git** (for cloning repository)

### Python Skills (youtube-summarizer, audio-transcriber)
- **Python 3.8+**
- **pip** or **pip3**
- Skill-specific packages (installed via `pip install -r requirements.txt`)

### API Keys
- **audio-transcriber:** Requires `OPENAI_API_KEY` environment variable

---

## 📂 Skill Structure

Each skill directory contains:
```
skill-name/
├── SKILL.md           # Core specification (Codex reads this)
├── README.md          # User-facing documentation
├── requirements.txt   # Python dependencies (if applicable)
├── scripts/           # Executable utilities (if applicable)
└── examples/          # Usage examples (optional)
```

---

## 🆚 Platform Differences

| Feature | GitHub Copilot | Claude Code | OpenAI Codex |
|---------|---------------|-------------|--------------|
| **Triggers** | ✅ Auto | ✅ Auto | ❌ Manual `@skill-name` |
| **Installation** | gh extension | NPM/manual | `$skill-installer` or manual |
| **Invocation** | `copilot> trigger` | `claude> trigger` | `codex> @skill-name` |
| **YAML `triggers:`** | ✅ Present | ✅ Present | ❌ Removed |
| **Workflows** | ✅ 100% Identical | ✅ 100% Identical | ✅ 100% Identical |

**Key Insight:** Workflows are **100% identical** across platforms. Only invocation methods differ.

---

## 📖 Documentation

- **Main README:** [../../README.md](../../README.md)
- **VERSIONING:** [../../VERSIONING.md](../../VERSIONING.md)
- **CHANGELOG:** [../../CHANGELOG.md](../../CHANGELOG.md)
- **Skills Development:** [../../resources/skills-development.md](../../resources/skills-development.md)

---

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for:
- Creating new skills
- Platform synchronization rules
- Validation requirements
- Commit conventions

---

## 📜 License

MIT License - See [LICENSE](../../LICENSE)

---

**Built with ❤️ by Eric Andrade**

Version 1.4.0 | Last updated: February 2026
