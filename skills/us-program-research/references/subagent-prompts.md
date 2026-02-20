# Subagent Prompts Reference

All prompts below MUST be sent to subagents in English. Replace {PLACEHOLDERS} with
candidate-specific values before launching. Use subagent_type="general-purpose".

---

## Phase 2 — Parallel Discovery (4 Subagents)

Launch ALL 4 in ONE single message (4 Task tool calls simultaneously).

---

### Subagent A — Regional / Local Programs

```
[SEARCH TASK — ENGLISH REQUIRED]
Search for academic programs matching this profile:
- Program type: {PROGRAM_TYPE} (PhD/Master's/Bachelor's)
- Field: {FIELD}
- Location: {CITY}, {STATE}, USA

Perform these web searches:
1. "{FIELD}" "{PROGRAM_TYPE}" "{CITY}" OR "{STATE}" AACSB OR accredited 2025 2026
2. "{FIELD}" "{PROGRAM_TYPE}" "{STATE}" evening OR "part-time" OR "working professional" 2025
3. "{PROGRAM_TYPE}" "{FIELD}" "{STATE}" "no GMAT" OR "GMAT optional" OR "GMAT waiver" 2025
4. best "{FIELD}" "{PROGRAM_TYPE}" "{STATE}" site:usnews.com

For each program found, collect:
- Full program name and school name
- Program URL (official page)
- Public or private institution
- Accreditation: AACSB (yes/no), ABET (yes/no), STEM-designated (yes/no)
- Format: in-person / online / hybrid
- Schedule: daytime / evening / flexible / asynchronous
- Estimated total cost (if available on website)
- Duration (semesters or years)
- GMAT/GRE: required / optional / waivable
- Admissions contact email (search: site:{school}.edu admissions contact)

Return a structured list with all data collected. Minimum 4 programs.
```

---

### Subagent B — National Online / Brand Equity

```
[SEARCH TASK — ENGLISH REQUIRED]
Search for online or nationally-ranked programs:
- Program type: {PROGRAM_TYPE}
- Field: {FIELD}

Perform these web searches:
1. "best online {PROGRAM_TYPE}" "{FIELD}" USA 2025 ranking
2. "top {FIELD} {PROGRAM_TYPE}" online USA AACSB STEM 2025
3. "{FIELD} {PROGRAM_TYPE}" online "public university" USA affordable 2025
4. best "{FIELD}" {PROGRAM_TYPE} programs 2025 site:usnews.com

For each program found, collect the same fields as Subagent A.
Focus on: nationally-recognized universities with strong brand equity and online delivery.
Minimum 5 programs.
```

---

### Subagent C — Hidden Gems

```
[SEARCH TASK — ENGLISH REQUIRED]
Search for underrated high-value programs:
- Program type: {PROGRAM_TYPE}
- Field: {FIELD}
- Budget constraint: under {BUDGET_THRESHOLD_USD}

Perform these web searches:
1. AACSB STEM "{FIELD}" "{PROGRAM_TYPE}" affordable "no GMAT" OR "GMAT waiver" USA 2025
2. "underrated" OR "hidden gem" "{FIELD}" program USA Reddit 2024 2025
3. "{FIELD}" "{PROGRAM_TYPE}" online affordable "high placement rate" USA 2025
4. cheap AACSB "{FIELD}" "{PROGRAM_TYPE}" online OR evening USA 2025

For each hidden gem found, also provide:
- Why it qualifies as a hidden gem (low cost + evidence of quality)
- AACSB accredited? (yes/no)
- STEM designated? (yes/no)
- Estimated total cost
- Any student reviews available? (Niche score or Reddit mentions)

Minimum 3 programs. These should be programs not typically found on major rankings pages.
```

---

### Subagent D — Rankings Reference

```
[SEARCH TASK — ENGLISH REQUIRED]
Collect official rankings for context:
- Program type: {PROGRAM_TYPE}
- Field: {FIELD}

Perform these web searches:
1. US News best "{FIELD}" "{PROGRAM_TYPE}" programs 2025 ranking
2. QS world university rankings "{FIELD}" 2025
3. Financial Times "{PROGRAM_TYPE}" rankings 2025
4. Poets&Quants best "{PROGRAM_TYPE}" rankings 2025
5. Forbes best graduate schools "{FIELD}" 2025

Return: top-20 ranked programs with:
- Position number
- School name
- Ranking source (US News / QS / FT / Forbes)
- Source URL

This data will be used to calibrate Brand Equity scores in the adaptive scorecard.
```

---

## Phase 3 — Deep Research Template

Divide 12–20 programs into 4 groups (3–5 each). Launch ALL 4 in ONE single message.

```
[DEEP RESEARCH TASK — ENGLISH REQUIRED]
Perform deep research on these programs: {PROGRAM_LIST_3_TO_5_PROGRAMS}

For EACH program in the list, research ALL sections below:

=== CURRICULUM ===
Search: site:{school}.edu "{program_name}" curriculum required courses
Search: site:{school}.edu "{program_name}" degree plan syllabus
Extract:
- Required/core courses (list with 1-line description of focus for each)
- Elective tracks or specializations available
- For Master's: is it strategy/management-focused or technical/coding-heavy?
  (flag if heavy coding: Python, R, SQL intensive, machine learning mandatory)
- For PhD: research areas, active labs, dissertation/dissertation defense requirements
- For Bachelor's: major requirements, minor options, co-op/internship availability

=== VERIFIED COST ===
Search: site:{school}.edu tuition graduate 2025 2026
Search: "{school}" "{program_name}" total cost 2025 2026
Extract:
- Cost per credit hour (in-state AND out-of-state for public; flat rate for private)
- Total credits required for degree completion
- Total estimated cost: in-state AND out-of-state (or flat for private)
- Estimated monthly cost = total / (duration in months)

=== STUDENT REVIEWS ===
Search: "{school}" "{program_name}" review site:reddit.com 2024 2025
Search: "{school}" "{program_name}" review site:niche.com 2025
Search: "{school}" "{program_name}" GMAT Club review 2024 2025
Search: "{school}" graduate students experience satisfaction 2024 2025
Search: "{school}" "{program_name}" GradCafe results 2024 2025
For PhD additionally: "{advisor_name}" Rate My Professor review 2024
Synthesize into:
- Overall satisfaction score (6.5–10 scale based on aggregate reviews)
- Top 3 positives mentioned by students
- Top 3 negatives or concerns mentioned by students
- Any red flags (recurring complaints about admin issues, job placement, faculty)

=== ADMISSIONS REQUIREMENTS ===
Search: site:{school}.edu "{program_name}" admissions requirements apply
Extract:
- GMAT/GRE: required / optional / waivable (list conditions for waiver if applicable)
- TOEFL minimum iBT score required (or IELTS minimum if accepted)
- Number and type of recommendation letters (academic / professional)
- Interview: required / by invitation / not required
- Application fee (USD)
- Next application deadlines for Fall {TARGET_YEAR} (and Spring if available)
- Admissions contact email or link to contact form

=== ALUMNI NETWORK ===
Search: "{school}" alumni network "{field}" OR "{state}" 2024 2025
Search: "{school}" "{program_name}" career services employer recruiting 2024 2025
Extract:
- Alumni network size or reach (if available from official sources)
- Career services quality: job board, mentorship programs, employer partnerships
- Placement rate (if available on official website — note if unofficial/estimate)
- Notable employers that actively recruit from this program

Return ALL data clearly structured by program name.
```

---

## Phase 2 Consolidation Instructions

After all 4 Phase 2 subagents complete:

1. **Deduplicate** — merge entries where same program appears in multiple subagents
2. **Verify accreditation:**
   - Business programs without AACSB → severe Brand Equity penalty
   - Engineering programs: check ABET accreditation
   - Confirm STEM CIP code for OPT-critical candidates
3. **For PhD specifically:** flag whether each program is fully-funded, partially-funded, or self-pay
4. **Classify into groups:**
   - Group 1: primary format matching candidate preference (regional/in-person/evening)
   - Group 1.5: online with national brand equity (top state flagships, elite privates)
   - Group 2: deprioritized (technical-heavy for executives, daytime-only, poor fit)
5. **Target:** 12–20 unique programs to carry into Phase 3 deep research
