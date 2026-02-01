#!/bin/bash

SKILL_NAME=$1

if [ -z "$SKILL_NAME" ]; then
    echo "Usage: ./create-skill.sh <skill-name>"
    echo ""
    echo "Example:"
    echo "  ./create-skill.sh prompt-optimizer"
    echo ""
    exit 1
fi

echo "🎯 Creating skill: $SKILL_NAME"
echo ""

# Detect tools
COPILOT_INSTALLED=false
CLAUDE_INSTALLED=false

if command -v gh &> /dev/null && gh copilot --version &> /dev/null 2>&1; then
    COPILOT_INSTALLED=true
fi

if command -v claude &> /dev/null; then
    CLAUDE_INSTALLED=true
fi

# Determine where to create
if [ "$COPILOT_INSTALLED" = true ]; then
    echo "✅ Creating for GitHub Copilot..."
    mkdir -p ".github/skills/$SKILL_NAME"
    cat > ".github/skills/$SKILL_NAME/SKILL.md" << 'SKILLEOF'
---
name: SKILLNAME
description: Use when user asks to "[trigger 1]", "[trigger 2]". [What the skill does].
triggers:
  - trigger phrase 1
  - trigger phrase 2
version: 1.0.0
---

## Purpose

[Detailed explanation of what this skill does and why it exists]

## When to Use

- [Specific scenario 1]
- [Specific scenario 2]
- [Specific scenario 3]

## Workflow

### Step 0: Discovery (if needed)

[Discovery logic for resources/configuration - remove if not needed]

### Step 1: [Main Action Name]

[Detailed instructions for this step]

**Input:**
- [What this step receives]

**Process:**
- [What to do step-by-step]

**Output:**
- [What this step produces]

### Step 2: [Next Action Name]

[Continue workflow...]

## Critical Rules

**NEVER:**
- ❌ Hardcode paths or values
- ❌ Assume folder structure exists
- ❌ Write code examples in languages other than English
- ❌ [Skill-specific anti-pattern]

**ALWAYS:**
- ✅ Discover resources at runtime
- ✅ Ask user when ambiguous
- ✅ Write all code/prompts in English
- ✅ [Skill-specific best practice]

## Example Usage

**Example 1: [Scenario Name]**

Input:
```
copilot> [example user command]
```

Output:
```
[Expected result in English]
```

**Example 2: [Another Scenario]**

[Add 2-4 more examples]
SKILLEOF
    
    # Replace placeholder with actual skill name
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/SKILLNAME/$SKILL_NAME/g" ".github/skills/$SKILL_NAME/SKILL.md"
    else
        sed -i "s/SKILLNAME/$SKILL_NAME/g" ".github/skills/$SKILL_NAME/SKILL.md"
    fi
    
    echo "   Created: .github/skills/$SKILL_NAME/SKILL.md"
fi

if [ "$CLAUDE_INSTALLED" = true ]; then
    echo "✅ Creating for Claude Code..."
    mkdir -p ".claude/skills/$SKILL_NAME"
    cat > ".claude/skills/$SKILL_NAME/SKILL.md" << 'SKILLEOF'
---
name: SKILLNAME
description: Use when user asks to "[trigger 1]", "[trigger 2]". [What the skill does].
triggers:
  - trigger phrase 1
  - trigger phrase 2
version: 1.0.0
---

## Purpose

[Detailed explanation of what this skill does and why it exists]

## When to Use

- [Specific scenario 1]
- [Specific scenario 2]
- [Specific scenario 3]

## Workflow

### Step 0: Discovery (if needed)

[Discovery logic for resources/configuration - remove if not needed]

### Step 1: [Main Action Name]

[Detailed instructions for this step]

**Input:**
- [What this step receives]

**Process:**
- [What to do step-by-step]

**Output:**
- [What this step produces]

### Step 2: [Next Action Name]

[Continue workflow...]

## Critical Rules

**NEVER:**
- ❌ Hardcode paths or values
- ❌ Assume folder structure exists
- ❌ Write code examples in languages other than English
- ❌ [Skill-specific anti-pattern]

**ALWAYS:**
- ✅ Discover resources at runtime
- ✅ Ask user when ambiguous
- ✅ Write all code/prompts in English
- ✅ [Skill-specific best practice]

## Example Usage

**Example 1: [Scenario Name]**

Input:
```
claude> [example user command]
```

Output:
```
[Expected result in English]
```

**Example 2: [Another Scenario]**

[Add 2-4 more examples]
SKILLEOF
    
    # Replace placeholder with actual skill name
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/SKILLNAME/$SKILL_NAME/g" ".claude/skills/$SKILL_NAME/SKILL.md"
    else
        sed -i "s/SKILLNAME/$SKILL_NAME/g" ".claude/skills/$SKILL_NAME/SKILL.md"
    fi
    
    echo "   Created: .claude/skills/$SKILL_NAME/SKILL.md"
fi

if [ "$COPILOT_INSTALLED" = false ] && [ "$CLAUDE_INSTALLED" = false ]; then
    echo "❌ No AI CLI tools detected."
    echo ""
    echo "Install at least one tool:"
    echo "  • GitHub Copilot CLI: gh extension install github/gh-copilot"
    echo "  • Claude Code: https://claude.ai/code"
    echo ""
    exit 1
fi

echo ""
echo "✅ Skill '$SKILL_NAME' created successfully!"
echo ""
echo "Next steps:"
echo "  1. Edit SKILL.md file(s) with your skill logic"
echo "  2. Replace placeholders: [description], [triggers], [workflow]"
echo "  3. Add README.md for user documentation"
echo "  4. Test the skill:"
if [ "$COPILOT_INSTALLED" = true ]; then
    echo "     copilot> list skills"
fi
if [ "$CLAUDE_INSTALLED" = true ]; then
    echo "     claude> list skills"
fi
echo ""
