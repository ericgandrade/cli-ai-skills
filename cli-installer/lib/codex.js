const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getUserSkillsPath } = require('./utils/path-resolver');

/**
 * Install skills for OpenAI Codex.
 * @param {string} cacheDir - Path to cached skills dir (~/.claude-superskills/cache/{v}/skills/)
 * @param {string[]|null} skills - Specific skills to install, or null for all
 * @param {boolean} quiet - Suppress output
 */
async function install(cacheDir, skills = null, quiet = false) {
  const targetDir = getUserSkillsPath('codex');

  if (!quiet) {
    console.log(chalk.cyan('\n📦 Installing skills for OpenAI Codex...'));
    console.log(chalk.gray(`   Target: ${targetDir}`));
  }

  await fs.ensureDir(targetDir);

  const availableSkills = (await fs.readdir(cacheDir)).filter(f =>
    fs.statSync(path.join(cacheDir, f)).isDirectory()
  );

  const skillsToInstall = skills || availableSkills;
  let installed = 0;
  let failed = 0;

  for (const skill of skillsToInstall) {
    const src = path.join(cacheDir, skill);
    const dest = path.join(targetDir, skill);

    if (!fs.existsSync(src)) {
      if (!quiet) console.log(chalk.yellow(`   ⚠️  Skill not found: ${skill}`));
      failed++;
      continue;
    }

    try {
      if (fs.existsSync(dest)) await fs.remove(dest);
      await fs.copy(src, dest);
      if (!quiet) console.log(chalk.green(`   ✓ Codex: ${skill}`));
      installed++;
    } catch (err) {
      if (!quiet) console.log(chalk.red(`   ✗ Error installing ${skill}: ${err.message}`));
      failed++;
    }
  }

  if (!quiet) {
    console.log(chalk.green(`\n✅ ${installed} Codex skill(s) installed`));
    if (failed > 0) console.log(chalk.yellow(`⚠️  ${failed} skill(s) failed`));
  }

  return { installed, failed };
}

module.exports = { install };
