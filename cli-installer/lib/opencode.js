const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const { getSkillsSourcePath, getUserSkillsPath } = require('./utils/path-resolver');

/**
 * Install skills for OpenCode
 * @param {string} repoPath - Path to the claude-superskills repository
 * @param {Array<string>|null} skills - Skills to install (null = all)
 * @param {boolean} quiet - Suppress output
 */
function install(repoPath, skills = null, quiet = false) {
  const targetDir = getUserSkillsPath('opencode');

  // Criar diretório se não existir
  fs.ensureDirSync(targetDir);

  const sourceDir = getSkillsSourcePath(repoPath, 'opencode');
  
  if (!fs.existsSync(sourceDir)) {
    if (!quiet) {
      console.log(chalk.red('❌ Diretório .agent/skills não encontrado no repositório'));
    }
    return;
  }
  
  // Listar skills disponíveis
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
    
    // Criar symlink
    try {
      if (fs.existsSync(targetPath)) {
        fs.removeSync(targetPath);
      }
      fs.symlinkSync(sourcePath, targetPath);
      
      if (!quiet) {
        console.log(chalk.green(`  ✓ OpenCode: ${skill}`));
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
