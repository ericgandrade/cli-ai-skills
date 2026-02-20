# Adaptive Scorecards Reference

---

## Scorecard A: Master's (MS / MBA / MPS)

### Step 1: Determine Candidate Level

| Level                        | Keywords                                               | Weights Profile  |
|:-----------------------------|:-------------------------------------------------------|:-----------------|
| VP / C-Level                 | VP, SVP, EVP, President, CEO, CTO, CISO, CDO, Partner | EXECUTIVE        |
| Director / Senior Manager    | Director, Sr. Manager, Principal, Head of              | SENIOR           |
| Manager / Individual Contrib.| Manager, Lead, Analyst, Engineer, Consultant           | STANDARD         |
| Career Changer / Recém-Grad  | Student, Intern, < 3 years experience                  | CAREER_LAUNCH    |
| OPT-Crítico (visto F1)       | F1, OPT, STEM OPT extension needed                    | OPT_CRITICAL     |

### Step 2: Adaptive Weight Table

| Critério               | EXECUTIVE | SENIOR | STANDARD | CAREER_LAUNCH | OPT_CRITICAL |
|:-----------------------|:---------:|:------:|:--------:|:-------------:|:------------:|
| Brand Equity           |    25     |   23   |    23    |      23       |     22       |
| Executive Readiness*   |    25     |   22   |    18    |      10       |     20       |
| Flexibility            |    16     |   16   |    14    |      12       |     16       |
| Network Quality        |    15     |   15   |    15    |      15       |     12       |
| ROI / Custo-Benefício  |    12     |   14   |    16    |      20       |     14       |
| Student Satisfaction   |    10     |   10   |    10    |      10       |     10       |
| STEM Designation       |     0     |    0   |     0    |       0       |      6       |
| **TOTAL**              |  **103**  |**100** |  **96**  |    **90**     |   **100**    |

> Normalizar para 100 antes de pontuar quando TOTAL ≠ 100 (redução proporcional de cada critério).
> *Executive Readiness = relevância do currículo para progressão VP→C-Level.
>  Para não-executivos: renomear "Career Launch Potential" = placement rate, estágios, employer access.
>  Para OPT_CRITICAL: STEM Designation 6pts; reduzir Executive Readiness, ROI, Network em 2pts cada.

### Step 3: Scoring Rubrics

#### Brand Equity (% do peso do critério):

| Posição no Ranking                          | % do Peso |
|:--------------------------------------------|:---------:|
| Top-25 US News no campo específico          | 90–100%   |
| Top-50 US News                              | 78–87%    |
| Reconhecimento regional forte, presença nacional | 65–74% |
| Sólido regional, acreditado AACSB           | 52–61%    |
| Local / visibilidade nacional limitada      | 39–48%    |
| Sem AACSB / sem track record público        | 26–35%    |

#### Executive Readiness (perfis executivos):

| Currículo                                               | % do Peso |
|:--------------------------------------------------------|:---------:|
| 100% estratégia/gestão, sem programação obrigatória     | 90–100%   |
| Predominantemente gestão, módulos técnicos opcionais    | 77–86%    |
| Equilibrado gestão + técnico                            | 59–73%    |
| Técnico com módulos de gestão                           | 45–54%    |
| Coding intensivo obrigatório (deep learning, Python/R)  | 32–41%    |

#### Career Launch Potential (perfis não-executivos):

| Placement / Career Services                                    | % do Peso |
|:---------------------------------------------------------------|:---------:|
| Alta taxa placement (90%+) + employer network forte + co-op    | 90–100%   |
| Bom placement + career services ativo                          | 64–77%    |
| Career services moderado                                       | 45–59%    |
| Placement fraco / sem dados públicos                           | 23–36%    |

#### Flexibility:

| Formato                                                     | % do Peso |
|:------------------------------------------------------------|:---------:|
| 100% online assíncrono (sem horário fixo)                   | 100%      |
| Híbrido / horário noturno forte                             | 81–94%    |
| Presencial noturno (2–3 noites/semana fixo)                 | 63–75%    |
| Presencial diurno intensivo (exige largar emprego)          | 44–56%    |

#### Network Quality:

| Rede de Alumni                                              | % do Peso |
|:------------------------------------------------------------|:---------:|
| Elite nacional (Top-20 alumni, Ivy-equivalent, flagship)    | 93–100%   |
| Regional forte + career services ativo                      | 73–87%    |
| Rede regional moderada                                      | 53–67%    |
| Rede local limitada                                         | 33–47%    |

#### ROI / Cost-Benefit — Fórmula:

```
roi_index = (brand_pts + network_pts) / (custo_total_USD / 10.000)

Thresholds:
  roi_index > 14    → 100% do peso
  roi_index 10–14   → 79–93% do peso
  roi_index 7–10    → 57–71% do peso
  roi_index 4–7     → 36–50% do peso
  roi_index < 4     → 14–29% do peso

Exemplo prático:
  Brand = 17pts, Network = 13pts, Custo = US$45k
  roi_index = 30 / 4,5 = 6,67 → ~57% do peso
  Se o peso do critério for 14pts → 0,57 × 14 = 7,98pts para ROI
```

#### Student Satisfaction (fontes: Niche, Reddit, GMAT Club, GradCafe):

| Faixa de Satisfação         | % do Peso |
|:----------------------------|:---------:|
| 9,0–10,0                    | 100%      |
| 8,5–8,9                     | 90%       |
| 8,0–8,4                     | 80%       |
| 7,5–7,9                     | 60–70%    |
| 7,0–7,4                     | 50%       |
| 6,5–6,9                     | 30–40%    |
| Poucas/nenhuma review pública| 20% ⚠️ RED FLAG |

#### STEM Designation (somente OPT_CRITICAL):
- CIP code STEM confirmado: 100% do peso
- Não confirmado STEM: 0%

### Steps 4–6:

**Step 4:** Somar todos os critérios → TOTAL (out of 100)

**Step 5:** Classificar nos tiers:

| Tier    | Score  | Label                          | Ação                 |
|:-------:|:------:|:-------------------------------|:---------------------|
| Top 5   | ≥ 80   | Prioridade Máxima              | MUST APPLY           |
| Tier 2  | 70–79  | Se Budget Permitir             | IF BUDGET ALLOWS     |
| Tier 3  | 55–69  | Backup                         | BACKUP ONLY          |
| Tier 4  | < 55   | Evitar                         | AVOID                |

**Step 6 — Hidden Gems:**
💎 **Hidden Gem** = Score ≥ 70 AND Custo ≤ 50% do budget AND Satisfação ≥ 8,0/10

---

## Scorecard B: PhD / Doutorado (total = 100 pts)

| Critério               | Peso | Rubrica                                                                        |
|:-----------------------|:----:|:-------------------------------------------------------------------------------|
| Research Reputation    |  30  | US News subfield ranking + h-index faculty + citações recentes                 |
| Advisor / Lab Fit      |  25  | Publicações ativas (últimos 3 anos) + alinhamento + confirma vagas             |
| Funding Available      |  20  | Fully-funded (RA/TA + stipend): 20pts; Parcial: 10pts; Self-pay: 0pts         |
| Placement Outcomes     |  15  | % PhDs em posições desejadas + tempo médio de conclusão                        |
| Student Satisfaction   |  10  | GradCafe + Reddit r/gradadmissions + advisor RateMyProfessor                   |

### PhD Red Flags (auto-AVOID):

- ⛔ Advisor sem publicações nos últimos 3 anos
- ⛔ Programa sem funding para estudantes internacionais
- ⛔ Tempo médio de conclusão > 6 anos (sem justificativa do campo)
- ⛔ Reviews mencionando pressão do advisor, falta de suporte ou alta desistência
- ⛔ Departamento sem parcerias ativas de pesquisa/indústria

### PhD Tier Thresholds:

| Tier   | Score  | Label                                              |
|:------:|:------:|:---------------------------------------------------|
| Tier 1 | ≥ 80   | APLICAR — fully-funded + advisor forte + reputação |
| Tier 2 | 70–79  | APLICAR — funding parcial ou advisor forte         |
| Tier 3 | 55–69  | BACKUP                                             |
| Tier 4 | < 55   | EVITAR (ou qualquer red flag presente)             |

---

## Scorecard C: Bachelor's / Segunda Graduação (total = 100 pts)

| Critério                   | Peso | Rubrica                                                              |
|:---------------------------|:----:|:---------------------------------------------------------------------|
| Brand / Reputation         |  25  | US News + QS ranking + reconhecimento regional de empregadores       |
| Career Launch Potential    |  25  | Placement rate + co-op/internship + employer recruiting on campus    |
| ROI / Custo-Benefício      |  20  | In-state elegível? Bolsas? Salário inicial vs. custo total           |
| Campus Life / Flexibility  |  15  | Fit com estilo de vida: grande/pequeno, online/campus, transfer credit|
| Student Satisfaction       |  15  | Niche + Reddit + taxa de retenção geral                              |

### ROI Formula — Bachelor's:

```
roi_score = (salário_inicial_esperado_USD / custo_total_USD) × 100

Normalizar para 0–20 pts:
  roi_score > 150   → 20 pts
  roi_score 100–150 → 16–19 pts
  roi_score 70–100  → 12–15 pts
  roi_score 50–70   → 8–11 pts
  roi_score < 50    → 0–7 pts
```

**Bachelor's Tiers:** mesmos thresholds de Master's (≥80 / 70–79 / 55–69 / <55).

---

## Market Validation — Scorecards

Os pesos do Scorecard A (Master's) foram validados contra:

| Fonte                              | Alinhamento                                                              |
|:-----------------------------------|:-------------------------------------------------------------------------|
| US News MBA Rankings               | Brand 25% ≈ US News "quality assessment" 25%                            |
| US News MBA Rankings               | Executive Readiness substitui "selectivity" 25% para perfil VP          |
| Fortune EMBA Rankings              | Network 15% alinhado com métrica de alumni C-level da Fortune            |
| 2024 Market Research               | ROI incluído — 40% dos programas de master's têm ROI negativo           |
| Working Professional needs         | Flexibility 16% — não existe em rankings tradicionais, crítico para exec.|
| Niche/Reddit/GMAT Club 2024/2025   | Student Satisfaction 10% — expõe gaps não visíveis em rankings          |
