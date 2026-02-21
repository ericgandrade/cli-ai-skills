const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { getUserSkillsPath } = require('./utils/path-resolver');

/**
 * Install skills for Claude Code.
 * @param {string} cacheDir - Path to cached skills dir (~/.claude-superskills/cache/{v}/skills/)
 * @param {string[]|null} skills - Specific skills to install, or null for all
 * @param {boolean} quiet - Suppress output
 * @param {string|null} targetDirOverride - Optional custom target directory
 * @param {string} label - Log label for output
 */
async function installClaudeSkills(cacheDir, skills = null, quiet = false, targetDirOverride = null, label = 'Claude') {
  const targetDir = targetDirOverride || getUserSkillsPath('claude');
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
    const skillFile = path.join(src, 'SKILL.md');

    if (!fs.existsSync(src) || !fs.existsSync(skillFile)) {
      if (!quiet) console.log(chalk.yellow(`  ⚠️  Skill not found: ${skill}`));
      failed++;
      continue;
    }

    try {
      if (fs.existsSync(dest)) await fs.remove(dest);
      await fs.copy(src, dest);
      if (!quiet) console.log(chalk.green(`  ✓ ${label}: ${skill}`));
      installed++;
    } catch (err) {
      if (fs.existsSync(dest)) await fs.remove(dest);
      if (!quiet) console.log(chalk.red(`  ✗ Error installing ${skill}: ${err.message}`));
      failed++;
    }
  }

  return { installed, failed };
}

module.exports = { installClaudeSkills };
