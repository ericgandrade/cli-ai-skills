# Writing Style Requirements for Skills

Based on [Anthropic Official Guide](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/plugin-dev/skills/skill-development/SKILL.md)

## Naming Conventions

### Skill Names - ALWAYS Use kebab-case

**Format:** `lowercase-words-separated-by-hyphens`

✅ **Correct:**
```yaml
name: prompt-engineer
```
```yaml
name: skill-creator
```
```markdown
# prompt-engineer
```

❌ **Incorrect:**
```yaml
name: Prompt Engineer  # Title Case - WRONG
name: prompt_engineer  # snake_case - WRONG
name: promptEngineer   # camelCase - WRONG
```
```markdown
# Prompt Engineer  # Title Case in H1 - WRONG
```

**Rule:** The `name:` field and H1 heading MUST match the directory name exactly (kebab-case).

---

## Imperative/Infinitive Form

✅ **Correct:** To create a hook, define the event type.
❌ **Wrong:** You should create a hook by defining the event type.

Use verb-first instructions, NOT second person.

## Third-Person Descriptions

✅ **Correct:**
```yaml
description: This skill should be used when the user asks to "create X", "do Y"...
```

❌ **Wrong:**
```yaml
description: Use this skill when you want to...
```

## Word Count Targets

- **SKILL.md:** 1,500-2,000 words (ideal), <5,000 max
- **references/:** 2,000-5,000+ words (no limit)
- **README.md:** 300-500 words

## Progressive Disclosure

```
skill-name/
├── SKILL.md (core, 1.5-2k words)
├── references/ (detailed docs)
├── examples/ (working code)
└── scripts/ (utilities)
```

## Common Mistakes

### Mistake 1: Weak Triggers
❌ Bad: "Provides guidance for hooks"
✅ Good: "This skill should be used when the user asks to 'create hook', 'add PreToolUse'..."

### Mistake 2: Too Much in SKILL.md
❌ Bad: 8,000 words in SKILL.md
✅ Good: 1,800 words + references/patterns.md (2,500 words)

### Mistake 3: Second Person
❌ Bad: "You should start by..."
✅ Good: "To start, read the configuration..."

**Version:** 1.0.0  
**Source:** Anthropic Best Practices
