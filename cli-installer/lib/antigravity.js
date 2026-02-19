const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { getSkillsSourcePath, getUserSkillsPath } = require('./utils/path-resolver');

/**
 * Install skills for Google Antigravity
 * @param {string} repoPath - Path to the cli-ai-skills repository
 * @param {Array<string>|null} skills - Skills to install (null = all)
 * @param {boolean} quiet - Suppress output
 */
function install(repoPath, skills = null, quiet = false) {
  const targetDir = getUserSkillsPath('antigravity');

  // Create directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const sourceDir = getSkillsSourcePath(repoPath, 'antigravity');

  if (!fs.existsSync(sourceDir)) {
    if (!quiet) {
      console.log(chalk.red('❌ Diretório .agent/skills não encontrado no repositório'));
    }
    return { installed: 0, failed: 0 };
  }

  // List available skills
  const availableSkills = fs.readdirSync(sourceDir).filter(f => {
    const fullPath = path.join(sourceDir, f);
    return fs.statSync(fullPath).isDirectory() && f !== 'node_modules';
  });

  const skillsToInstall = skills || availableSkills;

  let installed = 0;
  let failed = 0;

  skillsToInstall.forEach(skill => {
    const sourcePath = path.join(sourceDir, skill);
    const targetPath = path.join(targetDir, skill);

    if (!fs.existsSync(sourcePath)) {
      if (!quiet) {
        console.log(chalk.yellow(`⚠️  Skill não encontrada: ${skill}`));
      }
      failed++;
      return;
    }

    // Create symlink (use absolute path to avoid broken symlinks)
    try {
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }
      // Use absolute path for symlink target
      const absoluteSourcePath = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(sourcePath);
      fs.symlinkSync(absoluteSourcePath, targetPath);

      if (!quiet) {
        console.log(chalk.green(`  ✓ Antigravity: ${skill}`));
      }
      installed++;
    } catch (err) {
      if (!quiet) {
        console.log(chalk.red(`  ✗ Erro ao instalar ${skill}: ${err.message}`));
      }
      failed++;
    }
  });

  return { installed, failed };
}

module.exports = { install };
