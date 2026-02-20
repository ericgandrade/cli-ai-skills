---
name: executing-plans
description: "This skill should be used when the user has a written implementation plan to execute in a separate session with review checkpoints."
version: 1.0.0
author: Eric Andrade
created: 2026-02-20
updated: 2026-02-20
platforms: [github-copilot-cli, claude-code, codex, opencode, gemini, antigravity, cursor, adal]
category: planning
tags: [planning, execution, checkpoints, implementation]
risk: safe
---

# Executing Plans

## Purpose

Execute approved implementation plans in controlled batches with checkpoints, verification, and review gates.

## When to Use

Use this skill when:
- A written implementation plan already exists
- Work must be executed with periodic review checkpoints
- Risk of regressions requires strict plan adherence and verification

## Workflow

1. Load and review plan critically
2. Execute first batch of tasks
3. Report results and verification output
4. Pause for feedback and continue in batches
5. Finish branch with final verification

## Overview

Load plan, review critically, execute tasks in batches, report for review between batches.

**Core principle:** Batch execution with checkpoints for architect review.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan
1. Read plan file
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Create TodoWrite and proceed

### Step 2: Execute Batch
**Default: First 3 tasks**

For each task:
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed

### Step 3: Report
When batch complete:
- Show what was implemented
- Show verification output
- Say: "Ready for feedback."

### Step 4: Continue
Based on feedback:
- Apply changes if needed
- Execute next batch
- Repeat until complete

### Step 5: Complete Development

After all tasks complete and verified:
- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker mid-batch (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**
- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

## Remember
- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Reference skills when plan says to
- Between batches: just report and wait
- Stop when blocked, don't guess
- Never start implementation on main/master branch without explicit user consent

## Integration

**Required workflow skills:**
- **superpowers:using-git-worktrees** - REQUIRED: Set up isolated workspace before starting
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:finishing-a-development-branch** - Complete development after all tasks

## Critical Rules

- Stop immediately on blockers and ask for clarification.
- Do not skip verification commands defined in the plan.
- Do not continue to the next batch without reporting and waiting for feedback.

## Example Usage

1. "Use executing-plans to implement `docs/plans/2026-02-20-api-hardening.md`."
2. "Use executing-plans to run the next 3 tasks and stop for review."
3. "Use executing-plans to finish remaining tasks and report final checks."
