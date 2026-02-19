# 📚 Guia de Versionamento - claude-superskills

## 🎯 Conceitos Fundamentais

### Latest (npm tag)
- **O que é:** Tag padrão do npm que aponta para a versão estável mais recente
- **Quando muda:** Toda vez que você publica uma nova versão via `npm publish`
- **Como usuários acessam:** `npm install claude-superskills` ou `npx claude-superskills`

### Main (Git branch)
- **O que é:** Branch principal do código-fonte no GitHub
- **Estado:** Pode estar "à frente" da versão publicada no npm
- **Relação com npm:** Código em `main` → tag git `v*` → GitHub Actions → npm publish

### Semantic Versioning (SemVer)

Formato: `MAJOR.MINOR.PATCH`

```
v1.2.3
 │ │ │
 │ │ └─ PATCH: Bug fixes (1.2.3 → 1.2.4)
 │ └─── MINOR: Novas features, compatível (1.2.3 → 1.3.0)
 └───── MAJOR: Breaking changes (1.2.3 → 2.0.0)
```

## 🔄 Workflow de Release

### 1. Bug Fix (PATCH: 1.0.0 → 1.0.1)

**Quando usar:**
- Correção de bugs
- Melhorias de performance
- Correções de documentação

**Passos:**

```bash
# 1. Fazer commit das correções
git add .
git commit -m "fix: corrige erro no comando install"

# 2. Bumpar versão (cria commit + tag)
cd cli-installer
npm version patch

# 3. Atualizar CHANGELOG
vim CHANGELOG.md
# Adicionar entrada da versão

# 4. Commit CHANGELOG
git add CHANGELOG.md
git commit --amend --no-edit

# 5. Push (aciona GitHub Actions)
git push origin main --tags

# 6. Aguardar publicação (~2 min)
# Verificar: https://github.com/ericgandrade/claude-superskills/actions
```

### 2. Nova Feature (MINOR: 1.0.0 → 1.1.0)

**Quando usar:**
- Novo comando
- Nova funcionalidade
- Melhorias que mantêm compatibilidade

**Passos:**

```bash
# 1. Fazer commit da feature
git add .
git commit -m "feat: adiciona comando 'info' para mostrar detalhes de skills"

# 2. Bumpar versão
cd cli-installer
npm version minor

# 3. Atualizar CHANGELOG
vim CHANGELOG.md

# 4. Commit CHANGELOG
git add CHANGELOG.md
git commit --amend --no-edit

# 5. Push
git push origin main --tags
```

### 3. Breaking Change (MAJOR: 1.0.0 → 2.0.0)

**Quando usar:**
- Mudanças que quebram API existente
- Remoção de comandos/features
- Reorganização estrutural incompatível

**Passos:**

```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "feat!: remove comando 'uninstall', use 'remove' agora

BREAKING CHANGE: comando 'uninstall' foi removido, use 'remove' no lugar"

# 2. Bumpar versão
cd cli-installer
npm version major

# 3. Atualizar CHANGELOG com BREAKING CHANGES destacadas
vim CHANGELOG.md

# 4. Commit CHANGELOG
git add CHANGELOG.md
git commit --amend --no-edit

# 5. Push
git push origin main --tags
```

## 📝 Formato do CHANGELOG

Manter em `cli-installer/CHANGELOG.md`:

```markdown
# Changelog

Todas as mudanças notáveis do projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Features em desenvolvimento

## [1.1.0] - 2026-02-15

### Added
- Novo comando `info` para mostrar detalhes de skills
- Output colorido para melhor legibilidade

### Fixed
- Progress gauge agora funciona no Windows

### Changed
- Melhorado desempenho do comando `list`

## [1.0.1] - 2026-02-05

### Fixed
- Corrigido erro no version checker ao parsear YAML

## [1.0.0] - 2026-02-02

### Added
- Release inicial
- 5 comandos: install, list, update, uninstall, doctor
- Suporte dual-platform (Copilot + Claude)
- Progress gauges visuais
- Version checking automático
- GitHub Actions CI/CD

[Unreleased]: https://github.com/ericgandrade/claude-superskills/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ericgandrade/claude-superskills/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/ericgandrade/claude-superskills/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ericgandrade/claude-superskills/releases/tag/v1.0.0
```

## 🚀 Comandos Úteis

```bash
# Ver versão atual
cat cli-installer/package.json | grep version

# Ver todas as versões publicadas no npm
npm view claude-superskills versions

# Ver informações da versão latest
npm view claude-superskills

# Testar versão específica
npx claude-superskills@1.0.1 --version

# Ver tags git locais
git tag

# Ver tags git remotas
git ls-remote --tags origin

# Deletar tag (se errou)
git tag -d v1.0.1                    # Local
git push origin :refs/tags/v1.0.1    # Remoto
```

## ⚠️ Troubleshooting

### Erro: "Tag já existe"

```bash
# Se você já criou a tag localmente
git tag -d v1.0.1

# Se a tag existe remotamente
git push origin :refs/tags/v1.0.1

# Recriar tag
cd cli-installer
npm version patch --force
git push origin main --tags
```

### Erro: "npm publish falhou no GitHub Actions"

1. Verificar logs: https://github.com/ericgandrade/claude-superskills/actions
2. Comum: Token npm expirado (expira a cada 90 dias)
3. Solução: Criar novo token e atualizar GitHub Secret NPM_TOKEN

### Publicar versão manualmente (emergência)

```bash
cd cli-installer
npm publish
# Requer OTP do autenticador ou token com bypass 2FA
```

## 📅 Lembrete: Token npm

⚠️ **Token npm expira em 90 dias** (por volta de **2 de maio de 2026**)

Passos para renovar:
1. Criar novo Granular Access Token no npm (tipo "Automation")
2. Marcar opção "Bypass 2FA for noninteractive automated workflows"
3. Atualizar GitHub Secret NPM_TOKEN
4. Não precisa republicar, próxima versão usará novo token

## 🎯 Estratégia Recomendada

1. **Desenvolvimento contínuo:** Trabalhe em `main` normalmente
2. **Commits frequentes:** Use conventional commits (feat:, fix:, docs:)
3. **Release quando pronto:** Só bumpe versão quando quiser publicar
4. **CHANGELOG sempre:** Documente todas as mudanças
5. **Teste antes:** Use `npm link` para testar localmente antes de publicar

## 📊 Estado Atual

```
Git main branch: claude-superskills (código-fonte)
├─ package.json: v1.0.0
├─ Tag git: v1.0.0
└─ GitHub Actions: Acionado por tag v*

npm registry: claude-superskills
├─ Versão publicada: 1.0.0
├─ Tag: latest
└─ Disponível: npx claude-superskills
```

## 🔗 Links Úteis

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm version](https://docs.npmjs.com/cli/v8/commands/npm-version)
- [GitHub Actions Workflow](.github/workflows/publish-npm.yml)
