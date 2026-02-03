const { execSync } = require('child_process');

/**
 * Detecta ferramentas AI CLI instaladas no sistema
 * @returns {Object} { copilot: boolean, claude: boolean, codex: boolean }
 */
function detectTools() {
  const tools = {
    copilot: false,
    claude: false,
    codex: false
  };

  // Detectar GitHub Copilot CLI
  try {
    execSync('gh copilot --version', { stdio: 'ignore' });
    tools.copilot = true;
  } catch (e) {
    // Não instalado
  }

  // Detectar Claude Code
  try {
    execSync('claude --version', { stdio: 'ignore' });
    tools.claude = true;
  } catch (e) {
    // Não instalado
  }

  // Detectar OpenAI Codex
  try {
    execSync('codex --version', { stdio: 'ignore' });
    tools.codex = true;
  } catch (e) {
    // Não instalado
  }

  return tools;
}

/**
 * Retorna mensagem de ajuda para ferramentas não instaladas
 */
function getInstallInstructions() {
  return `
╔════════════════════════════════════════════════════════════╗
║  Nenhuma ferramenta AI CLI detectada!                      ║
╚════════════════════════════════════════════════════════════╝

Instale ao menos uma das seguintes ferramentas:

📦 GitHub Copilot CLI:
   gh extension install github/gh-copilot

📦 Claude Code:
   npm install -g @anthropic-ai/claude-code

📦 OpenAI Codex:
   npm install -g @openai/codex

Após instalar, execute novamente: npx cli-ai-skills
  `;
}

module.exports = { detectTools, getInstallInstructions };
