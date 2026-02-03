const inquirer = require('inquirer');

/**
 * Pergunta ao usuário para quais plataformas instalar
 * @param {Object} detected - Ferramentas detectadas { copilot, claude, codex }
 * @returns {Promise<Array>} Plataformas escolhidas
 */
async function promptPlatforms(detected) {
  const choices = [];
  
  if (detected.copilot) {
    choices.push({
      name: '✅ GitHub Copilot CLI (.github/skills/)',
      value: 'copilot',
      checked: true
    });
  }
  
  if (detected.claude) {
    choices.push({
      name: '✅ Claude Code (.claude/skills/)',
      value: 'claude',
      checked: true
    });
  }
  
  if (detected.codex) {
    choices.push({
      name: '✅ OpenAI Codex (.codex/skills/)',
      value: 'codex',
      checked: true
    });
  }

  if (choices.length === 0) {
    return [];
  }

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Instalar skills para quais plataformas?',
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

module.exports = { promptPlatforms };
