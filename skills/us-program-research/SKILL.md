---
name: us-program-research
description: "This skill should be used when the user needs structured research and ranking of US academic programs (PhD, Master's, Bachelor's), including credential analysis, parallel source collection, and an actionable application plan."
version: 1.0.0
author: Eric Andrade
created: 2026-02-20
updated: 2026-02-20
platforms: [github-copilot-cli, claude-code, codex, opencode, gemini, antigravity, cursor, adal]
category: research
tags: [us-programs, university-research, rankings, admissions, scorecards]
risk: medium
triggers:
  - "research us programs"
  - "find masters programs in usa"
  - "research phd in us"
  - "compare us graduate schools"
  - "create us application action plan"
---

# US Academic Program Research — Workflow Completo

## Purpose

Executar pesquisa estruturada de programas acadêmicos dos EUA com análise de credenciais, discovery paralela, scorecards adaptativos e geração de plano de aplicação em formato acionável.

## When to Use

Use este skill quando a tarefa exigir:
- Seleção e ranking de programas (PhD, Master's ou Bachelor's) nos EUA
- Comparação detalhada de currículo, custos e requisitos de admissão
- Estratégia de aplicação baseada em perfil, budget e prazo
- Documento final consolidado para decisão e execução

## Workflow

Siga as fases definidas abaixo em sequência, mantendo rastreabilidade de fontes e separação entre fatos e inferências.

Pesquisa personalizada de programas acadêmicos nos EUA (PhD, Master's MS/MBA/MPS, ou Bachelor's).
Analisa o perfil do candidato, executa buscas paralelas via subagents, identifica hidden gems,
aplica scorecard adaptativo e gera um ACTION_PLAN.md completo com rankings, currículos, custos
e checklist passo a passo.

**Output:** Português. **Queries/subagents:** Inglês (obrigatório para qualidade das buscas).

---

## Instruções de Execução

1. FASE 0 — detectar tipo de programa (PRIMEIRA PERGUNTA)
2. FASE 0B — coletar todos os inputs antes de pesquisar
3. FASE 2 — lançar 4 subagents em UMA mensagem (paralelismo real)
4. FASE 3 — lançar 4 subagents de pesquisa profunda em UMA mensagem
5. FASE 4 — aplicar scorecard adaptativo após toda a pesquisa
6. FASE 5 — gerar documento completo e salvar
7. FASE 6 — apresentar relatório inline ao usuário

> CRÍTICO: Todas as queries de busca e prompts de subagents DEVEM estar em inglês.

---

## FASE 0 — Detecção do Tipo de Programa

Usar AskUserQuestion com a pergunta:
**"Que tipo de programa acadêmico nos EUA você está buscando?"**

Opções:
1. **PhD / Doutorado** — 4–7 anos de pesquisa. Geralmente fully-funded (bolsa + mensalidade).
2. **Master's** — MS, MBA, MPS, MEng (1,5–3 anos). Executivo, técnico, online ou presencial.
3. **Bachelor's / Graduação** — Primeira ou segunda graduação (BS, BA). 2–4 anos.

Tudo no workflow se adapta a essa resposta.

---

## FASE 0B — Coleta de Inputs (2 rodadas de AskUserQuestion)

### Round A — Perfil pessoal (todos os tipos, máx. 4 perguntas):
1. Nome completo + email
2. País de origem + idioma(s) dos diplomas
3. Maior titulação atual: instituição, tipo de diploma, nota/GPA (ex: "8,1/10")
4. Campo de estudo desejado (ex: Computer Science, Business Analytics, AI, Finance...)

### Round B — Logística e preferências (máx. 4 perguntas):
5. Cidade/estado alvo nos EUA (ou "aberto a qualquer localização")
6. Formato preferido: presencial / 100% online / híbrido / sem preferência
7. Orçamento total: até $20k / $20–50k / $50–80k / acima de $80k / busco financiamento
8. Data de início desejada: 2026 / 2027 / 2028 / flexível

Pergunta adicional específica por tipo:
- **PhD:** Área de pesquisa específica? Advisors conhecidos? Somente programas funded?
- **Master's:** Cargo/nível atual (Junior/Manager/Diretor/VP/C-Level)? Trabalhará durante o curso?
- **Bachelor's:** Primeira ou segunda graduação? Créditos transferíveis? Preferência campus grande/pequeno?

Inputs opcionais (oferecer, não exigir): CV, histórico de notas, cursos executivos anteriores,
status migratório nos EUA (Green Card / F1-OPT / H1-B / outro).

---

## FASE 1 — Análise de Perfil e Credenciais

Determinar equivalência do diploma estrangeiro e estratégia de avaliação ANTES de pontuar qualquer programa.

**Ação:** Consultar `references/credential-analysis.md` para:
- Tabela de equivalências de graus por país (inclui risco para Tecnólogo brasileiro)
- Comparativo WES vs ECE por tipo de programa
- Logística WES ICAP passo a passo (8 passos + 2 cenários: resultado favorável vs desfavorável)
- Análise anti-juniorização para candidatos VP/C-Level (somente Master's)
- Análise de advisor fit para PhD + template de email de contato
- Lógica de in-state tuition (Green Card + 12 meses domicílio = elegível)

> Tecnólogo brasileiro = RISCO ALTO. WES pode avaliar como Associate's ao invés de Bachelor's.
> Recomendar carta institucional + ECE como segunda opinião se resultado WES for desfavorável.

---

## FASE 2 — Discovery Paralela (4 Subagents)

**CRÍTICO: Lançar todos os 4 subagents em UMA ÚNICA mensagem (Task tool × 4 simultâneos).**

Dividir pesquisa entre 4 subagents com `subagent_type="general-purpose"`:

| Subagent | Foco                          | Mínimo de programas |
|:--------:|:------------------------------|:-------------------:|
| A        | Regional / Presencial local   | 4                   |
| B        | Nacional online / Brand equity| 5                   |
| C        | Hidden gems (custo baixo)     | 3                   |
| D        | Rankings de referência        | Top 20 contexto     |

**Ação:** Consultar `references/subagent-prompts.md` para os prompts completos (em inglês)
de cada subagent, incluindo todos os campos a coletar e queries de busca.

**Após os 4 subagents concluírem:**
- Deduplicar programas (mesma escola pode aparecer em múltiplos subagents)
- Verificar acreditação: AACSB (negócios), ABET (engenharia) — ausência penaliza Brand Equity
- Para PhD: verificar se fully-funded vs self-funded
- Classificar em grupos: 1 (presencial principal), 1.5 (online brand equity), 2 (técnico/desprioritizado)
- Meta: 12–20 programas únicos para a Fase 3

---

## FASE 3 — Pesquisa Profunda Paralela (4 Subagents)

**CRÍTICO: Dividir os 12–20 programas em 4 grupos (3–5 cada) e lançar em UMA única mensagem.**

Para cada programa, coletar: currículo completo, custo verificado no site oficial, reviews de estudantes
(Niche/Reddit/GMAT Club/GradCafe), requisitos de admissão (GMAT/TOEFL/cartas/deadline), rede de alumni.

**Ação:** Consultar `references/subagent-prompts.md` para o template completo de pesquisa profunda
(seção "Deep Research Template") com todas as queries em inglês.

---

## FASE 4 — Scorecards Adaptativos

**Ação:** Consultar `references/scorecards.md` para os scorecards completos.

### Seleção do Scorecard por Tipo de Programa:

| Tipo       | Scorecard  | Critérios principais                                    |
|:----------:|:----------:|:--------------------------------------------------------|
| Master's   | Scorecard A| Brand + Exec Readiness + Flexibility + Network + ROI + Satisfaction |
| PhD        | Scorecard B| Research Reputation + Advisor Fit + Funding + Placement + Satisfaction |
| Bachelor's | Scorecard C| Brand + Career Launch + ROI + Campus Life + Satisfaction |

### Para Master's — Pesos Adaptativos por Nível do Candidato:

| Critério              | EXECUTIVE | SENIOR | STANDARD | CAREER_LAUNCH | OPT_CRITICAL |
|:----------------------|:---------:|:------:|:--------:|:-------------:|:------------:|
| Brand Equity          |    25     |   23   |    23    |      23       |     22       |
| Executive Readiness*  |    25     |   22   |    18    |      10       |     20       |
| Flexibility           |    16     |   16   |    14    |      12       |     16       |
| Network Quality       |    15     |   15   |    15    |      15       |     12       |
| ROI / Custo-Benefício |    12     |   14   |    16    |      20       |     14       |
| Student Satisfaction  |    10     |   10   |    10    |      10       |     10       |
| STEM Designation      |     0     |    0   |     0    |       0       |      6       |

*Para VP/C-Level = "Executive Readiness". Para não-executivos = "Career Launch Potential".

### Classificação em Tiers:

| Tier    | Score  | Label                          | Ação                 |
|:-------:|:------:|:-------------------------------|:---------------------|
| Top 5   | ≥ 80   | Prioridade Máxima              | MUST APPLY           |
| Tier 2  | 70–79  | Se Budget Permitir             | IF BUDGET ALLOWS     |
| Tier 3  | 55–69  | Backup                         | BACKUP ONLY          |
| Tier 4  | < 55   | Evitar                         | AVOID                |

**💎 Hidden Gem** = Score ≥ 70 AND Custo ≤ 50% do budget AND Satisfação ≥ 8,0/10

---

## FASE 5 — Geração do Documento

Salvar como: `{NOME_CANDIDATO}_US_PROGRAM_ACTION_PLAN.md` (no diretório atual).

**Ação:** Consultar `references/action-plan-template.md` para o template completo do documento
em português, incluindo todas as seções, ~30 tabelas alinhadas e a Table Formatting Policy.

**Seções obrigatórias no documento gerado:**
Status Geral → Próximas Ações Prioritárias → Fase 1 (WES/ECE) → Fase 2 (Testes) →
Fase 3 (Contato) → Fase 4 (Submissão) → Avaliadores → Programas Selecionados por Tier →
Scorecard Adaptativo + Ranking Completo → Comparativo de Currículos → Currículos Detalhados →
Comparativo de Custos → Comparativo de Admissão → Por Que Cada Programa → Inventário de Documentos → Notas.

---

## FASE 6 — Relatório Inline

Apresentar ao usuário no chat (em português) após salvar o arquivo:

**Bloco 1 — Perfil do Candidato** (máx. 5 linhas): tipo, campo, cargo/formação, GPA estimado, status migratório.

**Bloco 2 — Top 5 Recomendações** (tabela compacta):
`| Rank | Programa | Score | Custo | Destaque |`

**Bloco 3 — 💎 Hidden Gems** (se identificados): score ≥ 70 + custo baixo + satisfação ≥ 8,0.

**Bloco 4 — ⚠️ Alertas**: programas sem reviews (red flag), daytime-only para executivos,
advisors sem publicações recentes (PhD), grau limítrofe → WES urgente.

**Bloco 5 — Próxima Ação URGENTE**: "O que fazer HOJE" — normalmente: iniciar WES/ECE ou contatar advisor.

**Bloco 6 — Arquivo Gerado**: `✅ Documento salvo: {NOME}_US_PROGRAM_ACTION_PLAN.md ({N} linhas, {N} tabelas)`

---

## Recursos Adicionais

### Arquivos de Referência

Consultar conforme necessário durante a execução:

- **`references/credential-analysis.md`** — Equivalências de diplomas, logística WES/ECE completa,
  anti-juniorização, advisor fit (PhD), in-state tuition logic
- **`references/scorecards.md`** — Scorecards A/B/C completos com rubricas detalhadas, fórmula ROI
  com exemplo numérico, thresholds de tier e definição de hidden gems
- **`references/subagent-prompts.md`** — Prompts completos (em inglês) para os 8 subagents:
  4 de discovery (Fases 2A/B/C/D) e template de pesquisa profunda (Fase 3)
- **`references/action-plan-template.md`** — Template completo do ACTION_PLAN.md em português
  com todas as seções e tabelas alinhadas
- **`references/research-sources.md`** — Fontes de pesquisa obrigatórias e red flags universais
  por tipo de programa

## Critical Rules

- Todas as queries de pesquisa e prompts para subagentes devem ser em inglês.
- Não pular análise de credenciais antes do score/ranking.
- Não apresentar recomendação final sem citar fontes e critérios.
- Diferenciar claramente dado confirmado, suposição e recomendação.

## Example Usage

1. "Quero um ranking de MS em Data Science nos EUA com budget de USD 50k."
2. "Compare opções de PhD funded em Computer Science com foco em sistemas distribuídos."
3. "Monte um plano de aplicação para MBA com início em 2027."
