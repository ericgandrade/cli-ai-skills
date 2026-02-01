# 🎯 Prompt Engineer

**Version:** 1.0.0  
**Status:** ✨ Zero-Config | 🌍 Universal

Transform raw prompts into optimized, production-ready prompts using 11 established prompting frameworks.

---

## 📋 Overview

**Prompt Engineer** is an intelligent AI skill that analyzes your intentions and automatically generates optimized prompts for Claude, ChatGPT, or any other AI model. Instead of struggling with how to phrase complex requests, simply describe what you want - the skill handles the rest.

This skill works in **"magic mode"** - it operates silently, only asking questions when absolutely necessary. You provide a rough idea, and it returns a polished, structured prompt ready to use.

### ✨ Key Features

- **🎯 Intent Analysis:** Understands what you're trying to accomplish
- **🧠 11 Frameworks:** RTF, Chain of Thought, RISEN, RODES, Chain of Density, R-A-C-E, R-I-S-E, S-T-A-R, S-O-A-P, C-L-E-A-R, G-R-O-W
- **🔄 Framework Blending:** Combines multiple frameworks when needed
- **❓ Smart Clarification:** Only asks questions when critically needed
- **📏 Adaptive Output:** Matches prompt length to task complexity
- **🌍 Universal:** Works in any project, any terminal context
- **🪄 Magic Mode:** No technical explanations - just results

---

## 🚀 Quick Start

### Invoke the Skill

Use any of these trigger phrases:

```bash
claude> melhore este prompt: [your rough prompt]
claude> otimize prompt: [your idea]
claude> refine prompt: [what you want]
claude> prompt engineering para: [task description]
claude> transforme em prompt: [concept]
claude> crie prompt para: [goal]
```

### Example 1: Simple Task

**Input:**
```bash
claude> melhore este prompt: me ajuda a escrever código python
```

**Skill asks:**
```
Qual tipo de código Python você precisa?
- [ ] Análise de dados
- [ ] Web scraping
- [ ] Automação de tarefas
- [ ] API/backend development
```

**You select:** "Web scraping"

**Output:**
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

### Example 2: Complex Task (No Clarification Needed)

**Input:**
```bash
claude> crie prompt para: sistema de recomendação de produtos com histórico de compras e tendências de mercado
```

**Output:**
````markdown
```
Role: You are a senior machine learning engineer specializing in recommendation systems.

Objective: Design a product recommendation system that combines user purchase history, preferences, and market trends.

Details:
- Input data sources: user transaction logs, preference surveys, market trend APIs
- Algorithm considerations: collaborative filtering, content-based filtering, hybrid approaches
- Performance metrics: precision, recall, diversity, novelty
- Scalability: system must handle 100k+ users

Approach step-by-step:
1. Analyze the three data sources and their relationships
2. Propose 2-3 algorithm approaches with trade-offs
3. Design data pipeline architecture
4. Define evaluation metrics
5. Outline implementation roadmap

Examples: Show pseudocode for core recommendation logic

Sense Check: Validate that the solution balances personalization with discovery and scales to production.

Output format: Technical design document with architecture diagrams and implementation roadmap.
```
````

---

### Example 3: Ambiguous Task (Skill Clarifies)

**Input:**
```bash
claude> transforme em prompt: quero melhorar meu processo
```

**Skill asks:**
```
Qual processo você quer melhorar?
- [ ] Processo de trabalho/produtividade
- [ ] Processo de aprendizagem
- [ ] Processo técnico (desenvolvimento, deploy, etc.)
```

**You select:** "Processo de trabalho"

**Skill asks:**
```
Qual aspecto específico?
- [ ] Gestão de tempo
- [ ] Colaboração em equipe
- [ ] Tomada de decisões
```

**You select:** "Tomada de decisões"

**Output:**
````markdown
```
Contexto: Tenho dificuldade em tomar decisões de forma ágil e eficaz no trabalho.

Objetivo: Desenvolver um framework estruturado para melhorar velocidade e qualidade de decisões.

Realidade Atual:
- Decisões atrasadas por análise excessiva
- Falta de critérios claros
- Incerteza sobre quando decidir vs. coletar informações

Resultado Desejado:
- Framework de decisão consistente
- Critérios claros para diferentes tipos de decisões
- Redução de fadiga de decisão

Sua tarefa:
1. Avaliar padrões atuais e identificar gargalos
2. Propor framework (Eisenhower Matrix, RAPID, Decision Tree)
3. Criar templates de critérios
4. Desenhar processo de tracking e iteração

Formato de saída: Playbook prático com templates, exemplos e métricas.
```
````

---

## 📚 Supported Frameworks

| Framework | Best For | Example Use Case |
|-----------|----------|------------------|
| **RTF** | Role-based tasks | "Act as expert developer and create..." |
| **Chain of Thought** | Step-by-step reasoning | Debugging, mathematical proofs, logic |
| **RISEN** | Structured projects | Multi-phase deliverables with clear end goal |
| **RODES** | Complex design/analysis | System architecture, research proposals |
| **Chain of Density** | Summarization | Compress articles, synthesize reports |
| **R-A-C-E** | Communication | Executive emails, presentations, storytelling |
| **R-I-S-E** | Investigation | Research questions, diagnostic analysis |
| **S-T-A-R** | Contextual situations | Problem-solving with background |
| **S-O-A-P** | Documentation | Medical records, technical logs |
| **C-L-E-A-R** | Goal-setting | OKRs, objectives, measurable targets |
| **G-R-O-W** | Coaching/development | Mentoring, skill building, growth plans |

### Framework Blending

The skill **automatically combines frameworks** when it improves results:

- **Complex technical project:** RODES + Chain of Thought
- **Leadership decision:** C-L-E-A-R + G-R-O-W
- **Strategic communication:** R-A-C-E + S-T-A-R

You don't choose the framework - the skill selects (and blends) the best fit based on your task.

---

## 🎯 How It Works

```
User Input (rough prompt)
         ↓
┌────────────────────────┐
│ 1. Analyze Intent      │  What is the user trying to do?
│    - Task type         │  Coding? Writing? Analysis? Design?
│    - Complexity        │  Simple, moderate, complex?
│    - Clarity           │  Clear or ambiguous?
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│ 2. Clarify (Optional)  │  Only if critically needed
│    - Ask 2-3 questions │  Multiple choice when possible
│    - Fill missing gaps │  
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│ 3. Select Framework(s) │  Silent selection
│    - Map task → framework
│    - Blend if needed   │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│ 4. Generate Prompt     │  Apply framework rules
│    - Add role/context  │  
│    - Structure task    │  
│    - Define format     │
│    - Add examples      │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│ 5. Output              │  Clean, copy-ready
│    Markdown code block │  No explanations
└────────────────────────┘
```

---

## 🎨 Use Cases

### Coding

```bash
claude> otimize prompt: criar API REST em Python
```

→ Generates structured prompt with role, requirements, output format, examples

---

### Writing

```bash
claude> crie prompt para: escrever artigo técnico sobre microservices
```

→ Generates audience-aware prompt with structure, tone, and content guidelines

---

### Analysis

```bash
claude> refine prompt: analisar dados de vendas e identificar tendências
```

→ Generates step-by-step analytical framework with visualization requirements

---

### Decision Making

```bash
claude> melhore este prompt: preciso decidir entre tecnologias A e B
```

→ Generates decision framework with criteria, trade-offs, and validation

---

### Learning

```bash
claude> transforme em prompt: aprender machine learning do zero
```

→ Generates learning path prompt with phases, resources, and milestones

---

## ❓ FAQ

### Q: Does this skill work outside of Obsidian vaults?
**A:** Yes! It's a **universal skill** that works in any terminal context. It doesn't depend on vault structure, project configuration, or external files.

---

### Q: Do I need to know prompting frameworks?
**A:** No. The skill knows all 11 frameworks and selects the best one(s) automatically based on your task.

---

### Q: Will the skill explain which framework it used?
**A:** No. It operates in "magic mode" - you get the polished prompt without technical explanations. If you want to know, you can ask explicitly.

---

### Q: How many questions will the skill ask me?
**A:** Maximum 2-3 questions, and only when information is critically missing. Most of the time, it generates the prompt directly.

---

### Q: Can I customize the frameworks?
**A:** The skill uses standard framework definitions. You can't customize them, but you can provide additional constraints in your input (e.g., "crie prompt curto para...").

---

### Q: Does it support languages other than English?
**A:** Yes. If you provide input in Portuguese, it generates the prompt in Portuguese. Same for English or mixed inputs.

---

### Q: What if I don't like the generated prompt?
**A:** You can ask the skill to refine it: "make it shorter", "add more examples", "focus on X aspect", etc.

---

### Q: Can I use this for any AI model (Claude, ChatGPT, Gemini)?
**A:** Yes. The prompts are model-agnostic and work with any conversational AI.

---

## 🔧 Installation (Global Setup)

This skill is designed to work **globally** across all your projects.

### Option 1: Use from Repository

1. Clone the repository:
   ```bash
   git clone https://github.com/eric.andrade/cli-ai-skills.git
   ```

2. Configure Claude to load skills globally:
   ```bash
   # Add to ~/.claude/config.json
   {
     "skills": {
       "directories": [
         "/path/to/cli-ai-skills/.claude/skills"
       ]
     }
   }
   ```

### Option 2: Copy to Global Skills Directory

```bash
cp -r /path/to/cli-ai-skills/.claude/skills/prompt-engineer ~/.claude/global-skills/
```

Then configure:
```bash
# Add to ~/.claude/config.json
{
  "skills": {
    "directories": [
      "~/.claude/global-skills"
    ]
  }
}
```

---

## 📖 Learn More

- **[Skill Development Guide](../../resources/skills-development.md)** - Learn how to create your own skills
- **[SKILL.md](./SKILL.md)** - Full technical specification of this skill
- **[Repository README](../../README.md)** - Overview of all available skills

---

## 📄 Version

**v1.0.0** | Zero-Config | Universal  
*Works in any project, any context, any terminal.*
