# Google Antigravity Skills

This directory contains AI skills for [Google Antigravity](https://antigravity.google), an AI-powered coding assistant.

## Installation

Antigravity supports **two installation modes**:

### Global Installation (Default - Recommended)

Skills installed globally work across **all workspaces**:

```bash
# Install to: ~/.gemini/antigravity/skills/
npx cli-ai-skills install --platform antigravity

# Or use short flags
npx cli-ai-skills i --platform antigravity
```

### Workspace Installation

Skills installed locally work only in the **current project**:

```bash
# Install to: .antigravity/skills/
npx cli-ai-skills install --platform antigravity --local

# Or use short flags
npx cli-ai-skills i --platform antigravity -l
```

## How It Works

### Auto-Discovery

Antigravity automatically discovers skills when you:
- Open a workspace (`antigravity .`)
- Start a chat session (`antigravity chat`)

**Global skills** (in `~/.gemini/antigravity/skills/`) are always available.
**Workspace skills** (in `.antigravity/skills/`) are only available in that project.

### Skill Structure

Each skill is a directory containing a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-skill
description: This skill should be used when...
version: 1.0.0
---

## Purpose
What the skill does...

## Workflow
Step-by-step instructions...
```

## Available Skills

This directory contains all 6 universal skills:

| Skill | Description | Version |
|-------|-------------|---------|
| **agent-skill-discovery** | Discover plugins, agents, skills, MCPs | 1.0.0 |
| **agent-skill-orchestrator** | Create execution plans using available resources | 1.0.0 |
| **audio-transcriber** | Transform audio into Markdown documentation | 1.2.0 |
| **prompt-engineer** | Optimize prompts using proven frameworks | 1.1.0 |
| **skill-creator** | Create new skills with scaffolding | 1.3.0 |
| **youtube-summarizer** | Extract and summarize YouTube videos | 1.2.0 |

## Usage Examples

### Using Skills in Antigravity

```bash
# Start chat session
antigravity chat

# Skills activate automatically based on context:
> improve this prompt: create REST API
# → prompt-engineer skill activates

> create a new skill for database migrations
# → skill-creator skill activates

> summarize this video: https://youtube.com/watch?v=...
# → youtube-summarizer skill activates
```

### Checking Installed Skills

```bash
# List skills
npx cli-ai-skills list --platform antigravity

# Check for updates
npx cli-ai-skills update --platform antigravity
```

## Documentation

- **Official Antigravity Docs**: https://antigravity.google/docs/skills
- **Skills Codelab**: https://codelabs.developers.google.com/getting-started-with-antigravity-skills
- **Community Skills**: https://github.com/rmyndharis/antigravity-skills

## Architecture Notes

### Paths (Both Valid)

According to [official documentation](https://antigravity.google/docs/skills):

- **Global**: `~/.gemini/antigravity/skills/` (all workspaces)
- **Workspace**: `.antigravity/skills/` **OR** `.agent/skills/` (project-specific)

This installer uses `.antigravity/skills/` for workspace installations (more consistent with platform naming).

### Platform Compatibility

These skills work identically across:
- ✅ GitHub Copilot CLI (`gh copilot`)
- ✅ Claude Code (`claude`)
- ✅ OpenAI Codex (`codex`)
- ✅ OpenCode (`opencode`)
- ✅ Gemini CLI (`gemini`)
- ✅ **Google Antigravity** (`antigravity`)

Only tool names and prompt prefixes differ - workflow logic is universal.

## Troubleshooting

### Skills Not Appearing

1. **Check installation path**:
   ```bash
   ls ~/.gemini/antigravity/skills/        # Global
   ls .antigravity/skills/                  # Workspace
   ```

2. **Restart Antigravity**:
   ```bash
   # Close any open sessions
   antigravity .
   ```

3. **Verify SKILL.md exists**:
   ```bash
   ls ~/.gemini/antigravity/skills/*/SKILL.md
   ```

### Permission Issues

```bash
# Fix permissions (if needed)
chmod -R 755 ~/.gemini/antigravity/skills/
```

## Contributing

Skills are maintained in the [cli-ai-skills](https://github.com/ericgandrade/cli-ai-skills) repository.

To contribute:
1. Create skill in `skills/` directory
2. Run `./scripts/build-skills.sh` to sync
3. Test with `antigravity chat`
4. Submit PR

---

**Last Updated**: 2026-02-11  
**Installer Version**: 1.10.0  
**Skills Count**: 6
