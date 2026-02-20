# Research Sources & Red Flags Reference

---

## Mandatory Research Sources

Use ALL of these sources during Phase 3 deep research. Never skip a category.

### Student Reviews (CRITICAL — exposes gaps not visible in rankings):

| Source           | Search Pattern                                     | Best For                          |
|:-----------------|:---------------------------------------------------|:----------------------------------|
| Niche.com        | "{school}" reviews                                 | Overall satisfaction, pros/cons   |
| Reddit           | r/gradadmissions, r/MBA, r/GradSchool, r/PhD       | Unfiltered honest student opinions|
| GMAT Club        | "{school}" "{program}" reviews                     | MBA/Master's specific insights    |
| GradCafe         | "{school}" admissions results                      | Acceptance data, applicant profiles|
| Poets&Quants     | "{school}" "{program}" review                      | MBA/EMBA focused, employer survey |
| BusinessBecause  | "{school}" MBA review                              | International MBA perspectives    |
| RateMyProfessor  | "{professor_name}" (PhD only)                      | Advisor quality, teaching style   |

**Search queries for Reddit (use these formats):**
```
site:reddit.com "{school}" "{program}" review 2024 2025
site:reddit.com "{school}" MBA OR "master's" experience honest
site:reddit.com "is {school} worth it" 2024 2025
```

### Official Rankings:

| Ranking                          | URL Pattern                          | Best For                   |
|:---------------------------------|:-------------------------------------|:---------------------------|
| US News Graduate Rankings        | usnews.com/best-graduate-schools     | Primary ranking reference  |
| QS World University Rankings     | topuniversities.com/rankings         | International recognition  |
| Financial Times MBA Rankings     | ft.com/mba-ranking                   | MBA/EMBA global            |
| Forbes Graduate School Rankings  | forbes.com/graduate-schools          | ROI-focused ranking        |
| Poets&Quants MBA Rankings        | poetsandquants.com/rankings          | MBA prestige signal        |

### Official Costs (ALWAYS verify on school website — never estimate only):

```
Search pattern: site:{school}.edu tuition rates graduate 2025 2026
Verify:
  - Cost per credit hour (in-state AND out-of-state for public)
  - Total credits required for the degree
  - Fees (technology, student activity, etc. — can add $500–$3k per semester)
  - Scholarship/assistantship opportunities
```

### Curricula (required — never rely on program description alone):

```
site:{school}.edu "{program}" required courses
site:{school}.edu "{program}" degree plan
site:{school}.edu "{program}" curriculum 2025
```

### Accreditation Verification:

- **AACSB directory:** aacsb.edu/accreditation/accredited-members (search by school name)
- **STEM CIP codes:** homeland security DHS STEM designated degree program list
  (search: "DHS STEM designated degree program list 2024 2025 PDF")

---

## Universal Red Flags

### For ALL Program Types:

| Red Flag                                            | Impact                             | Action               |
|:----------------------------------------------------|:-----------------------------------|:---------------------|
| No public student reviews anywhere                  | Satisfaction = 20% (max)           | Flag as info gap ⚠️  |
| No AACSB accreditation (business programs)          | Brand Equity severely penalized    | Move to Tier 3/4     |
| Cost exceeds budget with no compensating brand/net  | Automatic Tier 4                   | Remove from Top 5    |
| Application deadline already passed                 | Skip unless rolling admissions     | Note in document     |
| Program recently launched (< 3 years old)           | No alumni network yet              | Penalize Network     |

### For Master's (Director/VP/C-Level Candidates):

| Red Flag                                            | Risk         | Action                    |
|:----------------------------------------------------|:------------:|:--------------------------|
| Daytime full-time cohort only (no evening option)   | 🔴 High      | Group 2; warn prominently |
| Heavy mandatory coding (Python/R/SQL intensive)     | 🔴 High      | Flag; deprioritize        |
| PyTorch, TensorFlow, deep learning mandatory        | 🔴 High      | Flag; deprioritize        |
| Student age profile predominantly 22–27             | 🟡 Medium    | Flag for VP candidates    |
| No career services for experienced professionals    | 🟡 Medium    | Note; less relevant for VP|

**Anti-juniorization warning message template:**
```
⚠️ ALERTA ANTI-JUNIORIZAÇÃO: {Programa} possui cohort diurno integral com
foco intensivo em {Python/R/SQL/ML}. Para candidatos com perfil VP, este
formato pode reclassificar a percepção de mercado para nível júnior.
Recomendação: Priorizar programas com formato executivo/noturno.
```

### For PhD:

| Red Flag                                            | Risk         | Action                              |
|:----------------------------------------------------|:------------:|:------------------------------------|
| Advisor with no publications in last 3 years        | 🔴 Critical  | DO NOT APPLY to this specific advisor |
| No funding for international students               | 🔴 High      | Flag (unless candidate is self-funded)|
| Average time-to-graduation > 6 years                | 🟡 Medium    | Flag; research reasons              |
| Reviews mentioning advisor pressure / high attrition| 🔴 High      | AVOID                               |
| Department without active research partnerships     | 🟡 Medium    | Penalize Research Reputation        |
| Advisor confirmed NOT accepting new students        | 🔴 Critical  | Remove from list; find alternative  |

### For Bachelor's:

| Red Flag                                            | Risk         | Action                           |
|:----------------------------------------------------|:------------:|:---------------------------------|
| No co-op or internship program                      | 🟡 Medium    | Penalize Career Launch Potential |
| Very low retention rate (< 70%)                     | 🔴 High      | Flag Student Satisfaction        |
| Transfer credits not accepted                       | 🟡 Medium    | Note if candidate has transfers  |
| No active student clubs in relevant field           | Low          | Note only                        |

---

## Scoring Summary for Common Scenarios

### "No Reviews" Scenario:

When a program has no public reviews on Niche, Reddit, GMAT Club, or GradCafe:
1. Score Student Satisfaction at 20% of criterion weight (minimum)
2. Add explicit warning: "⚠️ Quase sem reviews públicos — risco de lacuna de informação"
3. Move program toward Tier 3 or 4 regardless of other scores
4. Recommend candidate contact current students directly before applying

### "Affordable + AACSB + Good Reviews" = Hidden Gem:

When ALL of the following are true:
- Score ≥ 70 (before hidden gem classification)
- Cost ≤ 50% of candidate's stated budget
- Student satisfaction ≥ 8.0/10
→ Mark as 💎 Hidden Gem in the document and highlight in inline report

### "Elite Brand + High Cost + Low ROI" Scenario:

When brand is very high (Top-25 US News) but cost is very high relative to brand+network:
- Calculate ROI index: if (brand_pts + network_pts) / (cost/10000) < 4
- This will score ≤ 29% of the ROI criterion weight
- Result may still be Tier 1 if brand+network+exec readiness compensate
- Flag in "Por Que Cada Programa" section: "custo elevado com ROI moderado"
