---
name: {{SKILL_NAME}}
description: This skill should be used when the user asks to "{{TRIGGER_1}}", "{{TRIGGER_2}}", "{{TRIGGER_3}}". {{DETAILED_DESCRIPTION}}
triggers:
  - {{TRIGGER_1}}
  - {{TRIGGER_2}}
  - {{TRIGGER_3}}
version: 1.0.0
author: {{AUTHOR}}
date: {{DATE}}
---

# {{SKILL_NAME}}

## Purpose

{{PURPOSE}}

## About This Skill

{{DETAILED_PURPOSE}}

## Step 0: Discovery

Detect environment and gather context.

### 0.1. Check Environment

Use `run` tool to detect:
- Tool availability
- Project context
- Required dependencies

### 0.2. Display Findings

Show detected environment to user.

---

## Step 1: [Main Workflow Step]

### Display Progress

\```
╔══════════════════════════════════════════════════════════════╗
║         ��️  {{SKILL_NAME}} - Progress Tracker                ║
╠══════════════════════════════════════════════════════════════╣
║ ✓ Step 0: Discovery                                          ║
║ → Step 1: [Main Step]                   [IN PROGRESS]        ║
║ ○ Step 2: [Next Step]                                        ║
╠══════════════════════════════════════════════════════════════╣
║ Progress: ███████████░░░░░░░░░░░░░░░░░░░  30%               ║
╚══════════════════════════════════════════════════════════════╝

⏱️  Estimated time remaining: X minutes
\```

### 1.1. [Substep]

{{INSTRUCTIONS}}

---

## Bundled Resources

### references/

Detailed documentation loaded as needed:
- **`references/patterns.md`** - Common patterns
- **`references/advanced.md`** - Advanced techniques

### examples/

Working code examples:
- **`examples/basic.sh`** - Basic usage
- **`examples/advanced.sh`** - Advanced usage

### scripts/

Executable utilities:
- **`scripts/validate.sh`** - Validation helper
- **`scripts/test.sh`** - Testing utility

---

## Examples

### Example 1: Basic Usage

User: "{{EXAMPLE_QUERY_1}}"

Workflow:
1. Detect context
2. Execute main task
3. Display result

Result: {{EXAMPLE_RESULT_1}}

---

### Example 2: Advanced Usage

User: "{{EXAMPLE_QUERY_2}}"

Workflow:
1. Complex detection
2. Multi-step execution
3. Validation

Result: {{EXAMPLE_RESULT_2}}

---

## Error Handling

### Scenario: Missing Dependencies

If dependencies not found:
- Display error message
- Suggest installation
- Ask: "Install now or abort?"

### Scenario: Invalid Input

If input validation fails:
- Show specific error
- Provide examples
- Re-prompt for input

---

**Version:** 1.0.0  
**Writing Style:** Imperative/infinitive form
**Word Count Target:** 1,500-2,000 words (this template)
