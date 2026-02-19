const chalk = require('chalk');
const PlatformDetector = require('../core/detector');
const SkillDownloader = require('../core/downloader');
const VersionChecker = require('../core/version-checker');
const RequirementsInstaller = require('../core/requirements-installer');
const path = require('path');

async function listCommand(options) {
  console.log(chalk.cyan.bold('\n📦 CLI AI Skills\n'));

  const detector = new PlatformDetector();
  const downloader = new SkillDownloader();
  const versionChecker = new VersionChecker();
  const requirementsInstaller = new RequirementsInstaller();

  try {
    // Get available skills
    const availableSkills = await downloader.listAvailableSkills();

    // Get installed skills
    const platformInfo = await detector.detectAll();
    const installPaths = detector.getInstallPaths('global', platformInfo);

    console.log(chalk.cyan('Available Skills:\n'));

    for (const skill of availableSkills) {
      let installedStatus = '⬜';
      let versionInfo = '';
      let platformList = [];
      let requirementsStatus = '';

      // Check if installed in each platform
      for (const [platform, dirPath] of Object.entries(installPaths)) {
        const skillPath = path.join(dirPath, skill.name);
        const updateStatus = await versionChecker.checkUpdate(skillPath, skill.version);

        if (updateStatus.installed) {
          platformList.push(platform);
          
          // Check requirements status only once
          if (!requirementsStatus) {
            const reqStatus = await requirementsInstaller.checkRequirementsStatus(skillPath);
            if (reqStatus.hasRequirements) {
              if (reqStatus.status === 'installed') {
                requirementsStatus = chalk.green(` 🐍 (${reqStatus.details.join(', ')})`);
              } else if (reqStatus.status === 'not-installed') {
                requirementsStatus = chalk.yellow(` 🐍 (requirements not installed)`);
              } else {
                requirementsStatus = chalk.dim(` 🐍`);
              }
            }
          }
          
          if (updateStatus.needsUpdate) {
            installedStatus = '⚠️ ';
            versionInfo = chalk.yellow(` (v${updateStatus.currentVersion} → v${skill.version} available)`);
          } else if (!versionInfo) {
            installedStatus = '✅';
            versionInfo = chalk.green(` (installed)`);
          }
        }
      }

      console.log(`${installedStatus} ${chalk.bold(skill.name)} v${skill.version}${versionInfo}${requirementsStatus}`);
      console.log(chalk.dim(`   ${skill.description}`));
      
      if (platformList.length > 0) {
        console.log(chalk.dim(`   Platforms: ${platformList.join(', ')}`));
      }
      
      console.log(); // Spacing
    }

    console.log(chalk.dim(`💡 Commands:`));
    console.log(chalk.dim(`  npx claude-superskills install <skill>    Install a skill`));
    console.log(chalk.dim(`  npx claude-superskills update [skill]     Update skill(s)`));
    console.log(chalk.dim(`  npx claude-superskills uninstall <skill>  Remove a skill\n`));

  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = listCommand;
