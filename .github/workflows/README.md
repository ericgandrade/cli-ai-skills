# GitHub Actions Workflows

## 📦 Publish to npm

Workflow automático que publica o pacote `cli-ai-skills` no npm quando você cria uma tag de versão.

### Como Usar

#### 1️⃣ Configurar NPM Token (uma vez apenas)

1. Crie um **Automation Token** no npm:
   - Acesse: https://www.npmjs.com/settings/~/tokens/create
   - Token Type: **Automation** (importante!)
   - Token Name: `github-actions-cli-ai-skills`
   - Expiration: No expiration
   - Copie o token (começa com `npm_...`)

2. Adicione como Secret no GitHub:
   - Acesse: https://github.com/ericgandrade/cli-ai-skills/settings/secrets/actions
   - Click **"New repository secret"**
   - Name: `NPM_TOKEN`
   - Value: Cole o token npm
   - Click **"Add secret"**

#### 2️⃣ Publicar Nova Versão

Sempre que quiser publicar uma nova versão:

```bash
# 1. Atualizar versão no package.json
cd cli-installer
npm version patch   # Para bug fixes (1.0.0 → 1.0.1)
# ou
npm version minor   # Para novas features (1.0.0 → 1.1.0)
# ou
npm version major   # Para breaking changes (1.0.0 → 2.0.0)

# 2. Fazer push da tag
git push origin main --tags

# 3. GitHub Actions publica automaticamente! 🎉
```

#### 3️⃣ Acompanhar Publicação

- Acesse: https://github.com/ericgandrade/cli-ai-skills/actions
- Veja o workflow "Publish to npm" rodando
- ✅ Quando terminar, pacote está no npm!

### O Que o Workflow Faz

1. ✅ Detecta quando você faz push de uma tag `v*`
2. ✅ Faz checkout do código
3. ✅ Instala Node.js 20
4. ✅ Instala dependências (`npm ci`)
5. ✅ Roda testes (`npm test`)
6. ✅ Publica no npm (`npm publish`)

### Vantagens

- ✅ **Sem 2FA local**: Token está seguro no GitHub
- ✅ **Automático**: Push tag → Publicado
- ✅ **Testado**: Roda testes antes de publicar
- ✅ **Rastreável**: Logs completos no GitHub
- ✅ **Profissional**: CI/CD padrão da indústria

### Troubleshooting

**Erro: "npm ERR! need auth"**
- Verifique se o secret `NPM_TOKEN` está configurado
- Verifique se o token é do tipo "Automation"

**Erro: "npm ERR! 403 Forbidden"**
- Token expirado ou revogado
- Crie novo token e atualize o secret

**Workflow não executou**
- Certifique-se que a tag começa com `v` (ex: `v1.0.0`)
- Verifique se fez push da tag: `git push --tags`

### Exemplo Completo

```bash
# Preparar nova versão
cd cli-installer
npm version patch
# Saída: v1.0.1

# Commit e push (a tag foi criada automaticamente)
git add package.json package-lock.json
git commit -m "chore: bump version to 1.0.1"
git push origin main
git push origin v1.0.1

# Aguardar GitHub Actions publicar
# Ver em: https://github.com/ericgandrade/cli-ai-skills/actions
```

### Links Úteis

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [npm Publishing Docs](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow)
- [Secrets Configuration](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
