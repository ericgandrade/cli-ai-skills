# 🤖 CLI AI Skills

Reusable AI skills for **GitHub Copilot CLI** and **Claude Code** that work globally across all your projects.

---

## 📦 Available Skills

### 🎯 **prompt-engineer** v1.0.0

Transform raw prompts into optimized prompts using **11 established frameworks**.

**Status:** ✨ Zero-Config | 🌍 Universal

**Supported Frameworks:**
- **RTF** (Role-Task-Format) - Role-based tasks
- **Chain of Thought** - Step-by-step reasoning
- **RISEN** (Role, Instructions, Steps, End goal, Narrowing) - Structured projects
- **RODES** (Role, Objective, Details, Examples, Sense check) - Complex design
- **Chain of Density** - Summarization and compression
- **R-A-C-E** (Role, Audience, Context, Expectation) - Communication tasks
- **R-I-S-E** (Research, Investigate, Synthesize, Evaluate) - Investigation
- **S-T-A-R** (Situation, Task, Action, Result) - Contextual problem-solving
- **S-O-A-P** (Subjective, Objective, Assessment, Plan) - Structured documentation
- **C-L-E-A-R** (Collaborative, Limited, Emotional, Appreciable, Refinable) - Goal-setting
- **G-R-O-W** (Goal, Reality, Options, Will) - Coaching and development

**Triggers:**
- `melhore este prompt`
- `otimize prompt`
- `refine prompt`
- `prompt engineering`
- `transforme em prompt`
- `crie prompt para`

**Features:**
- 🎯 Intelligent intent analysis
- 🔄 Framework blending (combines 2-3 frameworks when needed)
- ❓ Interactive clarification when ambiguous
- 📏 Adaptive output (short/long based on context)
- 🪄 Magic mode (no technical explanations)

**[→ Full Documentation](./.github/skills/prompt-engineer/README.md)**

---

### 🔮 Coming Soon

More skills are in development! This library will grow with:
- 📝 Code review and analysis skills
- 📚 Documentation generation skills
- 🧪 Testing and validation skills
- 🔍 Codebase exploration skills
- And more...

**Want to contribute?** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📚 Frameworks Reference

The skills in this library leverage established prompting frameworks to optimize AI interactions. Below is a comprehensive reference of all frameworks used.

### Prompt Engineering Frameworks (Used by `prompt-engineer`)

| Framework | Acronym | Best For | Key Components |
|-----------|---------|----------|----------------|
| **Role-Task-Format** | RTF | Role-based tasks requiring specific expertise | Role → Task → Format |
| **Chain of Thought** | CoT | Step-by-step reasoning, debugging, logic | Problem → Steps → Solution |
| **RISEN** | RISEN | Structured multi-phase projects | Role, Instructions, Steps, End goal, Narrowing |
| **RODES** | RODES | Complex design and system architecture | Role, Objective, Details, Examples, Sense check |
| **Chain of Density** | CoD | Summarization and iterative compression | Verbose → Iterative compression → Dense |
| **R-A-C-E** | RACE | Communication and presentations | Role, Audience, Context, Expectation |
| **R-I-S-E** | RISE | Investigation and systematic analysis | Research, Investigate, Synthesize, Evaluate |
| **S-T-A-R** | STAR | Contextual problem-solving | Situation, Task, Action, Result |
| **S-O-A-P** | SOAP | Structured documentation and records | Subjective, Objective, Assessment, Plan |
| **C-L-E-A-R** | CLEAR | Goal-setting and measurable objectives | Collaborative, Limited, Emotional, Appreciable, Refinable |
| **G-R-O-W** | GROW | Coaching and personal development | Goal, Reality, Options, Will |

### Framework Selection Logic

The **prompt-engineer** skill analyzes your input and:
1. **Detects task type** (coding, writing, analysis, design, etc.)
2. **Identifies complexity** (simple, moderate, complex)
3. **Selects primary framework** (best match for your task)
4. **Blends secondary frameworks** when it improves results

**Common Framework Blends:**
- **RODES + Chain of Thought** → Complex technical projects requiring step-by-step planning
- **C-L-E-A-R + G-R-O-W** → Leadership and personal development goals
- **R-A-C-E + S-T-A-R** → Strategic communication with rich context

**You never choose the framework manually** - the skill does it automatically based on your needs.

### Further Reading

- **[Prompt Engineering Guide](https://www.promptingguide.ai)** - Comprehensive guide to prompting techniques
- **[Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)** - Claude-specific best practices
- **[OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)** - GPT best practices
- **[PromptCowboy](https://promptcowboy.com/)** - Framework-driven prompt optimization inspiration

---

## 🚀 Installation

### Global Setup (GitHub Copilot CLI)

1. **Clone this repository:**
   ```bash
   git clone https://github.com/eric.andrade/cli-ai-skills.git
   cd cli-ai-skills
   ```

2. **Configure Copilot to use skills globally:**

   Edit or create `~/.copilot/config.json`:
   ```json
   {
     "skills": {
       "directories": [
         "/absolute/path/to/cli-ai-skills/.github/skills"
       ]
     }
   }
   ```

   Replace `/absolute/path/to/` with your actual path.

3. **Verify installation:**
   ```bash
   copilot> list skills
   ```

   You should see `prompt-engineer` in the list.

---

### Global Setup (Claude Code)

1. **Clone this repository** (if you haven't already):
   ```bash
   git clone https://github.com/eric.andrade/cli-ai-skills.git
   cd cli-ai-skills
   ```

2. **Configure Claude to use skills globally:**

   Edit or create `~/.claude/config.json`:
   ```json
   {
     "skills": {
       "directories": [
         "/absolute/path/to/cli-ai-skills/.claude/skills"
       ]
     }
   }
   ```

   Replace `/absolute/path/to/` with your actual path.

3. **Verify installation:**
   ```bash
   claude> list skills
   ```

   You should see `prompt-engineer` in the list.

---

## 🎯 Quick Start

### Example: Improve a Simple Prompt

**Input:**
```bash
copilot> melhore este prompt: me ajuda a escrever código python
```

**Skill asks:**
```
Qual tipo de código Python você precisa?
- [ ] Análise de dados
- [ ] Web scraping
- [ ] Automação de tarefas
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

Formato de saída: Código Python completo e comentado com exemplos de uso.
```
````

---

## 📚 Resources

### For Users

- **[Prompt Engineer Documentation](./.github/skills/prompt-engineer/README.md)** - Full user guide for the prompt-engineer skill

### For Developers

- **[Skills Development Guide](./resources/skills-development.md)** - Learn how to create your own AI skills
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute new skills to this repository

---

## 🛠️ Creating Your Own Skills

Want to create your own AI skills? Check out our comprehensive guide:

**[→ Skills Development Guide](./resources/skills-development.md)**

Topics covered:
- ✅ Zero-Config Design Principles
- ✅ Skill structure and conventions
- ✅ Platform synchronization (Copilot ↔ Claude)
- ✅ README requirements
- ✅ Versioning guidelines
- ✅ Testing & validation

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Create new skills** following the [Skills Development Guide](./resources/skills-development.md)
2. **Improve existing skills** with better detection, examples, or documentation
3. **Report issues** if you find bugs or have feature requests
4. **Share feedback** on how you're using these skills

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) for details.

You're free to:
- ✅ Use these skills commercially
- ✅ Modify and distribute
- ✅ Create derivative works

Attribution appreciated but not required.

---

## 🌟 Why Use Global Skills?

### Traditional Approach
```
project-A/.github/skills/  ← skill duplicated
project-B/.github/skills/  ← skill duplicated
project-C/.github/skills/  ← skill duplicated
```

**Problems:**
- Skills duplicated across projects
- Updates require changing every project
- Inconsistent skill versions

### Global Skills Approach
```
~/.copilot/config.json  →  points to  →  cli-ai-skills/
All projects share the same skill library
```

**Benefits:**
- ✅ Single source of truth
- ✅ Update once, affects all projects
- ✅ Skills work everywhere (not project-specific)

---

## 📖 Learn More

- **GitHub Copilot CLI:** [https://github.com/github/gh-copilot](https://github.com/github/gh-copilot)
- **Claude Code:** [https://claude.ai/code](https://claude.ai/code)
- **Prompting Frameworks:**
  - [RTF (Role-Task-Format)](https://www.promptingguide.ai/techniques/rtf)
  - [Chain of Thought](https://www.promptingguide.ai/techniques/cot)
  - [More frameworks...](./resources/frameworks.md)

---

## 🙏 Acknowledgments

Inspired by:
- **[PromptCowboy](https://promptcowboy.com/)** - For framework-driven prompt optimization
- **[Anthropic's Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)**
- **The AI CLI community** for sharing best practices

---

**Built with ❤️ by [Eric Andrade](https://github.com/eric.andrade)**

*Version 1.0.0 | Last updated: February 2025*
