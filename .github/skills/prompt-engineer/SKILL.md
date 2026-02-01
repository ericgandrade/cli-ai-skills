---
name: prompt-engineer
description: Transforms user prompts into optimized prompts using frameworks (RTF, RISEN, Chain of Thought, RODES, Chain of Density, R-A-C-E, R-I-S-E, S-T-A-R, S-O-A-P, C-L-E-A-R, G-R-O-W)
triggers:
  - "melhore este prompt"
  - "otimize prompt"
  - "refine prompt"
  - "prompt engineering"
  - "transforme em prompt"
  - "crie prompt para"
version: 1.0.0
---

## Purpose

This skill transforms raw, unstructured user prompts into highly optimized prompts using established prompting frameworks. It analyzes user intent, identifies task complexity, and intelligently selects the most appropriate framework(s) to maximize Claude/ChatGPT output quality.

The skill operates in "magic mode" - it works silently behind the scenes, only interacting with users when clarification is critically needed. Users receive polished, ready-to-use prompts without technical explanations or framework jargon.

This is a **universal skill** that works in any terminal context, not limited to Obsidian vaults or specific project structures.

## When to Use

Invoke this skill when:

- User provides a vague or generic prompt (e.g., "help me code Python")
- User has a complex idea but struggles to articulate it clearly
- User's prompt lacks structure, context, or specific requirements
- Task requires step-by-step reasoning (debugging, analysis, design)
- User needs a prompt for a specific AI task but doesn't know prompting frameworks
- User wants to improve an existing prompt's effectiveness
- User asks variations of "how do I ask AI to..." or "create a prompt for..."

## Workflow

### Step 1: Analyze Intent

**Objective:** Understand what the user truly wants to accomplish.

**Actions:**
1. Read the raw prompt provided by the user
2. Detect task characteristics:
   - **Type:** coding, writing, analysis, design, learning, planning, decision-making, creative, etc.
   - **Complexity:** simple (one-step), moderate (multi-step), complex (requires reasoning/design)
   - **Clarity:** clear intention vs. ambiguous/vague
   - **Domain:** technical, business, creative, academic, personal, etc.
3. Identify implicit requirements:
   - Does user need examples?
   - Is output format specified?
   - Are there constraints (time, resources, scope)?
   - Is this exploratory or execution-focused?

**Detection Patterns:**
- **Simple tasks:** Short prompts (<50 chars), single verb, no context
- **Complex tasks:** Long prompts (>200 chars), multiple requirements, conditional logic
- **Ambiguous tasks:** Generic verbs ("help", "improve"), missing object/context
- **Structured tasks:** Mentions steps, phases, deliverables, stakeholders

---

### Step 2: Clarify (Conditional)

**When to execute:** Only if Step 1 detects critical ambiguity or missing information.

**Critical Ambiguity Triggers:**
- Generic verbs without object (e.g., "improve this", "help me with X")
- Missing task context (e.g., "create a system" → what kind? for what?)
- Contradictory requirements
- Multiple possible interpretations

**Actions:**
1. Use `ask_user` tool to ask targeted clarifying questions
2. Provide **multiple choice** options when possible (faster UX)
3. Limit to **2-3 questions maximum** to avoid frustration
4. Frame questions around missing critical information, not nice-to-haves

**Example Questions:**
- "What type of [X] do you need?" → [Option A, Option B, Option C]
- "What's the primary goal?" → [Learn concept, Build solution, Analyze data]
- "Who is the audience?" → [Technical team, Executives, General public]

**If clarity is sufficient:** Skip this step entirely and proceed to Step 3.

---

### Step 3: Select Framework(s)

**Objective:** Map task characteristics to optimal prompting framework(s).

**Framework Mapping Logic:**

| Task Type | Recommended Framework(s) | Rationale |
|-----------|-------------------------|-----------|
| **Role-based tasks** (act as expert, consultant) | **RTF** (Role-Task-Format) | Clear role definition + task + output format |
| **Step-by-step reasoning** (debugging, proof, logic) | **Chain of Thought** | Encourages explicit reasoning steps |
| **Structured projects** (multi-phase, deliverables) | **RISEN** (Role, Instructions, Steps, End goal, Narrowing) | Comprehensive structure for complex work |
| **Complex design/analysis** (systems, architecture) | **RODES** (Role, Objective, Details, Examples, Sense check) | Balances detail with validation |
| **Summarization** (compress, synthesize) | **Chain of Density** | Iterative refinement to essential info |
| **Communication** (reports, presentations, storytelling) | **R-A-C-E** (Role, Audience, Context, Expectation) | Audience-aware messaging |
| **Investigation/analysis** (research, diagnosis) | **R-I-S-E** (Research, Investigate, Synthesize, Evaluate) | Systematic analytical approach |
| **Contextual situations** (problem-solving with background) | **S-T-A-R** (Situation, Task, Action, Result) | Context-rich problem framing |
| **Documentation** (medical, technical, records) | **S-O-A-P** (Subjective, Objective, Assessment, Plan) | Structured information capture |
| **Goal-setting** (OKRs, objectives, targets) | **C-L-E-A-R** (Collaborative, Limited, Emotional, Appreciable, Refinable) | Goal clarity and actionability |
| **Coaching/development** (mentoring, growth) | **G-R-O-W** (Goal, Reality, Options, Will) | Developmental conversation structure |

**Blending Strategy:**
- **Combine 2-3 frameworks** when task spans multiple types
- Example: Complex technical project → **RODES + Chain of Thought** (structure + reasoning)
- Example: Leadership decision → **C-L-E-A-R + G-R-O-W** (goal clarity + development)

**Selection Criteria:**
- Primary framework = best match to core task type
- Secondary framework(s) = address additional complexity dimensions
- Avoid over-engineering: simple tasks get simple frameworks

**Critical Rule:** This selection happens **silently** - do not explain framework choice to user.

---

### Step 4: Generate Optimized Prompt

**Objective:** Construct a polished, production-ready prompt using selected framework(s).

**Generation Rules:**

**4.1. Adaptive Sizing**
- **Original prompt <100 chars** → Output 150-300 words (focused, direct)
- **Original prompt 100-300 chars** → Output 300-500 words (structured, detailed)
- **Original prompt >300 chars** → Output 500-800 words (comprehensive, with examples)

**4.2. Essential Components** (include when applicable):
- ✅ **Role/Context:** "You are a [expert/role] with expertise in [domain]"
- ✅ **Task:** Clear, specific instruction on what to do
- ✅ **Output Format:** "Provide X as [format: list, code, table, essay, etc.]"
- ✅ **Constraints:** Limitations, requirements, boundaries
- ✅ **Examples:** (when helpful) Show 1-2 examples of desired output
- ✅ **Validation:** (for complex tasks) "Verify that [quality criteria]"

**4.3. Framework Application**

**RTF Template:**
```
Role: You are [expert role].
Task: [Specific task description with clear objective].
Format: [Expected output format with structure].
```

**Chain of Thought Template:**
```
[Task description]

Approach this step-by-step:
1. [First reasoning step]
2. [Second reasoning step]
...
N. [Final step leading to answer]

Show your reasoning for each step.
```

**RISEN Template:**
```
Role: You are [expert].
Instructions: [What to do].
Steps:
1. [Step 1]
2. [Step 2]
...
End Goal: [Desired outcome].
Narrowing: [Constraints/focus areas].
```

**RODES Template:**
```
Role: [Expert identity]
Objective: [What to achieve]
Details:
- [Key detail 1]
- [Key detail 2]
Examples: [1-2 examples of expected output]
Sense Check: [Validation criteria]
```

**Chain of Density Template:**
```
[Content to summarize]

Create 5 iterations of summaries:
1. Initial summary (verbose)
2. Denser summary (remove non-essential)
3. Denser still (compress further)
4. Highly dense (only critical info)
5. Maximum density (absolute essentials)
```

**R-A-C-E Template:**
```
Role: You are [communicator role].
Audience: [Target audience with characteristics].
Context: [Background/situation].
Expectation: [What audience needs to know/do].
```

**R-I-S-E Template:**
```
Research: [Topic/question to investigate]
Investigate: [Specific areas to explore]
Synthesize: [How to combine findings]
Evaluate: [Criteria for assessment]
```

**S-T-A-R Template:**
```
Situation: [Background context]
Task: [Specific challenge/objective]
Action: [What needs to be done]
Result: [Expected outcome]
```

**S-O-A-P Template:**
```
Subjective: [User-reported information]
Objective: [Observable facts]
Assessment: [Analysis/diagnosis]
Plan: [Recommended actions]
```

**C-L-E-A-R Template:**
```
Collaborative: [Who is involved]
Limited: [Scope/boundaries]
Emotional: [Why it matters]
Appreciable: [Measurable progress]
Refinable: [How to iterate/improve]
```

**G-R-O-W Template:**
```
Goal: [What you want to achieve]
Reality: [Current situation/challenges]
Options: [Possible approaches]
Will: [Commitment to action]
```

**4.4. Blending Multiple Frameworks**

When combining frameworks, structure the prompt in sections:

```
[Primary Framework Structure]

[Secondary Framework Elements Integrated]

Example:
---
Role: You are a senior software architect. [RTF - Role]

Objective: Design a microservices architecture for [system]. [RODES - Objective]

Approach this step-by-step: [Chain of Thought]
1. Analyze current monolithic constraints
2. Identify service boundaries
3. Design inter-service communication
4. Plan data consistency strategy

Details: [RODES - Details]
- Expected traffic: [X]
- Data volume: [Y]
- Team size: [Z]

Output Format: [RTF - Format]
Provide architecture diagram description, service definitions, and migration roadmap.

Sense Check: [RODES - Sense check]
Validate that services are loosely coupled, independently deployable, and aligned with business domains.
```

**4.5. Language Adaptation**
- If original prompt is in Portuguese, generate prompt in Portuguese
- If original prompt is in English, generate prompt in English
- If mixed, default to English (more universal for AI models)

**4.6. Quality Checks**
Before finalizing, verify:
- [ ] Prompt is self-contained (no external context needed)
- [ ] Task is specific and measurable
- [ ] Output format is clear
- [ ] No ambiguous language
- [ ] Appropriate level of detail for task complexity

---

### Step 5: Present Output

**Objective:** Deliver the optimized prompt in a clean, copy-ready format.

**Output Format:**

````markdown
```
[OPTIMIZED PROMPT]
```
````

**Rules:**
- ✅ **Use Markdown code block** for easy copying
- ✅ **No preamble** ("Here's your optimized prompt...")
- ✅ **No technical explanations** (which framework was used, why, etc.)
- ✅ **No meta-commentary** (suggestions, notes, caveats)
- ✅ **Just the prompt** - clean, polished, ready to use

**Example:**

````markdown
```
You are an expert Python developer specializing in data analysis.

Task: Create a Python script to analyze CSV data with the following requirements:
- Read CSV from user-specified path
- Calculate descriptive statistics (mean, median, std dev)
- Generate visualizations (histogram, box plot)
- Export results to PDF report

Output format: Complete, well-commented Python code with usage examples.

Constraints:
- Use pandas and matplotlib libraries
- Handle missing values gracefully
- Include error handling for file I/O

Example output structure:
1. Data loading function
2. Statistical analysis function
3. Visualization function
4. Report generation function
5. Main execution block

Validation: Ensure code runs without errors on sample data and produces readable PDF.
```
````

**Post-Output:**
- If user asks for changes, iterate on the prompt (apply requested modifications)
- If user asks for explanation, provide brief rationale (exception to "magic mode")

---

## Critical Rules

### **NEVER:**

- ❌ Assume information that wasn't provided - ALWAYS ask if critical details are missing
- ❌ Explain which framework was selected or why (magic mode - keep it invisible)
- ❌ Generate generic, one-size-fits-all prompts - always customize to context
- ❌ Use technical jargon in the final prompt (unless user's domain is technical)
- ❌ Ask more than 3 clarifying questions (avoid user fatigue)
- ❌ Include meta-commentary in the output ("This prompt uses...", "Note that...")
- ❌ Present output without code block formatting
- ❌ Mix languages inconsistently (if user writes in PT, respond in PT)

### **ALWAYS:**

- ✅ Analyze intent before generating (Step 1 is mandatory)
- ✅ Ask clarifying questions if critical information is ambiguous (Step 2 conditional)
- ✅ Select framework(s) based on task type and complexity (Step 3 mapping)
- ✅ Blend multiple frameworks when it improves prompt quality
- ✅ Adapt prompt length to original input complexity (simple → short, complex → detailed)
- ✅ Include output format specification in generated prompts
- ✅ Present final prompt in clean Markdown code block
- ✅ Make prompts self-contained (no dependency on external context)
- ✅ Use examples in complex prompts to illustrate expected output
- ✅ Validate prompt completeness before presenting (quality checks in Step 4.6)

---

## Example Usage

### **Example 1: Simple Vague Prompt → Clarification → RTF**

**User Input:**
```
copilot> melhore este prompt: me ajuda a escrever código python
```

**Skill Internal Process:**
1. **Analyze:** Vague (no specifics on what Python code), simple task
2. **Clarify:** Ask what kind of Python code

**Skill asks user:**
```
Qual tipo de código Python você precisa?
- [ ] Análise de dados
- [ ] Web scraping
- [ ] Automação de tarefas
- [ ] API/backend development
```

**User responds:** "Web scraping"

**Skill Output:**

````markdown
```
Você é um desenvolvedor Python especialista em web scraping.

Tarefa: Crie um script Python para fazer scraping de [especifique o site alvo].

Requisitos:
- Use BeautifulSoup ou Scrapy
- Implemente paginação e rate limiting
- Armazene dados em formato estruturado (CSV ou JSON)
- Inclua tratamento de erros para problemas de rede

Formato de saída: Código Python completo e comentado com exemplos de uso.
```
````

---

### **Example 2: Complex Clear Prompt → RODES + Chain of Thought (No Clarification)**

**User Input:**
```
copilot> crie prompt para: preciso criar um sistema de recomendação de produtos considerando histórico de compras, preferências do usuário e tendências de mercado
```

**Skill Internal Process:**
1. **Analyze:** Clear intent, complex task (ML system design), technical domain
2. **Clarify:** Skip (sufficient information)
3. **Select:** RODES (complex design) + Chain of Thought (reasoning needed)

**Skill Output:**

````markdown
```
Role: You are a senior machine learning engineer specializing in recommendation systems.

Objective: Design a product recommendation system that combines user purchase history, preferences, and market trends.

Details:
- Input data sources: user transaction logs, preference surveys, market trend APIs
- Algorithm considerations: collaborative filtering, content-based filtering, hybrid approaches
- Performance metrics: precision, recall, diversity, novelty
- Scalability: system must handle 100k+ users
- Real-time constraints: recommendations updated within 500ms

Approach step-by-step:
1. Analyze the three data sources and their relationships
2. Propose 2-3 algorithm approaches with trade-offs analysis
3. Design data pipeline architecture (ingestion, processing, serving)
4. Define evaluation metrics and A/B testing strategy
5. Outline implementation roadmap with phases

Examples:
- Show pseudocode for core recommendation logic
- Illustrate data flow diagram
- Provide sample API response structure

Sense Check: Validate that the proposed solution balances personalization with discovery, scales to production load, and incorporates real-time market trends effectively.

Output format: Technical design document with architecture diagrams, algorithm justification, and implementation roadmap.
```
````

---

### **Example 3: Ambiguous Prompt → Multi-Step Clarification → C-L-E-A-R + G-R-O-W**

**User Input:**
```
copilot> transforme em prompt: quero melhorar meu processo
```

**Skill Internal Process:**
1. **Analyze:** Highly ambiguous (which process?), unclear domain
2. **Clarify:** Required

**Skill asks:**
```
Qual processo você quer melhorar?
- [ ] Processo de trabalho/produtividade
- [ ] Processo de aprendizagem
- [ ] Processo técnico (desenvolvimento, deploy, etc.)
```

**User:** "Processo de trabalho"

**Skill asks:**
```
Qual aspecto específico do trabalho?
- [ ] Gestão de tempo
- [ ] Colaboração em equipe
- [ ] Tomada de decisões
```

**User:** "Tomada de decisões"

**Skill Internal Process:**
3. **Select:** C-L-E-A-R (goal clarity) + G-R-O-W (development/coaching)

**Skill Output:**

````markdown
```
Contexto: Tenho dificuldade em tomar decisões de forma ágil e eficaz no meu processo de trabalho.

Objetivo (Goal): Desenvolver um framework estruturado para melhorar a velocidade e qualidade das minhas decisões profissionais.

Realidade Atual (Reality):
- Decisões frequentemente atrasadas devido à análise excessiva
- Falta de critérios claros para avaliar opções
- Incerteza sobre quando decidir vs. coletar mais informações

Resultado Desejado:
- Framework de decisão consistente e reproduzível
- Critérios claros para diferentes tipos de decisões
- Redução da fadiga de decisão

Colaborativo: Quem está envolvido? (Eu, equipe, stakeholders)
Limitado: Escopo focado em decisões do dia a dia, não estratégicas de longo prazo
Emocional: Por que isso importa? (Reduzir estresse, aumentar confiança, melhorar resultados)
Apreciável: Como medir progresso? (Tempo médio de decisão, satisfação com resultados)
Refinável: Como iterar? (Revisar framework mensalmente com base em decisões passadas)

Sua tarefa:
1. Avaliar meus padrões atuais de tomada de decisão e identificar gargalos
2. Propor um framework de decisão (ex: Matriz de Eisenhower, RAPID, Árvore de Decisão)
3. Criar templates de critérios para cenários comuns de decisão
4. Desenhar processo para rastrear resultados de decisões e iterar

Opções a explorar:
- Frameworks estruturados vs. heurísticas rápidas
- Decisões individuais vs. colaborativas
- Ferramentas de apoio (checklists, scorecards, etc.)

Compromisso (Will): Implementar o framework proposto durante 30 dias e avaliar resultados.

Formato de saída: Playbook prático de tomada de decisão com templates, exemplos e métricas para medir melhoria.
```
````

---

### **Example 4: Code Debugging → Chain of Thought**

**User Input:**
```
copilot> otimize prompt: meu código Python não está funcionando, precisa debugar
```

**Skill Internal Process:**
1. **Analyze:** Debugging task, needs step-by-step reasoning
2. **Clarify:** Skip (user will provide code context later)
3. **Select:** Chain of Thought

**Skill Output:**

````markdown
```
You are an expert Python debugger.

Task: Debug the Python code provided by the user by analyzing it step-by-step.

Debugging approach:
1. Read and understand the code's intended purpose
2. Identify the error or unexpected behavior
3. Trace variable states at each execution step
4. Locate the root cause of the issue
5. Propose fix with explanation
6. Suggest preventive measures to avoid similar bugs

For each step, show your reasoning:
- What you're checking
- What you found
- Why it matters

Output format:
- **Issue identified:** [Describe the bug]
- **Root cause:** [Why it's happening]
- **Fix:** [Corrected code with comments]
- **Prevention:** [Best practices to avoid this in the future]

Include a working example to verify the fix.
```
````

---

### **Example 5: Writing/Communication → R-A-C-E**

**User Input:**
```
copilot> crie prompt para: escrever email profissional para executivos sobre mudança de estratégia
```

**Skill Internal Process:**
1. **Analyze:** Communication task, audience-aware (executives), clear goal
2. **Clarify:** Skip
3. **Select:** R-A-C-E (audience-focused communication)

**Skill Output:**

````markdown
```
Role: You are a senior communications strategist crafting executive-level messaging.

Audience: C-level executives (CEO, CFO, COO) with limited time, focused on business impact.

Context: The organization is shifting strategic direction [specify: new market, product pivot, operational model change, etc.].

Expectation: Executives need to:
- Understand the rationale for the change
- See clear business impact (risks and opportunities)
- Know their role in the transition
- Feel confident in the decision

Task: Write a professional email announcing the strategic change.

Structure:
1. **Subject line:** Concise, action-oriented (max 8 words)
2. **Opening:** State the change directly (no preamble)
3. **Rationale:** 2-3 bullet points on why (data-driven)
4. **Impact:** What changes for them (specific actions needed)
5. **Next steps:** Timeline and immediate actions
6. **Closing:** Confidence statement and contact for questions

Tone: Professional, confident, concise (max 250 words for email body).

Constraints:
- Avoid jargon and buzzwords
- Use data/metrics where possible
- Assume 2-minute read time
- Emphasize business outcomes over process

Output format: Complete email draft ready to send.
```
````

---

## Notes

This skill is **platform-agnostic** and works in any terminal context where GitHub Copilot CLI is available. It does not depend on:
- Obsidian vault structure
- Specific project configurations
- External files or templates

The skill is entirely self-contained, operating purely on user input and framework knowledge.
