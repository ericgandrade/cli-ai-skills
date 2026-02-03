const fs = require('fs');
const path = require('path');
const os = require('os');

const CODEX_SKILLS_DIR = path.join(os.homedir(), '.codex', 'skills');

/**
 * Instala skills para OpenAI Codex
 * @param {string} repoPath - Caminho para o repositório cli-ai-skills
 */
function install(repoPath) {
  console.log('\n📦 Instalando skills para OpenAI Codex...');
  
  const skillsSource = path.join(repoPath, '.codex', 'skills');
  
  if (!fs.existsSync(skillsSource)) {
    console.error('❌ Erro: .codex/skills/ não encontrado no repositório');
    console.error(`   Caminho esperado: ${skillsSource}`);
    return;
  }
  
  // Criar ~/.codex/skills/ se não existir
  if (!fs.existsSync(CODEX_SKILLS_DIR)) {
    fs.mkdirSync(CODEX_SKILLS_DIR, { recursive: true });
    console.log(`   Criado: ${CODEX_SKILLS_DIR}`);
  }
  
  // Listar skills disponíveis
  const skills = fs.readdirSync(skillsSource, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'node_modules' && !d.name.startsWith('.'))
    .map(d => d.name);
  
  if (skills.length === 0) {
    console.log('   ⚠️  Nenhum skill encontrado em .codex/skills/');
    return;
  }
  
  // Criar symlinks
  skills.forEach(skill => {
    const src = path.join(skillsSource, skill);
    const dest = path.join(CODEX_SKILLS_DIR, skill);
    
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
      console.log(`   ✓ ${skill}`);
    } catch (error) {
      console.error(`   ✗ ${skill} (erro: ${error.message})`);
    }
  });
  
  console.log(`\n✅ ${skills.length} Codex skills instalados em ${CODEX_SKILLS_DIR}`);
}

module.exports = { install };
