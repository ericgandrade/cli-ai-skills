# Skill Anatomy: Understanding the Structure

This guide explains how skills are structured, what makes a quality skill, and how all the pieces fit together.

## 📋 What is a Skill?

A **skill** is a self-contained module that extends the capabilities of AI coding assistants. Each skill:

- Works across **multiple platforms** (GitHub Copilot CLI, Claude Code, Codex)
- Has **clear documentation** explaining its purpose and usage
- Follows **structured metadata** for discovery and categorization
- Maintains **semantic versioning** for reliable updates
- Is **backward compatible** with previous versions

---

## 🏗️ Skill File Structure

Each skill lives in a platform-specific directory:

```
.github/skills/skill-creator/
  ├── SKILL.md           ← Main skill definition
  └── [other files]      ← Platform-specific implementations
```

**Replicated across:**
- `.github/skills/` (GitHub Copilot CLI)
- `.claude/skills/` (Claude Code)
- `.codex/skills/` (OpenAI Codex)

---

## 📄 SKILL.md File Format

### 1. YAML Frontmatter (Required)

Every SKILL.md file starts with YAML metadata:

```yaml
---
name: skill-creator
description: "This skill should be used when creating new skills, building a skill, 
  making a custom skill, developing a CLI skill, or wants to extend the CLI with 
  new capabilities. Automates the entire skill creation workflow from brainstorming 
  to installation."
triggers: ["create a new skill", "build a skill", "make a custom skill", "develop a CLI skill"]
version: 1.3.0
category: meta
tags: ["automation", "scaffolding", "skill-creation", "meta-skill"]
risk: safe
platforms: ["github-copilot-cli", "claude-code", "codex"]
---
```

### 2. Metadata Fields

#### **Required Fields**

| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| `name` | string | `skill-creator` | Unique identifier for the skill |
| `description` | string | "This skill should be used when..." | What the skill does (2-3 sentences) |
| `triggers` | array | `["create a new skill"]` | Keywords/phrases that invoke the skill |
| `version` | string | `1.3.0` | Semantic version (MAJOR.MINOR.PATCH) |
| `category` | string | `meta` | Skill category (see categories below) |
| `tags` | array | `["automation", "scaffolding"]` | Keywords for search/discovery |
| `risk` | string | `safe` | Safety level (see risk levels below) |
| `platforms` | array | `["github-copilot-cli"]` | Supported platforms |

#### **Category Values**

Skills are organized into categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| `meta` | Tools for creating tools | skill-creator |
| `content` | Content processing | youtube-summarizer, audio-transcriber |
| `automation` | Task automation | prompt-engineer, workflow builders |
| `analysis` | Code/data analysis | linters, analyzers |
| `development` | Development utilities | testing, deployment tools |

#### **Risk Levels**

Indicates what the skill might do:

| Risk | Description | Examples |
|------|-------------|----------|
| `none` | No external calls or side effects | Pure prompt engineering |
| `safe` | Reads data only, no modifications | youtube-summarizer (reads video transcripts) |
| `moderate` | Makes external API calls or creates files | audio-transcriber (calls Whisper API) |
| `critical` | Modifies code, deploys, or deletes files | Deployment automation |

#### **Platforms**

Which AI assistants support this skill:

- `github-copilot-cli` - GitHub Copilot in CLI
- `claude-code` - Anthropic Claude in VS Code
- `codex` - OpenAI's Codex

Most skills support all three.

### 3. Markdown Content

After the frontmatter, the SKILL.md file contains comprehensive documentation:

#### **A. Purpose Section**

Explain what the skill does in one clear paragraph:

```markdown
## Purpose

This skill automates the entire workflow of creating new AI assistant skills 
from brainstorming through implementation to installation across three platforms 
(GitHub Copilot CLI, Claude Code, OpenAI Codex).
```

#### **B. When to Use**

List specific scenarios:

```markdown
## When to Use

Use this skill when:

- Building custom skills for your team or organization
- Creating specialized domain-specific assistants
- Extending CLI capabilities with new commands
- Setting up skill scaffolding for consistent structure
- You want zero-configuration skill creation
```

#### **C. Workflow / How It Works**

Step-by-step explanation:

```markdown
## Workflow

1. **Brainstorm** - Describe what your skill should do
2. **Validate** - Check naming conventions and structure
3. **Scaffold** - Auto-generate project structure
4. **Implement** - Write skill logic and documentation
5. **Test** - Run validation scripts
6. **Install** - Deploy to all three platforms
```

#### **D. Examples**

3-5 realistic scenarios with sample commands:

```markdown
## Examples

### Example 1: Create a Code Review Skill
```bash
npx cli-ai-skills skill-creator
# Follow prompts to create "code-reviewer"
```

### Example 2: Batch Create Multiple Skills
```
"Create skills for: Python linting, TypeScript validation, and Docker optimization"
```
```

#### **E. Best Practices**

Tips for effective usage:

```markdown
## Best Practices

1. **Use Specific Prompts** - "Create a skill for linting Python code" works better 
   than "make a new skill"
2. **Keep Skills Focused** - One responsibility per skill for better reusability
3. **Follow Naming** - Use kebab-case (my-skill, not MySkill)
4. **Version Carefully** - Follow semantic versioning
5. **Document Well** - Write comprehensive skill descriptions
```

#### **F. Limitations**

Be honest about constraints:

```markdown
## Limitations

- Requires Node.js v14+ for skill scaffolding
- Cannot auto-generate actual implementation logic
- Requires manual editing for customization
- No automatic testing of generated skills
```

#### **G. Advanced Usage**

Optional section for power users:

```markdown
## Advanced Usage

### Custom Templates
You can provide custom skill templates...

### Batch Operations
Use the `--batch` flag to create multiple skills from a JSON file...
```

---

## 🔍 Metadata Example (Full Skill Entry)

Here's what a complete skill definition looks like:

```yaml
---
name: youtube-summarizer
description: "Extract and summarize YouTube video content by providing a video URL. 
  Generates comprehensive, detailed summaries from video transcripts."
triggers: 
  - "summarize a youtube video"
  - "extract video transcript"
  - "create youtube summary"
version: 1.2.0
category: content
tags: ["video", "summarization", "transcription", "youtube", "content-analysis"]
risk: safe
platforms: ["github-copilot-cli", "claude-code", "codex"]
---

## Purpose

Quickly extract insights from YouTube videos without watching them. This skill 
transcribes video audio and generates concise summaries with key takeaways.

## When to Use

- Research video content efficiently
- Extract meeting/webinar key points
- Create show notes for podcasts/videos
- Archive and reference video content
- Generate transcripts for accessibility

## Workflow

1. Provide YouTube video URL
2. Skill downloads transcript
3. Extracts key sections
4. Generates formatted summary
5. Returns results in Markdown

## Examples

### Example 1: Summarize a Tech Talk
Input: https://youtube.com/watch?v=xyz123
Output: Structured summary with timestamps and key points

...more examples...

## Limitations

- Requires videos with available transcripts
- Transcripts auto-generated (may have errors)
- Long videos (3+ hours) may take time
```

---

## 🔄 Version Management

### Semantic Versioning (SemVer)

Skills follow **MAJOR.MINOR.PATCH** versioning:

```
1.3.0
│ │ │
│ │ └─ PATCH: Bug fixes, typos
│ └─── MINOR: New features, metadata
└───── MAJOR: Breaking changes
```

### When to Bump Versions

| Scenario | Bump | Example |
|----------|------|---------|
| Bug fix in logic | PATCH | 1.3.0 → 1.3.1 |
| Add metadata/tags | MINOR | 1.3.0 → 1.4.0 |
| Breaking API change | MAJOR | 1.3.0 → 2.0.0 |

### Version Synchronization

**CRITICAL:** Each skill must have the same version across all three platforms:

```bash
# Must all be 1.3.0:
.github/skills/skill-creator/SKILL.md       → version: 1.3.0
.claude/skills/skill-creator/SKILL.md       → version: 1.3.0
.codex/skills/skill-creator/SKILL.md        → version: 1.3.0
```

Run verification script:
```bash
./scripts/verify-version-sync.sh
```

---

## 📦 Discovery & Search

Skills are discoverable through:

### 1. skills_index.json
Auto-generated JSON file with all skill metadata:

```json
{
  "version": "1.0.0",
  "generated": "2026-02-04T10:30:00Z",
  "skills": [
    {
      "name": "skill-creator",
      "version": "1.3.0",
      "description": "...",
      "category": "meta",
      "tags": ["automation", "scaffolding"],
      "risk": "safe",
      "platforms": ["github-copilot-cli", "claude-code", "codex"]
    }
  ]
}
```

### 2. CATALOG.md
Human-readable catalog of all skills (auto-generated from skills_index.json)

### 3. CLI Search
```bash
npx cli-ai-skills --search "video"
npx cli-ai-skills --search "automation"
```

---

## ✅ Quality Checklist

Before publishing a skill, verify:

- [ ] YAML frontmatter is valid (test with `jq`)
- [ ] All required metadata fields present
- [ ] `version` matches across .github, .claude, .codex
- [ ] `description` is 2-3 clear sentences
- [ ] `triggers` array has 3-5 useful keywords
- [ ] `category` is from allowed list
- [ ] `tags` array has 3-5 relevant tags
- [ ] `risk` level is accurate
- [ ] Markdown sections follow structure
- [ ] Examples are realistic and runnable
- [ ] No typos or formatting errors
- [ ] Links are working
- [ ] Word count is 1500-2000 words

For detailed checklist, see [Quality Standards](quality-standards.md).

---

## 🔗 Related Documentation

- **[Quality Standards](quality-standards.md)** - How to write excellent skills
- **[Getting Started](getting-started.md)** - First-time user guide
- **[Main Catalog](../../CATALOG.md)** - Browse all skills
- **[Contributing Guide](../../CONTRIBUTING.md)** - How to contribute new skills
- **[Skill Development](../references/skills-development.md)** - Advanced skill creation

---

**Ready to create your own skill? Check out [skill-creator](../../skills_index.json) or read [Skill Development](../references/skills-development.md)!**
