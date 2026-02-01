# Manual de Desenvolvimento de Skills

Guia de referência para criar e manter Skills para **Claude Code** e **GitHub Copilot**.

## Referências Oficiais

| Ferramenta | Documentação |
|------------|--------------|
| Claude Code | https://code.claude.com/docs/en/skills |
| GitHub Copilot | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills |
| Agent Skills Standard | https://agentskills.io |

---

## Visão Geral

Skills são instruções em Markdown que ensinam a IA a executar tarefas específicas. Ambas as ferramentas seguem o **Agent Skills Open Standard**, compartilhando estrutura similar.

### O que é uma Skill

- Arquivo `SKILL.md` com instruções detalhadas
- Frontmatter YAML com metadados (name, description)
- Workflow passo a passo para a IA seguir
- Pode incluir arquivos auxiliares (scripts, templates)

---

## Zero-Config Design Principles

All skills in this vault follow a **zero-config philosophy**:

### Core Principles

1. **No hardcoded paths** - Skills discover vault structure at runtime
2. **No hardcoded values** - Skills extract valid values from templates/files
3. **No configuration files** - Skills work out of the box
4. **User interaction** - Skills ask when ambiguous, never assume
5. **Vault-agnostic** - Skills work with PARA, Zettelkasten, or custom structures

### Step 0: Discovery (Required for most skills)

**Most skills should start with a discovery step**, but it may be optional for skills that don't depend on vault structure.

**When Step 0 is REQUIRED:**
- Skill creates/validates notes based on templates
- Skill needs to know vault folder structure
- Skill extracts valid values from files
- Examples: `note-creator`, `note-validator`

**When Step 0 is OPTIONAL:**
- Skill works purely with note content
- Skill doesn't need templates or folder discovery
- Example: `wikilink-validator` (optional - only for context)

**Standard Discovery Pattern:**

```markdown
### Step 0: Discover Vault Structure

Before executing the main workflow, discover the vault configuration:

**Templates folder:**
- Search for directories matching: `*emplate*`, `*Template*`, `Templates/`
- If multiple found, ask user which to use
- If none found, ask user for path or offer to work without templates

**Available note types:**
- Scan template folder for `template-*.md` files
- Extract type from filename: `template-task.md` → type: task
- Build dynamic list of supported types

**Valid field values:**
- Parse template frontmatter for enum values
- Example: `status: backlog | in-progress | done` → extract array
- Use these for validation and prompts

**Vault folders:**
- Search for inbox: `*Inbox*`, `*inbox*`, `*INBOX*`
- Search for projects: `*Project*`, `*project*`, `PROJECTS/`
- Pattern-based detection, not exact matches
```

**Optional Discovery Pattern:**

```markdown
### Step 0: Discover Vault Structure (Optional)

**Note:** This skill is less dependent on vault structure but can benefit from discovery.

**Optional discovery:**
- [Only discover what's needed for enhanced functionality]
- [Skill works without this information]
```

### Anti-Patterns to Avoid

❌ **Never do:**
- Hardcode paths: `00-Inbox/`, `04-Resources/Templates/`
- Hardcode values: `status: ["backlog", "in-progress", "done"]`
- Hardcode keywords: `if content.includes("reunião")`
- Assume folder structure: `{vault}/02-Projects/`

✅ **Always do:**
- Discover at runtime: `find templates with pattern`
- Extract from files: `parse enum from template YAML`
- Use patterns: `detect by structure (time markers + names)`
- Ask user: `confirm when multiple options found`

---

## Claude Code Skills

### Estrutura de Diretórios

```
.claude/
└── skills/
    └── <nome-da-skill>/
        ├── SKILL.md          ← Obrigatório (maiúsculo)
        ├── scripts/          ← Opcional
        └── templates/        ← Opcional
```

### Localização

| Tipo | Caminho | Escopo |
|------|---------|--------|
| Projeto | `.claude/skills/` | Apenas este projeto |
| Pessoal | `~/.claude/skills/` | Todos os projetos |

### Formato do SKILL.md

```markdown
---
name: nome-da-skill
description: Use when user asks to "trigger phrase 1", "trigger phrase 2", or when [context]. Does [what the skill does].
---

# Nome da Skill

Descrição breve do propósito.

## Purpose

Explicação detalhada do objetivo.

## When to Use

- Situação 1
- Situação 2

## Workflow

### 1. Primeiro Passo

Instruções detalhadas...

### 2. Segundo Passo

Instruções detalhadas...

## Restrictions

- Nunca fazer X
- Sempre fazer Y

## Example Usage

\`\`\`
User: exemplo de comando
Assistant: [descrição da resposta esperada]
\`\`\`
```

### Frontmatter - Campos

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `name` | Sim | Identificador único (lowercase, hyphens) |
| `description` | Sim | Quando usar + o que faz. **Triggers vão aqui.** |

### Ferramentas Disponíveis

Referencie estas ferramentas nas instruções:

| Ferramenta | Uso |
|------------|-----|
| `Read` | Ler arquivos |
| `Edit` | Editar arquivos existentes |
| `Write` | Criar novos arquivos |
| `Bash` | Executar comandos shell |
| `Glob` | Buscar arquivos por padrão |
| `Grep` | Buscar conteúdo em arquivos |

### Invocação

```bash
# Automática (Claude detecta pelo contexto)
"adicione wikilinks nesta nota"

# Direta (slash command)
/nome-da-skill
/nome-da-skill argumento
```

---

## GitHub Copilot Skills

### Estrutura de Diretórios

```
.github/
└── skills/
    └── <nome-da-skill>/
        ├── SKILL.md          ← Obrigatório (maiúsculo)
        ├── README.md         ← Opcional (documentação)
        ├── scripts/          ← Opcional
        └── templates/        ← Opcional
```

### Localização

| Tipo | Caminho | Escopo |
|------|---------|--------|
| Projeto | `.github/skills/` | Apenas este repositório |
| Pessoal | `~/.copilot/skills/` | Todos os projetos |

### Formato do SKILL.md

```markdown
---
name: nome-da-skill
description: Describes what the skill does and when Copilot should use it. Include trigger phrases here.
---

# Nome da Skill

Descrição breve do propósito.

## Purpose

Explicação detalhada do objetivo.

## When to Use

- Situação 1
- Situação 2

## Workflow

### 1. Primeiro Passo

Instruções detalhadas...

### 2. Segundo Passo

Instruções detalhadas...

## Restrictions

- Nunca fazer X
- Sempre fazer Y

## Example Usage

\`\`\`
User: exemplo de comando
Assistant: [descrição da resposta esperada]
\`\`\`
```

### Frontmatter - Campos

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `name` | Sim | Identificador único (lowercase, hyphens) |
| `description` | Sim | Quando usar + o que faz |

### Ferramentas Disponíveis

Referencie estas ferramentas nas instruções:

| Ferramenta | Uso |
|------------|-----|
| `view` | Ler arquivos |
| `edit` | Editar arquivos |
| `run` | Executar comandos shell |

---

## Tabela Comparativa

| Aspecto | Claude Code | GitHub Copilot |
|---------|-------------|----------------|
| Diretório projeto | `.claude/skills/` | `.github/skills/` |
| Diretório pessoal | `~/.claude/skills/` | `~/.copilot/skills/` |
| Arquivo | `SKILL.md` (maiúsculo) | `SKILL.md` (maiúsculo) |
| Frontmatter | `name`, `description` | `name`, `description` |
| Ler arquivo | `Read` | `view` |
| Editar arquivo | `Edit` | `edit` |
| Executar comando | `Bash` | `run` |

---

## Sincronização entre Ferramentas

Quando a mesma skill existir em ambas as ferramentas, siga este processo:

### Checklist de Validação

Antes de finalizar, verifique:

- [ ] Nome (`name`) é idêntico em ambas
- [ ] Descrição (`description`) tem o mesmo significado
- [ ] Seções de workflow são equivalentes
- [ ] Restrições são as mesmas
- [ ] Exemplos cobrem os mesmos casos de uso

### Extended Synchronization Checklist

Before finalizing synchronization:

**SKILL.md Parity:**
- [ ] Frontmatter `name` is identical
- [ ] Frontmatter `description` has same triggers and meaning
- [ ] Step 0 (Discovery) workflow is identical
- [ ] Main workflow steps are functionally equivalent
- [ ] Restrictions are the same
- [ ] Examples cover same use cases
- [ ] Tool references are correctly converted

**README.md Parity:**
- [ ] Overview section is identical (except platform name)
- [ ] Zero-Config Discovery section is identical
- [ ] Usage examples have correct prompts (`copilot>` vs `claude>`)
- [ ] Version numbers match
- [ ] Compatibility field is platform-specific
- [ ] Zero-Config footer describes same features

**Index Updates:**
- [ ] Both index READMEs updated
- [ ] Skill description consistent across all 4 files (2 SKILL.md + 2 index READMEs)

### Regras de Conversão

Ao copiar entre ferramentas, ajuste as referências de ferramentas:

| De Claude Code | Para GitHub Copilot |
|----------------|---------------------|
| `Read tool` | `view tool` |
| `Edit tool` | `edit tool` |
| `Write tool` | `edit tool` (criar) |
| `Bash tool` | `run tool` |
| `Glob tool` | descrever busca manualmente |
| `Grep tool` | descrever busca manualmente |

| De GitHub Copilot | Para Claude Code |
|-------------------|------------------|
| `view tool` | `Read tool` |
| `edit tool` | `Edit tool` |
| `run tool` | `Bash tool` |

### Processo de Sincronização

1. **Identifique a versão mais atual** - Qual foi editada por último?
2. **Compare o conteúdo** - Use diff ou leia ambas
3. **Unifique o workflow** - Mescle melhorias de ambas
4. **Ajuste ferramentas** - Converta nomes conforme tabela acima
5. **Valide com checklist** - Confirme paridade

### Instrução para IA

Ao criar ou atualizar uma skill:

```
Verifique se a skill existe em ambas as localizações:
- .claude/skills/<nome>/SKILL.md
- .github/skills/<nome>/SKILL.md

Se existir em ambas:
1. Compare o conteúdo de workflow e restrições
2. Se houver diferenças significativas, pergunte qual versão usar como base
3. Sincronize o conteúdo, ajustando apenas os nomes das ferramentas
4. Mantenha ambas as versões funcionalmente idênticas

Se existir em apenas uma:
1. Pergunte se deve criar na outra ferramenta também
2. Se sim, copie e ajuste os nomes das ferramentas
```

---

## Workflow de Criação

### Criar Nova Skill (Processo Completo)

1. **Defina o propósito** - O que a skill faz?
2. **Liste os triggers** - Quais frases ativam a skill?
3. **Design Step 0 (Discovery)** - O que precisa descobrir no vault?
4. **Escreva o workflow** - Passos detalhados (após discovery)
5. **Adicione restrições** - O que nunca fazer (anti-hardcoding)
6. **Crie exemplos** - Casos de uso reais
7. **Escreva SKILL.md** - Para ambas as plataformas
8. **Escreva README.md** - Para ambas as plataformas (com zero-config)
9. **Atualize índices** - Ambos os README.md de índice
10. **Valide** - Checklist completo (ver seção Testing & Validation)
11. **Teste manualmente** - Ative skill e verifique comportamento
12. **Commit** - Mensagem semântica com versão

### Estrutura Mínima

```bash
# Claude Code
mkdir -p .claude/skills/minha-skill
touch .claude/skills/minha-skill/SKILL.md

# GitHub Copilot
mkdir -p .github/skills/minha-skill
touch .github/skills/minha-skill/SKILL.md
```

### Template Inicial - SKILL.md

Use este template como ponto de partida:

```markdown
---
name: minha-skill
description: Use when user asks to "[trigger 1]", "[trigger 2]", or when [context]. [What the skill does in one sentence].
triggers:
  - trigger phrase 1
  - trigger phrase 2
  - trigger phrase 3
---

# Minha Skill

[One-sentence description of what the skill does]

## Purpose

[Detailed explanation of the goal and use cases]

## When to Use

- [Situation 1 - be specific]
- [Situation 2 - be specific]
- [Situation 3 - optional]

## Workflow

### Step 0: Discover Vault Structure

**Before executing main workflow**, discover runtime configuration:

**[Resource 1] discovery:**
- Search for [pattern or location]
- If multiple found, ask user: "[Question]?"
- If none found, [fallback behavior]

**[Resource 2] discovery:**
- [Discovery logic]
- [Extraction method]
- [Handling ambiguity]

**Valid values extraction:**
- Parse [source] for [data]
- Extract: `[example]` → [result]
- Build dynamic list: [usage]

---

### Step 1: [First Main Step]

[Detailed instructions using discovered values]

**Input:**
- [What the step receives]

**Process:**
- [What to do]
- Use discovered [resource] from Step 0
- Never hardcode [what to avoid]

**Output:**
- [What the step produces]

---

### Step 2: [Second Main Step]

[Continue workflow...]

---

## Critical Rules

**NEVER:**
- ❌ Hardcode paths (e.g., `00-Inbox/`, `Templates/`)
- ❌ Hardcode values (e.g., `status: ["backlog", "done"]`)
- ❌ Hardcode keywords (e.g., `if text.includes("meeting")`)
- ❌ Assume folder structure
- ❌ Make changes without user confirmation

**ALWAYS:**
- ✅ Run Step 0 (Discovery) first
- ✅ Extract values from templates/files at runtime
- ✅ Use pattern-based detection (not keywords)
- ✅ Ask user when ambiguous
- ✅ Provide preview before making changes

## Example Usage

\`\`\`
User: [example command matching trigger]

Agent: [Step-by-step response]

1. **Discovery Phase**
   - Found templates at: [path]
   - Detected types: [list]
   
2. **Execution Phase**
   - [Action taken]
   - [Result produced]

3. **Confirmation**
   - Preview: [show what will change]
   - Confirm? (Yes/No) > Yes

✅ [Success message]
\`\`\`
```

---

## README.md Requirements

### When to Create README

**ALWAYS create a README.md** for every skill in both locations:
- `.github/skills/<skill-name>/README.md`
- `.claude/skills/<skill-name>/README.md`

### README.md Structure

Each skill README must include:

1. **📋 Overview** - What the skill does
2. **✨ Zero-Config Discovery** - How auto-discovery works
3. **🚀 How to Use** - Activation commands and examples
4. **📊 [Type] Supported** - What the skill handles (dynamic list)
5. **🔄 Customization Examples** - Works with custom templates/structure
6. **🔧 Integration** - How it chains with other skills
7. **🐛 Troubleshooting** - Common issues
8. **📖 Resources** - Links to related skills
9. **Version info** - Version, date, platform, zero-config status

### Platform-Specific Adaptations

When copying README between platforms:

**GitHub Copilot → Claude Code:**
- Replace `copilot>` with `claude>`
- Replace "GitHub Copilot CLI" with "Claude Code CLI"
- Keep all other content identical

**Example replacement:**
```bash
# Before
copilot> create note from "text"
**Compatibility:** GitHub Copilot CLI

# After
claude> create note from "text"
**Compatibility:** Claude Code CLI
```

### README Version Footer

Always include at the end:

```markdown
---

**Version:** X.Y.Z  
**Last updated:** YYYY-MM-DD  
**Compatibility:** [GitHub Copilot CLI | Claude Code CLI]
**Zero-Config:** ✅ [Description of what's auto-discovered]
```

### Index README Updates

When creating/updating a skill, **always update index READMEs**:

**Files to update:**
- `.github/skills/README.md`
- `.claude/skills/README.md`

**What to add:**
- Skill name and description
- Trigger phrases
- Quick usage example
- Key features (with zero-config highlights)

---

## Versioning Guidelines

Skills follow **Semantic Versioning** (SemVer):

### Version Format: X.Y.Z

- **X (Major)** - Breaking changes, incompatible workflow changes
- **Y (Minor)** - New features, backward-compatible additions
- **Z (Patch)** - Bug fixes, documentation updates, minor tweaks

### When to Increment

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Added zero-config discovery | Major (1.x.x → 2.0.0) | Removed hardcoding, added Step 0 |
| Added new workflow step | Minor (2.0.x → 2.1.0) | Added duplicate detection |
| Fixed typo in SKILL.md | Patch (2.1.0 → 2.1.1) | Corrected description text |
| Updated README examples | Patch (2.1.1 → 2.1.2) | Improved user guide |
| Changed trigger phrases | Major (2.x.x → 3.0.0) | Users must adapt commands |
| Added optional parameter | Minor (2.1.x → 2.2.0) | Backward-compatible |

### Version Locations

Update version in:
1. README.md footer (both `.github` and `.claude`)
2. Git commit message (e.g., `feat(skill): v2.0.0 - zero-config discovery`)
3. Optional: Frontmatter in SKILL.md (if you want to track it there)

### Example Version History

```markdown
## Changelog

### 2.0.0 (2026-02-01)
- **Breaking:** Removed all hardcoded paths and values
- **Added:** Step 0 Discovery workflow
- **Added:** Pattern-based type detection
- **Added:** Zero-Config README sections

### 1.1.0 (2026-01-15)
- **Added:** Duplicate detection before creation
- **Improved:** Auto-extraction of dates

### 1.0.0 (2025-12-20)
- **Initial release**
```

---

## Testing & Validation

### Pre-Commit Checklist

Before committing a new or updated skill, verify:

**SKILL.md:**
- [ ] Frontmatter has `name` and `description`
- [ ] Triggers are listed in `description`
- [ ] Step 0 (Discovery) exists and is complete
- [ ] Workflow steps are numbered and detailed
- [ ] No hardcoded paths, values, or keywords
- [ ] Restrictions section exists
- [ ] Example usage provided

**README.md:**
- [ ] Created for both `.github` and `.claude` versions
- [ ] Zero-Config Discovery section exists
- [ ] Customization Examples section exists
- [ ] Version footer is present and correct
- [ ] Platform-specific prompts are correct (`copilot>` vs `claude>`)

**Index READMEs:**
- [ ] Skill listed in `.github/skills/README.md`
- [ ] Skill listed in `.claude/skills/README.md`
- [ ] Trigger phrases match SKILL.md
- [ ] Quick example provided

**Synchronization:**
- [ ] SKILL.md exists in both `.github` and `.claude`
- [ ] README.md exists in both `.github` and `.claude`
- [ ] Workflow is functionally identical (only tool names differ)
- [ ] Tool references converted correctly (Read↔view, Bash↔run, etc.)

### Manual Testing

Test the skill manually before committing:

```bash
# 1. Activate Claude Code or GitHub Copilot
# 2. Try trigger phrases:
"create note from sample text"
"validate note path/to/note.md"
"add wikilinks"

# 3. Verify skill activates correctly
# 4. Check discovery step runs
# 5. Verify no hardcoded errors (paths not found, etc.)
# 6. Confirm output is correct
```

### Validation Script (Optional)

Create a validation script:

```bash
#!/bin/bash
# validate-skill.sh

SKILL_NAME=$1

echo "Validating skill: $SKILL_NAME"

# Check SKILL.md exists
[ -f ".github/skills/$SKILL_NAME/SKILL.md" ] || echo "❌ Missing .github SKILL.md"
[ -f ".claude/skills/$SKILL_NAME/SKILL.md" ] || echo "❌ Missing .claude SKILL.md"

# Check README.md exists
[ -f ".github/skills/$SKILL_NAME/README.md" ] || echo "❌ Missing .github README.md"
[ -f ".claude/skills/$SKILL_NAME/README.md" ] || echo "❌ Missing .claude README.md"

# Check for hardcoded paths
grep -r "00-Inbox\|02-Projects\|04-Resources" ".github/skills/$SKILL_NAME/SKILL.md" && echo "⚠️ Hardcoded paths found"

# Check index READMEs
grep "$SKILL_NAME" ".github/skills/README.md" > /dev/null || echo "❌ Not listed in .github index"
grep "$SKILL_NAME" ".claude/skills/README.md" > /dev/null || echo "❌ Not listed in .claude index"

echo "✅ Validation complete"
```

---

## Troubleshooting

### Skill não aparece no Claude Code

1. Verifique se o arquivo é `SKILL.md` (maiúsculo)
2. Verifique se está em `.claude/skills/<nome>/SKILL.md`
3. Reinicie o Claude Code
4. Execute `/skills` para listar

### Skill não aparece no GitHub Copilot

1. Verifique se o arquivo é `SKILL.md` (maiúsculo)
2. Verifique se está em `.github/skills/<nome>/SKILL.md`
3. Recarregue a janela do VS Code
4. Verifique se Copilot está ativo

### Skill não é ativada automaticamente

1. Revise a `description` - inclui triggers claros?
2. A descrição explica QUANDO usar?
3. Teste invocação direta: `/nome-da-skill`

---

## Skills deste Projeto

| Skill | Claude Code | GitHub Copilot |
|-------|-------------|----------------|
| wikilink-validator | `.claude/skills/wikilink-validator/SKILL.md` | `.github/skills/wikilink-validator/SKILL.md` |
| note-validator | `.claude/skills/note-validator/SKILL.md` | `.github/skills/note-validator/SKILL.md` |
| note-creator | `.claude/skills/note-creator/SKILL.md` | `.github/skills/note-creator/SKILL.md` |
