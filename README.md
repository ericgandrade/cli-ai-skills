# 🤖 CLI AI Skills

Reusable AI skills for **GitHub Copilot CLI** and **Claude Code** that work globally across all your projects.

---

## 📦 Available Skills

### 🎯 **prompt-engineer** v1.0.0

Transform raw prompts into optimized prompts using 11 established frameworks (RTF, Chain of Thought, RISEN, RODES, Chain of Density, R-A-C-E, R-I-S-E, S-T-A-R, S-O-A-P, C-L-E-A-R, G-R-O-W).

**Status:** ✨ Zero-Config | 🌍 Universal

**Triggers:**
- `melhore este prompt`
- `otimize prompt`
- `refine prompt`
- `prompt engineering`
- `transforme em prompt`
- `crie prompt para`

**Features:**
- 🎯 Intelligent intent analysis
- 🔄 Framework blending
- ❓ Interactive clarification when ambiguous
- 📏 Adaptive output (short/long based on context)
- 🪄 Magic mode (no technical explanations)

**[→ Documentation](./.github/skills/prompt-engineer/README.md)**

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
