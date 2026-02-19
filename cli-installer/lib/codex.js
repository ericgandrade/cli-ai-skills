const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { getSkillsSourcePath, getUserSkillsPath } = require('./utils/path-resolver');

/**
 * Instala skills para OpenAI Codex
 * Solução robusta com multi-path fallback e logging detalhado
 * @param {string} repoPath - Caminho para o repositório claude-superskills
 * @param {Array<string>|null} skills - Skills to install (null = all)
 * @param {boolean} quiet - Suppress output
 */
function install(repoPath, skills = null, quiet = false) {
  const targetDir = getUserSkillsPath('codex');

  if (!quiet) {
    console.log(chalk.cyan('\n📦 Instalando skills para OpenAI Codex...'));
    console.log(chalk.gray(`   Destino: ${targetDir}`));
  }

  const sourceDir = getSkillsSourcePath(repoPath, 'codex');
  
  if (!fs.existsSync(sourceDir)) {
    if (!quiet) {
      console.log(chalk.red('❌ Diretório .codex/skills não encontrado no repositório'));
      console.log(chalk.gray(`   Esperado: ${sourceDir}`));
    }
    return { installed: 0, failed: 0 };
  }
  
  // Criar diretório de destino se não existir
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    if (!quiet) {
      console.log(chalk.green(`   ✓ Criado: ${targetDir}`));
    }
  }
  
  // Listar skills disponíveis
  const availableSkills = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'node_modules' && !d.name.startsWith('.'))
    .map(d => d.name);
  
  if (availableSkills.length === 0) {
    if (!quiet) {
      console.log(chalk.yellow('   ⚠️  Nenhum skill encontrado em .codex/skills/'));
    }
    return { installed: 0, failed: 0 };
  }

  const skillsToInstall = skills || availableSkills;
  let installed = 0;
  let failed = 0;
  
  // Criar symlinks
  skillsToInstall.forEach(skill => {
    const src = path.join(sourceDir, skill);
    const dest = path.join(targetDir, skill);
    
    if (!fs.existsSync(src)) {
      if (!quiet) {
        console.log(chalk.yellow(`   ⚠️  Skill não encontrada: ${skill}`));
      }
      failed++;
      return;
    }
    
    // Remover symlink antigo se existir
    if (fs.existsSync(dest) || fs.lstatSync(dest, {throwIfNoEntry: false})) {
      try {
        fs.unlinkSync(dest);
      } catch (e) {
        // Ignore
      }
    }
    
    // Criar novo symlink
    try {
      fs.symlinkSync(src, dest);
      if (!quiet) {
        console.log(chalk.green(`   ✓ Codex: ${skill}`));
      }
      installed++;
    } catch (error) {
      if (!quiet) {
        console.log(chalk.red(`   ✗ Erro ao instalar ${skill}: ${error.message}`));
      }
      failed++;
    }
  });
  
  if (!quiet) {
    console.log(chalk.green(`\n✅ ${installed} Codex skill(s) instalado(s)`));
    if (failed > 0) {
      console.log(chalk.yellow(`⚠️  ${failed} skill(s) falharam`));
    }
  }

  return { installed, failed };
}

module.exports = { install };
