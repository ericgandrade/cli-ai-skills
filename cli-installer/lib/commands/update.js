const chalk = require('chalk');
const inquirer = require('inquirer');
const ProgressGauge = require('../ui/progress-gauge');
const PlatformDetector = require('../core/detector');
const VersionChecker = require('../core/version-checker');
const SkillDownloader = require('../core/downloader');
const SkillInstaller = require('../core/installer');

async function updateCommand(skillNames, options) {
  console.log(chalk.cyan.bold('\n🔄 CLI AI Skills Updater\n'));

  const gauge = new ProgressGauge(4, 'Updating skills');

  try {
    // Step 1: Detect platforms
    gauge.setStep(1, 'Detecting platforms');
    const detector = new PlatformDetector();
    const platforms = await detector.detectAll();

    if (!platforms.copilot.installed && !platforms.claude.installed) {
      console.log(chalk.red('\n❌ No AI platforms detected.'));
      console.log(chalk.dim('Install GitHub Copilot CLI or Claude Code first.\n'));
      return;
    }

    // Step 2: Find outdated skills
    gauge.setStep(2, 'Checking versions');
    const versionChecker = new VersionChecker();
    const downloader = new SkillDownloader();
    
    const availableSkills = await downloader.listAvailableSkills();
    const outdatedSkills = [];

    for (const platform of ['copilot', 'claude']) {
      if (!platforms[platform].installed) continue;

      for (const skillMeta of availableSkills) {
        const status = await versionChecker.checkVersion(skillMeta.name, platform, skillMeta.version);
        
        if (status === 'outdated') {
          const installedVersion = await versionChecker.getInstalledVersion(skillMeta.name, platform);
          
          outdatedSkills.push({
            name: skillMeta.name,
            platform,
            installedVersion,
            latestVersion: skillMeta.version,
            description: skillMeta.description
          });
        }
      }
    }

    if (outdatedSkills.length === 0) {
      gauge.complete('All skills are up to date');
      console.log(chalk.green('\n✨ All skills are already at the latest version!\n'));
      return;
    }

    // Step 3: Select skills to update
    gauge.setStep(3, 'Selecting updates');
    
    let skillsToUpdate = outdatedSkills;

    if (!options.yes) {
      console.log(chalk.yellow(`\n📦 Found ${outdatedSkills.length} outdated skill(s):\n`));
      
      outdatedSkills.forEach(skill => {
        console.log(chalk.dim(`  • ${skill.name} (${skill.platform}): ${skill.installedVersion} → ${skill.latestVersion}`));
      });

      const { confirmUpdate } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmUpdate',
        message: 'Update all outdated skills?',
        default: true
      }]);

      if (!confirmUpdate) {
        const { selectedSkills } = await inquirer.prompt([{
          type: 'checkbox',
          name: 'selectedSkills',
          message: 'Select skills to update:',
          choices: outdatedSkills.map(s => ({
            name: `${s.name} (${s.platform}): ${s.installedVersion} → ${s.latestVersion}`,
            value: s,
            checked: true
          }))
        }]);

        if (selectedSkills.length === 0) {
          console.log(chalk.dim('\nNo skills selected for update.\n'));
          return;
        }

        skillsToUpdate = selectedSkills;
      }
    }

    // Step 4: Update skills
    gauge.setStep(4, 'Updating skills');
    const installer = new SkillInstaller();
    const results = { updated: 0, failed: 0 };

    for (const skill of skillsToUpdate) {
      try {
        const scope = 'global'; // Updates maintain original scope
        const method = 'symlink'; // Use symlink for auto-updates
        
        await installer.install(skill.name, skill.platform, scope, method);
        results.updated++;
        console.log(chalk.green(`  ✓ ${skill.name} (${skill.platform})`));
      } catch (error) {
        results.failed++;
        console.log(chalk.red(`  ✗ ${skill.name} (${skill.platform}): ${error.message}`));
      }
    }

    gauge.complete('Update complete');

    // Summary
    console.log('\n' + ProgressGauge.summary({
      completed: results.updated,
      failed: results.failed,
      total: skillsToUpdate.length
    }));

    if (results.updated > 0) {
      console.log(chalk.green(`\n✨ Successfully updated ${results.updated} skill(s)!\n`));
    }

    if (results.failed > 0) {
      console.log(chalk.yellow(`⚠️  ${results.failed} skill(s) failed to update.\n`));
    }

  } catch (error) {
    console.log(chalk.red(`\n❌ Update failed: ${error.message}\n`));
    process.exit(1);
  }
}

module.exports = updateCommand;
