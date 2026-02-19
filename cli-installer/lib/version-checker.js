const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const semver = require('semver');
const yaml = require('js-yaml');

/**
 * Verifica se claude-superskills já está instalado em alguma plataforma
 * @returns {Object} { installed: boolean, platforms: [], versions: {}, latestVersion: string }
 */
function checkInstalledVersion() {
  const result = {
    installed: false,
    platforms: [],
    versions: {},
    latestVersion: require('../package.json').version
  };
  
  const homeDir = os.homedir();
  
  const skillDirs = {
    copilot: path.join(homeDir, '.github', 'skills'),
    claude: path.join(homeDir, '.claude', 'skills'),
    codex: path.join(homeDir, '.codex', 'skills'),
    opencode: path.join(homeDir, '.agents', 'skills'),
    gemini: path.join(homeDir, '.gemini', 'skills'),
    antigravity: path.join(homeDir, '.agent', 'skills'),
    cursor: path.join(homeDir, '.cursor', 'skills'),
    adal: path.join(homeDir, '.adal', 'skills')
  };
  
  for (const [platform, skillDir] of Object.entries(skillDirs)) {
    if (!fs.existsSync(skillDir)) continue;
    
    // Verificar se há skills instaladas (procurar por skill-creator ou prompt-engineer)
    const testSkillPath = path.join(skillDir, 'skill-creator', 'SKILL.md');
    
    if (fs.existsSync(testSkillPath)) {
      result.installed = true;
      result.platforms.push(platform);
      
      // Extrair versão do YAML frontmatter
      try {
        const content = fs.readFileSync(testSkillPath, 'utf-8');
        const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
        
        if (yamlMatch) {
          const metadata = yaml.load(yamlMatch[1]);
          result.versions[platform] = metadata.version || 'unknown';
        } else {
          result.versions[platform] = 'unknown';
        }
      } catch (err) {
        result.versions[platform] = 'unknown';
      }
    }
  }
  
  return result;
}

/**
 * Compara versões e retorna se atualização está disponível
 * @param {Object} installInfo - Retorno de checkInstalledVersion()
 * @returns {boolean} true se nova versão disponível
 */
function isUpdateAvailable(installInfo) {
  if (!installInfo.installed) return false;
  
  const { versions, latestVersion } = installInfo;
  
  for (const installedVersion of Object.values(versions)) {
    if (installedVersion === 'unknown') continue;
    
    try {
      if (semver.lt(installedVersion, latestVersion)) {
        return true;
      }
    } catch (err) {
      // Versão inválida, assumir atualização disponível
      return true;
    }
  }
  
  return false;
}

/**
 * Verifica se uma plataforma específica tem claude-superskills instalado
 * @param {string} platform - Nome da plataforma (copilot, claude, etc)
 * @returns {Object} { installed: boolean, version: string }
 */
function checkPlatformInstallation(platform) {
  const homeDir = os.homedir();
  const platformMap = {
    copilot: '.github',
    claude: '.claude',
    codex: '.codex',
    opencode: '.agents',
    gemini: '.gemini',
    antigravity: '.agent',
    cursor: '.cursor',
    adal: '.adal'
  };
  
  const dirName = platformMap[platform];
  if (!dirName) {
    return { installed: false, version: null };
  }
  
  const skillPath = path.join(homeDir, dirName, 'skills', 'skill-creator', 'SKILL.md');
  
  if (!fs.existsSync(skillPath)) {
    return { installed: false, version: null };
  }
  
  try {
    const content = fs.readFileSync(skillPath, 'utf-8');
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (yamlMatch) {
      const metadata = yaml.load(yamlMatch[1]);
      return { installed: true, version: metadata.version || 'unknown' };
    }
  } catch (err) {
    return { installed: true, version: 'unknown' };
  }
  
  return { installed: true, version: 'unknown' };
}

module.exports = { 
  checkInstalledVersion, 
  isUpdateAvailable,
  checkPlatformInstallation
};
