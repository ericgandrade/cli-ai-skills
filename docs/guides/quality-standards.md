# 📋 Quality Standards for AI Skills

Best practices and standards for creating high-quality AI skills.

---

## 🎯 Overview

Quality skills are:
- **Well-documented** (1500-2000 words)
- **Properly structured** (follow skill anatomy)
- **Complete metadata** (category, tags, risk, platforms)
- **Thoroughly tested** (across all platforms)
- **Production-ready** (no experimental features)

---

## 📝 Documentation Requirements

### Word Count

- **Minimum:** 1500 words
- **Ideal:** 1500-2000 words
- **Maximum:** No limit (but keep focused)

### Structure

Every skill document must include:

1. **Purpose** (1-2 paragraphs)
   - What does this skill do?
   - What problem does it solve?

2. **When to Use** (5-10 bullet points)
   - Specific use cases
   - Example scenarios
   - User personas

3. **Workflow / How It Works** (3-5 steps)
   - Step-by-step process
   - Input/output examples
   - Key decision points

4. **Examples** (3-5 realistic scenarios)
   - Real-world use cases
   - Sample inputs
   - Expected outputs

5. **Best Practices** (5-8 tips)
   - Do's and don'ts
   - Common mistakes
   - Optimization tips

6. **Limitations** (honest assessment)
   - What it can't do
   - Platform-specific constraints
   - Performance considerations

7. **Advanced Usage** (optional)
   - Power user features
   - Customization options
   - Integration possibilities

---

## 🏷️ Metadata Requirements

### Required Fields

```yaml
---
name: skill-name
description: "Clear, 2-3 sentence description"
version: 1.0.0
category: meta|content|automation|analysis|development
tags: [tag1, tag2, tag3, tag4, tag5]
risk: none|safe|moderate|critical
platforms: [github-copilot-cli, claude-code, codex]
---
```

### Category Values

- **meta** - Tools for creating tools
- **content** - Content processing (video, audio, text)
- **automation** - Task automation
- **analysis** - Code/data analysis
- **development** - Development utilities

### Risk Assessment

- **none** - No external calls, pure prompt
- **safe** - Read-only operations
- **moderate** - Modifies files, external API calls
- **critical** - Destructive operations (delete, deploy)

### Tags

- 3-5 keywords minimum
- Lowercase, hyphen-separated
- Searchable and relevant
- Examples: `prompt-engineering`, `video-summarization`, `automation`

---

## ✅ Validation Checklist

Before submitting a skill, verify:

### YAML Frontmatter
- [ ] Valid YAML syntax
- [ ] All required fields present
- [ ] Version follows SemVer (X.Y.Z)
- [ ] Category is valid value
- [ ] Tags array has 3-5 items
- [ ] Risk level is realistic
- [ ] Platforms array has all supported

### Documentation
- [ ] Purpose section is 1-2 paragraphs
- [ ] When to Use has 5+ specific scenarios
- [ ] Workflow has 3-5 clear steps
- [ ] Examples have 3-5 realistic cases
- [ ] Best Practices has 5+ tips
- [ ] Limitations are honest
- [ ] Word count is 1500-2000
- [ ] No spelling or grammar errors
- [ ] Links are working

### Triggers
- [ ] 3-5 trigger phrases defined
- [ ] Triggers use natural language
- [ ] Triggers cover different phrasings
- [ ] Works in multiple languages if applicable

### Functionality
- [ ] Tested on all 3 platforms
- [ ] No hardcoded paths
- [ ] Works from any directory
- [ ] Clear error messages
- [ ] Proper exit codes

---

## 📏 Writing Style Guide

### Tone & Voice

- **Imperative** for instructions: "Use this when..."
- **Third-person** for descriptions: "This skill does..."
- **Active voice**: "Summarizes videos" not "Videos are summarized"
- **Friendly & professional**: Balance confidence with clarity

### Formatting

- Use **bold** for emphasis
- Use `code` for technical terms
- Use > for blockquotes (tips/notes)
- Use numbered lists for sequences
- Use bullet lists for options

### Examples

```markdown
## When to Use

Use this skill when:
- You need to extract insights from long videos
- You want automated meeting summaries
- You prefer reading over watching
```

### Code Blocks

````markdown
```bash
npx claude-superskills --search "video"
```
````

---

## 🧪 Testing Requirements

### Platform Testing

Test on all 3 platforms:
- [ ] GitHub Copilot CLI
- [ ] Claude Code
- [ ] OpenAI Codex

### Feature Testing

- [ ] All triggers work
- [ ] Inputs are validated
- [ ] Outputs are formatted correctly
- [ ] Errors are handled gracefully
- [ ] Performance is acceptable

### Edge Cases

- [ ] Empty input handling
- [ ] Invalid input handling
- [ ] Large input handling
- [ ] Special character handling
- [ ] Different OS behavior (Mac/Linux/Windows)

---

## 🔄 Version Management

### Semantic Versioning

```
MAJOR.MINOR.PATCH
1.0.0 = MAJOR=1, MINOR=0, PATCH=0
```

### When to Bump

| Change | Bump | Example |
|--------|------|---------|
| New feature | MINOR | 1.0.0 → 1.1.0 |
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| Add metadata | MINOR | 1.0.0 → 1.1.0 |
| Breaking change | MAJOR | 1.0.0 → 2.0.0 |

### Version Sync

**CRITICAL:** Version must be identical across all platforms:

```
.github/skills/my-skill/SKILL.md  → version: 1.2.0
.claude/skills/my-skill/SKILL.md  → version: 1.2.0
.codex/skills/my-skill/SKILL.md   → version: 1.2.0
```

Verify with:
```bash
./scripts/verify-version-sync.sh
```

---

## 📊 Quality Metrics

### Coverage

- [ ] Documentation complete
- [ ] All platforms supported
- [ ] Examples cover main use cases
- [ ] Error scenarios documented

### Functionality

- [ ] No hardcoded values
- [ ] Graceful error handling
- [ ] Input validation
- [ ] Clear user feedback

### Maintainability

- [ ] Well-commented code
- [ ] Consistent style
- [ ] No duplicate logic
- [ ] Clear dependencies

---

## 🎓 Example: High-Quality Skill

Here's a skill that meets all standards:

```yaml
---
name: my-awesome-skill
description: "Transforms and optimizes data structures for performance. Analyzes input, suggests improvements, and generates optimized versions."
version: 1.2.0
category: automation
tags: [optimization, performance, data-structures, automation]
risk: safe
platforms: [github-copilot-cli, claude-code, codex]
triggers:
  - "optimize this code"
  - "improve performance"
  - "analyze data structures"
---

## Purpose

This skill analyzes code structures and suggests performance optimizations...

## When to Use

- When you want to optimize loops
- When you need to improve data structure efficiency
- When you want to reduce memory usage
- When analyzing performance bottlenecks

## Workflow

1. **Analysis** - Examines code structure
2. **Profiling** - Identifies bottlenecks
3. **Suggestions** - Recommends optimizations
4. **Implementation** - Generates optimized version
5. **Benchmarking** - Compares performance

...etc
```

---

## 🚀 Deployment Checklist

Before publishing:

- [ ] All validation passes
- [ ] Version bumped correctly
- [ ] Metadata complete
- [ ] Documentation complete (1500+ words)
- [ ] Tested on all platforms
- [ ] No hardcoded paths
- [ ] Error handling solid
- [ ] Examples realistic
- [ ] No grammar errors
- [ ] Links working
- [ ] Version sync verified
- [ ] Git tag created

---

## 📚 References

- **[Skill Anatomy Guide](skill-anatomy.md)** - Technical structure
- **[Getting Started Guide](getting-started.md)** - User perspective
- **[Skills Development](../references/skills-development.md)** - Advanced creation
- **[Contributing Guidelines](../../CONTRIBUTING.md)** - Project rules

---

**Questions? Check [CONTRIBUTING.md](../../CONTRIBUTING.md) or open an issue!**
