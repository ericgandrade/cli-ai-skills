const inquirer = require('inquirer');
const chalk = require('chalk');

class InstallationPrompts {
  /**
   * Prompt for installation scope
   */
  async askScope() {
    const { scope } = await inquirer.prompt([
      {
        type: 'list',
        name: 'scope',
        message: '📍 Where do you want to install skills?',
        choices: [
          {
            name: 'Global (available for all projects)',
            value: 'global',
            short: 'Global'
          },
          {
            name: 'Local (current repository only)',
            value: 'local',
            short: 'Local'
          }
        ],
        default: 'global'
      }
    ]);

    return scope;
  }

  /**
   * Prompt for platform selection
   * @param {Object} platformInfo - Detected platform information
   */
  async askPlatforms(platformInfo) {
    const choices = [];

    if (platformInfo.copilot.installed || platformInfo.copilot.cliInstalled) {
      choices.push({
        name: `GitHub Copilot CLI (${platformInfo.copilot.globalPath})`,
        value: 'copilot',
        checked: true
      });
    }

    if (platformInfo.claude.installed) {
      choices.push({
        name: `Claude Code (${platformInfo.claude.globalPath})`,
        value: 'claude',
        checked: true
      });
    }

    if (choices.length === 0) {
      throw new Error('No AI platforms detected. Install GitHub Copilot CLI or Claude Code first.');
    }

    const { platforms } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'platforms',
        message: '📦 Select platforms to install skills for:',
        choices,
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must select at least one platform.';
          }
          return true;
        }
      }
    ]);

    return platforms;
  }

  /**
   * Prompt for skill selection
   * @param {Array} availableSkills - List of available skills
   */
  async askSkills(availableSkills) {
    const choices = availableSkills.map(skill => ({
      name: `${skill.name} v${skill.version} - ${skill.description}`,
      value: skill.name,
      checked: false
    }));

    choices.push({
      name: chalk.bold('All skills'),
      value: '__ALL__',
      checked: false
    });

    const { skills } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'skills',
        message: '🎯 Which skills do you want to install?',
        choices,
        pageSize: 10,
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must select at least one skill.';
          }
          return true;
        }
      }
    ]);

    // If "All skills" selected, return all skill names
    if (skills.includes('__ALL__')) {
      return availableSkills.map(s => s.name);
    }

    return skills;
  }

  /**
   * Prompt for update decision
   * @param {string} skillName - Name of the skill
   * @param {Object} versionInfo - Version comparison info
   */
  async askUpdate(skillName, versionInfo) {
    const choices = [];

    if (versionInfo.needsUpdate) {
      choices.push({
        name: `Update to v${versionInfo.latestVersion}`,
        value: 'update'
      });
      choices.push({
        name: `Keep v${versionInfo.currentVersion}`,
        value: 'keep'
      });
    } else {
      choices.push({
        name: 'Keep current version',
        value: 'keep'
      });
    }

    choices.push({
      name: 'Reinstall current version',
      value: 'reinstall'
    });
    choices.push({
      name: 'Skip',
      value: 'skip'
    });

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `${skillName} v${versionInfo.currentVersion} is ${versionInfo.status}. What would you like to do?`,
        choices
      }
    ]);

    return action;
  }

  /**
   * Confirm local installation
   */
  async confirmLocalInstallation() {
    console.log(chalk.yellow('\n📂 Local installation will create:'));
    console.log('  .github/skills/       (for GitHub Copilot)');
    console.log('  .claude/skills/       (for Claude Code)');
    console.log(chalk.dim('\n⚠️  Note: Local skills only work when inside this repository\n'));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with local installation?',
        default: true
      }
    ]);

    return confirm;
  }

  /**
   * Confirm overwrite
   */
  async confirmOverwrite(skillName, platform) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `${skillName} already exists in ${platform}. Overwrite?`,
        default: false
      }
    ]);

    return confirm;
  }
}

module.exports = InstallationPrompts;
