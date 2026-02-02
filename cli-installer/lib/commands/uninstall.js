const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const ProgressGauge = require('../ui/progress-gauge');
const PlatformDetector = require('../core/detector');
const VersionChecker = require('../core/version-checker');

async function uninstallCommand(skillName, options) {
  console.log(chalk.cyan.bold('\n🗑️  CLI AI Skills Uninstaller\n'));

  try {
    // Step 1: Detect platforms
    const detector = new PlatformDetector();
    const platforms = await detector.detectAll();

    if (!platforms.copilot.installed && !platforms.claude.installed) {
      console.log(chalk.red('❌ No AI platforms detected.\n'));
      return;
    }

    // Step 2: Find installed skills
    const versionChecker = new VersionChecker();
    const installedSkills = [];

    // If specific skill name provided, only check that one
    const skillsToCheck = skillName ? [skillName] : await getInstalledSkillNames();

    for (const platform of ['copilot', 'claude']) {
      if (!platforms[platform].installed) continue;

      for (const skill of skillsToCheck) {
        const status = await versionChecker.checkVersion(skill, platform, '999.999.999');
        
        if (status !== 'not_installed' && status !== 'unknown') {
          const version = await versionChecker.getInstalledVersion(skill, platform);
          installedSkills.push({
            name: skill,
            platform,
            version
          });
        }
      }
    }

    if (installedSkills.length === 0) {
      if (skillName) {
        console.log(chalk.yellow(`⚠️  Skill "${skillName}" is not installed.\n`));
      } else {
        console.log(chalk.yellow('⚠️  No skills installed.\n'));
      }
      return;
    }

    // Step 3: Select skills to uninstall
    let skillsToUninstall = installedSkills;

    if (!options.yes) {
      if (skillName) {
        console.log(chalk.yellow(`\nFound "${skillName}" installed on:\n`));
        installedSkills.forEach(s => {
          console.log(chalk.dim(`  • ${s.platform} (v${s.version})`));
        });

        const { confirmAll } = await inquirer.prompt([{
          type: 'confirm',
          name: 'confirmAll',
          message: `Uninstall "${skillName}" from all platforms?`,
          default: true
        }]);

        if (!confirmAll) {
          const { selectedPlatforms } = await inquirer.prompt([{
            type: 'checkbox',
            name: 'selectedPlatforms',
            message: 'Select platforms to uninstall from:',
            choices: installedSkills.map(s => ({
              name: `${s.platform} (v${s.version})`,
              value: s,
              checked: true
            }))
          }]);

          skillsToUninstall = selectedPlatforms;
        }
      } else {
        console.log(chalk.yellow(`\n📦 Found ${installedSkills.length} installed skill(s):\n`));
        
        const groupedByName = {};
        installedSkills.forEach(s => {
          if (!groupedByName[s.name]) groupedByName[s.name] = [];
          groupedByName[s.name].push(s);
        });

        Object.entries(groupedByName).forEach(([name, skills]) => {
          const platforms = skills.map(s => s.platform).join(', ');
          console.log(chalk.dim(`  • ${name} (${platforms})`));
        });

        const { selectedSkills } = await inquirer.prompt([{
          type: 'checkbox',
          name: 'selectedSkills',
          message: 'Select skills to uninstall:',
          choices: installedSkills.map(s => ({
            name: `${s.name} (${s.platform})`,
            value: s
          }))
        }]);

        if (selectedSkills.length === 0) {
          console.log(chalk.dim('\nNo skills selected for uninstall.\n'));
          return;
        }

        skillsToUninstall = selectedSkills;
      }

      // Final confirmation
      const { finalConfirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'finalConfirm',
        message: chalk.red(`⚠️  Are you sure you want to uninstall ${skillsToUninstall.length} skill(s)?`),
        default: false
      }]);

      if (!finalConfirm) {
        console.log(chalk.dim('\nUninstall cancelled.\n'));
        return;
      }
    }

    // Step 4: Uninstall skills
    console.log(chalk.cyan('\n🗑️  Uninstalling skills...\n'));
    
    const results = { removed: 0, failed: 0 };

    for (const skill of skillsToUninstall) {
      try {
        const skillPath = getSkillPath(skill.name, skill.platform);
        
        if (await fs.pathExists(skillPath)) {
          // Check if it's a symlink
          const stats = await fs.lstat(skillPath);
          
          if (stats.isSymbolicLink()) {
            await fs.unlink(skillPath);
          } else {
            await fs.remove(skillPath);
          }
          
          results.removed++;
          console.log(chalk.green(`  ✓ ${skill.name} (${skill.platform})`));
        } else {
          console.log(chalk.dim(`  • ${skill.name} (${skill.platform}) - not found`));
        }
      } catch (error) {
        results.failed++;
        console.log(chalk.red(`  ✗ ${skill.name} (${skill.platform}): ${error.message}`));
      }
    }

    // Summary
    console.log('\n' + ProgressGauge.summary({
      completed: results.removed,
      failed: results.failed,
      total: skillsToUninstall.length
    }));

    if (results.removed > 0) {
      console.log(chalk.green(`\n✨ Successfully uninstalled ${results.removed} skill(s)!\n`));
    }

    if (results.failed > 0) {
      console.log(chalk.yellow(`⚠️  ${results.failed} skill(s) failed to uninstall.\n`));
    }

  } catch (error) {
    console.log(chalk.red(`\n❌ Uninstall failed: ${error.message}\n`));
    process.exit(1);
  }
}

function getSkillPath(skillName, platform) {
  const homeDir = os.homedir();
  
  if (platform === 'copilot') {
    return path.join(homeDir, '.copilot', 'skills', skillName);
  } else if (platform === 'claude') {
    return path.join(homeDir, '.claude', 'skills', skillName);
  }
  
  throw new Error(`Unknown platform: ${platform}`);
}

async function getInstalledSkillNames() {
  const homeDir = os.homedir();
  const skills = new Set();

  // Check Copilot skills
  const copilotSkillsDir = path.join(homeDir, '.copilot', 'skills');
  if (await fs.pathExists(copilotSkillsDir)) {
    const copilotSkills = await fs.readdir(copilotSkillsDir);
    copilotSkills.forEach(s => skills.add(s));
  }

  // Check Claude skills
  const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');
  if (await fs.pathExists(claudeSkillsDir)) {
    const claudeSkills = await fs.readdir(claudeSkillsDir);
    claudeSkills.forEach(s => skills.add(s));
  }

  return Array.from(skills);
}

module.exports = uninstallCommand;
