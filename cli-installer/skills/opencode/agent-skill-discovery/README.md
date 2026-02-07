# agent-skill-discovery

Scans and lists all installed plugins, agents, skills, and MCP servers across any AI CLI platform.

## Overview

`agent-skill-discovery` is a platform-agnostic skill that provides a comprehensive inventory of all resources available in your AI CLI environment. It automatically detects whether you're using Claude Code, GitHub Copilot CLI, Gemini CLI, OpenCode, or OpenAI Codex, and generates a structured catalog of everything installed.

## Features

- **🌐 Platform-Agnostic** - Works identically on all 5 AI CLI platforms
- **🔍 Comprehensive Discovery** - Finds plugins, agents, skills, and MCP servers
- **📊 Structured Output** - Clean markdown catalog with resource counts
- **🔧 Zero-Config** - No setup required, discovers paths dynamically
- **🎯 Optional Filtering** - Filter by type, category, or keyword
- **⚡ Fresh Scans** - Always up-to-date, no stale cache

## When to Use

Use this skill when you want to:
- See what resources are installed on your system
- Discover new plugins or skills after installation
- Verify that a skill or plugin installed correctly
- Find MCP servers and their available tools
- Audit available capabilities before planning tasks
- Debug missing resources or tools

## Installation

### Via NPM (Recommended)

```bash
npm install -g cli-ai-skills
cli-ai-skills install agent-skill-discovery
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cli-ai-skills.git
cd cli-ai-skills

# Run build script to sync to all platforms
./scripts/build-skills.sh
```

## Usage

Simply ask your AI CLI to list your resources:

### Claude Code
```bash
claude
> "What do I have installed?"
> "List my MCP servers"
> "Show skills related to development"
```

### GitHub Copilot CLI
```bash
gh copilot
> "What do I have installed?"
> "Show available resources"
> "List only plugins"
```

### Gemini CLI / OpenCode / Codex
```bash
gemini  # or: opencode, codex
> "What do I have installed?"
> "Discover plugins"
```

## Example Output

```markdown
# 📦 Installed Resources

**Platform:** Claude Code
**Scan Date:** 2026-02-07 14:32:15

---

## 🔌 Plugins (3)
- feature-dev (3 agents)
- commit-commands (3 agents)
- plugin-dev (5 agents)

## 🛠️ Skills (8)
- agent-skill-discovery
- skill-creator
- prompt-engineer
- audio-transcriber
- youtube-summarizer
(... 3 more)

## 🌐 MCP Servers (2)
- claude_ai_Notion (5 tools)
- plugin_playwright (15 tools)

## 📊 Summary
- Total Plugins: 3
- Total Agents: 11
- Total Skills: 8
- Total MCP Servers: 2
- Total MCP Tools: 20
```

## Filtering

### By Resource Type

```bash
> "List only plugins"
> "Show MCP servers"
> "Display my skills"
```

### By Category

```bash
> "Show development skills"
> "List content tools"
```

### By Keyword

```bash
> "Find resources related to Notion"
> "Show tools for audio processing"
```

## Platform Support

| Platform | Status | Tested |
|----------|--------|--------|
| Claude Code | ✅ Supported | Yes |
| GitHub Copilot CLI | ✅ Supported | Yes |
| Gemini CLI | ✅ Supported | Yes |
| OpenCode | ✅ Supported | Yes |
| OpenAI Codex | ✅ Supported | Yes |

## How It Works

1. **Platform Detection** - Automatically identifies which AI CLI is running
2. **Resource Scanning** - Uses Glob to find plugin.json and SKILL.md files
3. **MCP Discovery** - Reads .mcp.json and uses ToolSearch to find MCP tools
4. **Data Parsing** - Extracts metadata from JSON/YAML frontmatter
5. **Catalog Generation** - Presents results in structured markdown

## What Gets Discovered

### Plugins
- Plugin name and version
- Plugin description
- All agents within the plugin
- Tools available to each agent

### Skills
- Skill name and version
- Skill description
- Trigger phrases
- Category and tags

### MCP Servers
- Server name and type (stdio, SSE, HTTP)
- Connection status
- Available tools with descriptions
- Command and arguments

## Troubleshooting

### "No resources found"

**Possible causes:**
- Skills/plugins not installed yet
- Running in wrong directory
- Platform directories don't exist

**Solutions:**
```bash
# Install some skills first
cli-ai-skills install --all

# Verify platform directory exists
ls -la ~/.claude  # or ~/.github, ~/.gemini, etc.

# Run skill again
> "What do I have installed?"
```

### "MCP servers not discovered"

**Possible causes:**
- No .mcp.json file configured
- MCP servers not running
- Invalid JSON in .mcp.json

**Solutions:**
```bash
# Check if MCP config exists
cat ~/.claude/.mcp.json

# Validate JSON syntax
jq . ~/.claude/.mcp.json

# Restart MCP servers if needed
```

### "Platform detection failed"

**Possible causes:**
- Skill not installed in platform directory
- Multiple platforms installed

**Solution:**
```bash
# Reinstall skill
cli-ai-skills install agent-skill-discovery --force

# Check installation
ls ~/.claude/skills/agent-skill-discovery
ls ~/.github/skills/agent-skill-discovery
```

## Related Skills

- **agent-skill-orchestrator** - Creates execution plans using discovered resources
- **skill-creator** - Creates new skills that appear in discovery results
- **plugin-dev:create-plugin** - Creates plugins that appear in discovery results

## Technical Details

- **Language:** Platform-agnostic (works in any shell)
- **Dependencies:** None (uses built-in Glob, Read, ToolSearch)
- **Performance:** ~1-3 seconds for typical installations
- **Memory:** Minimal (streams results, no large buffers)

## Contributing

Found a bug or want to improve discovery?

1. Open an issue: [GitHub Issues](https://github.com/yourusername/cli-ai-skills/issues)
2. Submit a PR: [Contributing Guide](../../docs/CONTRIBUTING.md)
3. Check validation: `./scripts/validate-skill-yaml.sh skills/agent-skill-discovery`

## License

MIT License - See [LICENSE](../../LICENSE) for details.

## Version History

### v1.0.0 (2026-02-07)
- Initial release
- Platform detection for 5 AI CLIs
- Plugin, skill, and MCP discovery
- Optional filtering by type/category/keyword
- Zero-config dynamic path discovery

## Support

- **Documentation:** [Full skill specification](SKILL.md)
- **Examples:** [references/examples.md](references/examples.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/cli-ai-skills/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/cli-ai-skills/discussions)
