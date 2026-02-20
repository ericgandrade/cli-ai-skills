const inquirer = require('inquirer');
const chalk = require('chalk');

// ESC handler state
let escListenerActive = false;
let currentPrompt = null;

/**
 * Setup ESC key handler for cancelling prompts
 */
function setupEscapeHandler() {
  if (escListenerActive) return;
  
  const readline = require('readline');
  readline.emitKeypressEvents(process.stdin);
  
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  
  process.stdin.on('keypress', async (str, key) => {
    if (key && key.name === 'escape') {
      await confirmCancel();
    }
  });
  
  escListenerActive = true;
}

/**
 * Confirm cancellation with user
 */
async function confirmCancel() {
  console.log('\n'); // New line for better UX
  
  const { cancel } = await inquirer.prompt([{
    type: 'confirm',
    name: 'cancel',
    message: chalk.yellow('⚠️  Deseja cancelar a instalação?'),
    default: false
  }]);
  
  if (cancel) {
    console.log(chalk.red('\n❌ Instalação cancelada pelo usuário.\n'));
    process.exit(0);
  } else {
    console.log(chalk.dim('Continuando...\n'));
  }
}

/**
 * Pergunta ao usuário para quais plataformas instalar
 * Codex CLI e Codex App são mostrados SEMPRE separadamente
 * @param {Object} detected - Ferramentas detectadas { copilot, claude, codex_cli, codex_app, opencode, gemini }
 * @returns {Promise<Array>} Plataformas escolhidas
 */
async function promptPlatforms(detected, options = {}) {
  const {
    message = 'Instalar skills para quais plataformas? (Pressione ESC para cancelar)',
    defaultChecked = true
  } = options;
  const choices = [];
  
  if (detected.copilot && detected.copilot.installed) {
    choices.push({
      name: '✅ GitHub Copilot CLI (~/.github/skills/)',
      value: 'copilot',
      checked: defaultChecked
    });
  }
  
  if (detected.claude && detected.claude.installed) {
    choices.push({
      name: '✅ Claude Code (~/.claude/skills/)',
      value: 'claude',
      checked: defaultChecked
    });
  }
  
  // Codex CLI/App usam o mesmo diretório de skills; exibir uma única opção.
  if ((detected.codex_cli && detected.codex_cli.installed) ||
      (detected.codex_app && detected.codex_app.installed)) {
    choices.push({
      name: '✅ OpenAI Codex (CLI/App) (~/.agents/skills/)',
      value: 'codex',
      checked: defaultChecked
    });
  }
  
  if (detected.opencode && detected.opencode.installed) {
    choices.push({
      name: '✅ OpenCode (~/.agent/skills/)',
      value: 'opencode',
      checked: defaultChecked
    });
  }
  
  if (detected.gemini && detected.gemini.installed) {
    choices.push({
      name: '✅ Gemini CLI (~/.gemini/skills/)',
      value: 'gemini',
      checked: defaultChecked
    });
  }

  if (detected.antigravity && detected.antigravity.installed) {
    choices.push({
      name: '✅ Google Antigravity (~/.agent/skills/)',
      value: 'antigravity',
      checked: defaultChecked
    });
  }

  if (detected.cursor && detected.cursor.installed) {
    choices.push({
      name: '✅ Cursor IDE (~/.cursor/skills/)',
      value: 'cursor',
      checked: defaultChecked
    });
  }

  if (detected.adal && detected.adal.installed) {
    choices.push({
      name: '✅ AdaL CLI (~/.adal/skills/)',
      value: 'adal',
      checked: defaultChecked
    });
  }

  if (choices.length === 0) {
    return [];
  }

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message,
      choices: choices,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'Selecione ao menos uma plataforma!';
        }
        return true;
      }
    }
  ]);

  return answers.platforms;
}

module.exports = { promptPlatforms, setupEscapeHandler, confirmCancel };
