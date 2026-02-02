const chalk = require('chalk');
const PlatformDetector = require('../core/detector');
const SkillDownloader = require('../core/downloader');
const VersionChecker = require('../core/version-checker');
const path = require('path');

async function listCommand(options) {
  console.log(chalk.cyan.bold('\n📦 CLI AI Skills\n'));

  const detector = new PlatformDetector();
  const downloader = new SkillDownloader();
  const versionChecker = new VersionChecker();

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

      // Check if installed in each platform
      for (const [platform, dirPath] of Object.entries(installPaths)) {
        const skillPath = path.join(dirPath, skill.name);
        const updateStatus = await versionChecker.checkUpdate(skillPath, skill.version);

        if (updateStatus.installed) {
          platformList.push(platform);
          
          if (updateStatus.needsUpdate) {
            installedStatus = '⚠️ ';
            versionInfo = chalk.yellow(` (v${updateStatus.currentVersion} → v${skill.version} available)`);
          } else if (!versionInfo) {
            installedStatus = '✅';
            versionInfo = chalk.green(` (installed)`);
          }
        }
      }

      console.log(`${installedStatus} ${chalk.bold(skill.name)} v${skill.version}${versionInfo}`);
      console.log(chalk.dim(`   ${skill.description}`));
      
      if (platformList.length > 0) {
        console.log(chalk.dim(`   Platforms: ${platformList.join(', ')}`));
      }
      
      console.log(); // Spacing
    }

    console.log(chalk.dim(`💡 Commands:`));
    console.log(chalk.dim(`  npx cli-ai-skills install <skill>    Install a skill`));
    console.log(chalk.dim(`  npx cli-ai-skills update [skill]     Update skill(s)`));
    console.log(chalk.dim(`  npx cli-ai-skills uninstall <skill>  Remove a skill\n`));

  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = listCommand;
