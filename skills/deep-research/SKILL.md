---
name: deep-research
description: Execute deep, multi-step research using native web tools (WebSearch/WebFetch) without external API keys. Use for market analysis, competitive research, literature scans, technical due diligence, and decision support with citations.
version: 1.0.0
author: Eric Andrade
created: 2026-02-20
updated: 2026-02-20
platforms: [github-copilot-cli, claude-code, codex, opencode, gemini, antigravity, cursor, adal]
category: research
tags: [research, search, analysis, synthesis, citations]
risk: safe
---

# Deep Research (No External API)

Run structured, multi-step research with evidence-first synthesis.

This skill is designed to work **without Google/Gemini API** or any paid provider setup.

## When to Use This Skill

Use this skill when:
- Performing market analysis
- Conducting competitive landscaping
- Building literature or source reviews
- Doing technical due diligence
- Preparing decision memos with citations

## Requirements

- Access to built-in web research tools (`WebSearch`, `WebFetch`)
- Clear research question and scope

No external API key is required.

## Research Protocol

1. Define objective and output format
- Clarify the research question, audience, and success criteria.
- Confirm time horizon (e.g., last 12 months, last 5 years).

2. Build search strategy
- Create 5-10 query variants (broad, narrow, comparative, opposing views).
- Prefer primary sources first (official docs, papers, regulatory pages, vendor docs).

3. Collect sources with traceability
- Capture URL, title, date, publisher, and relevance notes.
- Track contradictions and unresolved claims explicitly.

4. Validate and triangulate
- Cross-check key claims with at least 2 independent credible sources.
- Flag weak evidence and avoid overconfident conclusions.

5. Synthesize output
- Produce concise findings with direct citations.
- Separate facts, inferences, and recommendations.

## Output Formats

Choose one based on request:

### 1) Executive Brief
- Objective
- Top findings (5-10)
- Risks / unknowns
- Recommendations
- Sources

### 2) Comparative Analysis
- Criteria matrix
- Option-by-option strengths/weaknesses
- Trade-offs
- Recommendation + rationale
- Sources

### 3) Research Log
- Queries used
- Source inventory
- Evidence quality notes
- Open questions
- Next research steps

## Quality Bar

- Evidence before conclusions
- Date-aware and source-aware claims
- Contradictions surfaced, not hidden
- No uncited critical claims

## Time & Cost

- Time: usually 5-20 minutes depending on scope
- Cost: no external API cost for this skill

## Safety

- Never fabricate sources or citations.
- If evidence is insufficient, state it clearly.
- Distinguish confirmed facts from inference.
