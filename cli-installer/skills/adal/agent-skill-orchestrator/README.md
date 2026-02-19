# agent-skill-orchestrator

Intelligent task planning and resource orchestration with confidence scoring and strategic execution plans.

## Overview

`agent-skill-orchestrator` is an AI-powered planning assistant that analyzes your task requirements, discovers available resources (plugins, agents, skills, MCP servers), performs intelligent matching with confidence scoring, and generates comprehensive execution plans with multiple options and fallback strategies.

Think of it as your strategic advisor—it tells you **how** to use **what** you have to accomplish **what** you want.

## Features

- **🧠 Intelligent Analysis** - Understands task type, complexity, and requirements
- **🔍 Fresh Discovery** - Always uses latest resource inventory via agent-skill-discovery
- **📊 Confidence Scoring** - Scores resources 0-100% with transparent reasoning
- **🎯 Strategic Planning** - Generates multiple execution options with alternatives
- **✅ Approval Required** - Never executes without explicit user consent
- **🌐 Platform-Agnostic** - Works on all 5 AI CLI platforms
- **🔄 Fallback Strategies** - Includes alternatives if primary plan fails

## When to Use

Use this skill when you:
- Have a complex task and want the best approach
- Need to coordinate multiple tools or services
- Want optimized resource utilization
- Are unsure which plugins/skills to use
- Need a strategic plan before implementation
- Want to explore multiple solution approaches

## Installation

### Via NPM (Recommended)

```bash
npm install -g claude-superskills
claude-superskills install agent-skill-orchestrator agent-skill-discovery
```

**Note:** `agent-skill-discovery` is a required dependency.

### Manual Installation

```bash
git clone https://github.com/yourusername/claude-superskills.git
cd claude-superskills
./scripts/build-skills.sh
```

## Usage

Ask your AI CLI to plan your task:

### Claude Code
```bash
claude
> "Plan how to build a REST API with authentication"
> "Help me design a solution for processing meeting notes"
> "What's the best way to create a code review workflow?"
```

### GitHub Copilot CLI
```bash
gh copilot
> "Orchestrate agents to analyze this bug"
> "Create execution plan for feature development"
```

### Gemini CLI / OpenCode / Codex
```bash
gemini  # or: opencode, codex
> "Plan how to solve: implement user authentication"
> "Design approach for data migration"
```

## How It Works

### 1. Discovery (Step 0)
Calls `agent-skill-discovery` to get fresh inventory of all resources

### 2. Analysis (Step 1)
Extracts requirements from your request:
- Task type (development, content, integration, etc.)
- Needed capabilities (code-gen, API calls, web scraping, etc.)
- External integrations (Notion, Jira, GitHub, etc.)

### 3. Intelligent Matching (Step 2)
Scores each resource against requirements using weighted algorithm:
- **30%** Trigger phrase matching
- **25%** Semantic similarity
- **20%** Tool availability
- **15%** Category relevance
- **10%** MCP integration bonus

Resources scoring **80-100%** = High confidence
Resources scoring **60-79%** = Medium confidence
Resources scoring **40-59%** = Low confidence
Resources scoring **< 40%** = Filtered out

### 4. Plan Generation (Step 3)
Creates strategic execution plan with:
- Primary strategy (recommended)
- Alternative strategy (backup approach)
- Prerequisites checklist
- Success criteria
- Risk assessment

### 5. Approval (Step 4)
Presents plan and requests explicit approval before execution

### 6. Execution (Step 5 - Optional)
Executes approved plan with progress reporting

## Example Output

```markdown
## 📊 Discovery Analysis

**Platform:** Claude Code
**Task Type:** development
**Complexity:** moderate
**External Integrations:** None

---

## 🔍 Resources Found (8)

### High Confidence (80-100%)
- **feature-dev:code-architect** [92%] - Designs feature architectures
  - **Why selected:** Best match for API design patterns
- **feature-dev:code-explorer** [88%] - Analyzes existing codebase
  - **Why selected:** Understands existing auth patterns

---

## ✅ Recommended Execution Plan

### Option 1: Primary Strategy (Recommended)

**Step 1:** Use **feature-dev:code-explorer** to analyze patterns
**Step 2:** Use **feature-dev:code-architect** to design API
**Step 3:** Use **skill-creator** to scaffold auth code
**Step 4:** Use **feature-dev:code-reviewer** to validate security

**Expected Outcome:** Secure REST API with JWT authentication
**Estimated Time:** ~45 minutes
**Risk Level:** Low

---

### Option 2: Alternative Strategy
(Faster 2-step approach for rapid prototyping)

---

## ⚠️ Prerequisites
- [ ] Plugin "feature-dev" must be installed
- [ ] Skill "skill-creator" must be installed

## 🎯 Success Criteria
- [ ] API endpoints functional
- [ ] JWT auth implemented
- [ ] Security review passes

---

**⏸️ Awaiting your approval to proceed...**
```

## Scoring Algorithm

Resources are scored using five weighted factors:

### 1. Trigger Phrase Matching (30%)
Matches user keywords against resource trigger phrases

### 2. Semantic Similarity (25%)
Compares description text with user request

### 3. Tool Availability (20%)
Checks if resource has tools needed for task

### 4. Category Relevance (15%)
Matches task category with resource category

### 5. MCP Integration Bonus (10%)
Bonus for MCPs when external integration needed

**Final Score:** Sum of weighted factors (0-100 scale)

## Platform Support

| Platform | Status | Tested |
|----------|--------|--------|
| Claude Code | ✅ Supported | Yes |
| GitHub Copilot CLI | ✅ Supported | Yes |
| Gemini CLI | ✅ Supported | Yes |
| OpenCode | ✅ Supported | Yes |
| OpenAI Codex | ✅ Supported | Yes |

## Dependencies

### Required
- **agent-skill-discovery** (v1.0.0+) - Must be installed first

### Recommended
- Various plugins/skills/MCPs depending on your tasks
- Install bundles: `claude-superskills install --all`

## Use Cases

### Software Development
- Feature planning and implementation
- Architecture design
- Code review workflows
- Bug investigation and fixing

### Content Processing
- Audio/video transcription
- Document conversion
- Summarization pipelines
- Multi-step transformations

### Integration & Automation
- API integrations
- Data synchronization
- Workflow automation
- Multi-service coordination

### Analysis & Research
- Codebase exploration
- Competitive analysis
- Documentation generation
- Knowledge synthesis

## Approval System

The orchestrator **NEVER executes without approval**. After presenting the plan, it asks:

```
Which execution plan would you like to proceed with?

[ ] Execute Option 1 (Recommended)
[ ] Execute Option 2 (Alternative)
[ ] Refine plan
[ ] Cancel
```

Choose your preferred option to proceed or cancel safely.

## Troubleshooting

### "No resources found"

**Cause:** No plugins/skills installed, or discovery failed

**Solution:**
```bash
# Install resources
claude-superskills install --all

# Verify installation
claude
> "What do I have installed?"
```

### "All scores below 40%"

**Cause:** No good match between request and available resources

**Solution:**
- Rephrase request with more specific keywords
- Install relevant plugins/skills for your task
- Try breaking task into smaller parts

### "agent-skill-discovery not found"

**Cause:** Missing required dependency

**Solution:**
```bash
claude-superskills install agent-skill-discovery
```

### "Plan looks wrong"

**Solution:**
- Select "Refine plan" option
- Provide more context in request
- Try Option 2 (alternative strategy)

## Tips for Best Results

### Be Specific
```
❌ "help me code"
✅ "plan how to build a REST API with JWT authentication"
```

### Mention Technologies
```
❌ "process some files"
✅ "transcribe audio files and create Notion pages"
```

### State Constraints
```
❌ "make a website"
✅ "design a React dashboard using Figma designs"
```

### Include Context
```
❌ "fix the bug"
✅ "investigate authentication error in login flow"
```

## Advanced Features

### Multiple Options
Always provides 2+ execution strategies when feasible

### Fallback Strategies
Includes alternatives if primary approach fails

### Confidence Transparency
Shows exact scores and reasoning for selections

### Prerequisites Detection
Automatically identifies required setup

### Success Criteria
Defines measurable outcomes for validation

## Performance

- **Discovery:** ~1-3 seconds
- **Scoring:** ~1-2 seconds
- **Plan Generation:** ~1 second
- **Total:** ~3-6 seconds for typical request

## Technical Details

- **Language:** Platform-agnostic (works in any shell)
- **Dependencies:** agent-skill-discovery (required)
- **Algorithm:** Weighted multi-factor scoring
- **Output:** Structured markdown
- **Execution:** Optional, requires approval

## Contributing

Improve the orchestrator:

1. Suggest scoring improvements
2. Add new use case examples
3. Report matching issues
4. Enhance plan generation logic

[Contributing Guide](../../docs/CONTRIBUTING.md)

## Related Skills

- **agent-skill-discovery** (Required) - Discovers resources
- **prompt-engineer** - May be recommended in plans
- **skill-creator** - May be recommended for scaffolding

## License

MIT License - See [LICENSE](../../LICENSE)

## Version History

### v1.0.0 (2026-02-07)
- Initial release
- Confidence scoring algorithm
- Multi-option plan generation
- Approval system
- Platform-agnostic support

## Support

- **Full Specification:** [SKILL.md](SKILL.md)
- **Scoring Details:** [references/scoring-algorithm.md](references/scoring-algorithm.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/claude-superskills/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/claude-superskills/discussions)
