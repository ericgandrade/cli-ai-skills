# 🚀 Como Publicar no NPM - Guia Passo a Passo

## ✅ Pré-requisitos Verificados

Seu pacote está **100% pronto** para publicação:
- ✅ package.json configurado
- ✅ Todos os comandos funcionando
- ✅ npm publish --dry-run validado
- ✅ Sem vulnerabilidades
- ✅ Tamanho otimizado (14.3 KB)

---

## 📋 Passo a Passo COMPLETO

### **PASSO 1: Criar Conta npm (se não tiver)**

1. Acesse: https://www.npmjs.com/signup

2. Preencha:
   - **Username:** Escolha um nome único (ex: seu-nome-dev)
   - **Email:** Seu email válido
   - **Password:** Senha forte

3. Confirme seu email (cheque a caixa de entrada)

4. ✅ Conta criada!

---

### **PASSO 2: Fazer Login no Terminal**

Abra um **novo terminal** e execute:

```bash
npm login
```

Vai pedir:

```
Username: <digite_seu_username>
Password: <digite_sua_senha>
Email: <digite_seu_email>
```

Se tiver 2FA (autenticação de dois fatores):
```
One-time password: <código_do_app_autenticador>
```

Você verá:
```
Logged in as <seu_username> on https://registry.npmjs.org/
```

✅ **Logado com sucesso!**

---

### **PASSO 3: Verificar Nome Disponível**

Antes de publicar, verifique se o nome `claude-superskills` está disponível:

```bash
npm view claude-superskills
```

**Se aparecer erro** → ✅ Nome disponível! Pode publicar.

**Se aparecer info do pacote** → ❌ Nome ocupado. Você precisa:

1. Escolher outro nome. Opções:
   - `@seu-username/claude-superskills` (scoped package)
   - `claude-superskills-installer`
   - `ai-skills-cli`
   - `copilot-skills-installer`

2. Editar `cli-installer/package.json`:
   ```json
   {
     "name": "novo-nome-escolhido",
     ...
   }
   ```

---

### **PASSO 4: Publicar o Pacote**

Execute na pasta `cli-installer`:

```bash
cd cli-installer
npm publish
```

Você verá:

```
npm notice 
npm notice 📦  claude-superskills@1.0.0
npm notice === Tarball Contents ===
npm notice 5.8kB README.md
npm notice 3.2kB bin/cli.js
npm notice ... (lista de arquivos)
npm notice === Tarball Details ===
npm notice name: claude-superskills
npm notice version: 1.0.0
npm notice filename: claude-superskills-1.0.0.tgz
npm notice package size: 14.3 kB
npm notice unpacked size: 62.7 kB
npm notice total files: 14
npm notice 
+ claude-superskills@1.0.0
```

✅ **Publicado com sucesso!**

---

### **PASSO 5: Verificar Publicação**

1. **No navegador:**
   - Acesse: https://www.npmjs.com/package/claude-superskills
   - Você verá seu pacote publicado!

2. **No terminal:**
   ```bash
   npm view claude-superskills
   ```

3. **Testar instalação:**
   ```bash
   # Em outro diretório
   cd ~
   npx claude-superskills --version
   ```

   Deve mostrar: `1.0.0` ✅

---

## 🎯 Comandos Resumidos (Copiar e Colar)

```bash
# 1. Fazer login (se ainda não fez)
npm login

# 2. Verificar se nome está disponível
npm view claude-superskills

# 3. Ir para pasta do projeto
cd /Users/avanade/Library/CloudStorage/OneDrive-Avanade/14_Code_Projects/claude-superskills/cli-installer

# 4. Publicar
npm publish

# 5. Verificar publicação
npm view claude-superskills

# 6. Testar globalmente
npx claude-superskills --version
```

---

## ⚠️ Problemas Comuns e Soluções

### **Erro: "You do not have permission to publish"**

**Causa:** Nome do pacote já existe ou pertence a outra pessoa.

**Solução:**
1. Escolha outro nome OU
2. Use scoped package: `@seu-username/claude-superskills`

Edite `package.json`:
```json
{
  "name": "@seu-username/claude-superskills"
}
```

Publique com:
```bash
npm publish --access public
```

---

### **Erro: "need auth This command requires you to be logged in"**

**Causa:** Não está logado no npm.

**Solução:**
```bash
npm login
```

---

### **Erro: "package name too similar to existing package"**

**Causa:** npm detectou nome muito parecido com outro pacote.

**Solução:** Escolha um nome mais único:
- `copilot-claude-skills-cli`
- `ai-skills-manager`
- `@seu-username/claude-superskills`

---

### **Erro: "You must verify your email"**

**Causa:** Email da conta npm não foi verificado.

**Solução:**
1. Cheque seu email
2. Clique no link de verificação
3. Tente publicar novamente

---

## 🔄 Atualizar Versão Depois

Quando fizer mudanças e quiser publicar nova versão:

```bash
cd cli-installer

# Para bug fixes (1.0.0 → 1.0.1)
npm version patch

# Para novas features (1.0.0 → 1.1.0)
npm version minor

# Para breaking changes (1.0.0 → 2.0.0)
npm version major

# Publicar nova versão
npm publish
```

---

## 🗑️ Despublicar (Cuidado!)

**ATENÇÃO:** Só funciona nas primeiras 72 horas!

```bash
npm unpublish claude-superskills@1.0.0
```

Depois de 72h, só pode deprecar:
```bash
npm deprecate claude-superskills@1.0.0 "Use versão 1.1.0 em diante"
```

---

## 📊 Ver Estatísticas

Depois de publicado:

1. **Downloads:**
   - https://www.npmjs.com/package/claude-superskills

2. **Via terminal:**
   ```bash
   npm view claude-superskills
   ```

---

## ✨ Depois da Publicação

Atualize o README do repositório principal:

```markdown
## Instalação

\`\`\`bash
# Via npx (sem instalação)
npx claude-superskills install prompt-engineer

# Ou instalar globalmente
npm install -g claude-superskills
claude-superskills install --all
\`\`\`
```

Adicione badge no README:

```markdown
[![npm version](https://img.shields.io/npm/v/claude-superskills.svg)](https://www.npmjs.com/package/claude-superskills)
[![npm downloads](https://img.shields.io/npm/dm/claude-superskills.svg)](https://www.npmjs.com/package/claude-superskills)
```

---

## 🎉 Pronto!

Seu pacote está publicado e disponível mundialmente! 🌍

Qualquer pessoa pode usar:
```bash
npx claude-superskills install prompt-engineer
```

Parabéns! 🎊
