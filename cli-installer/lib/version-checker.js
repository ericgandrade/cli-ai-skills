const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const semver = require('semver');
const yaml = require('js-yaml');
const { getUserSkillsPath } = require('./utils/path-resolver');
const MANAGED_SKILL_HINTS = [
  'skill-creator',
  'prompt-engineer',
  'agent-skill-discovery',
  'agent-skill-orchestrator',
  'audio-transcriber',
  'docling-converter'
];

function getSkillDirs(skillsRoot) {
  if (!fs.existsSync(skillsRoot)) return [];
  return fs.readdirSync(skillsRoot)
    .map(entry => path.join(skillsRoot, entry))
    .filter(p => {
      try {
        return fs.statSync(p).isDirectory();
      } catch (_err) {
        return false;
      }
    });
}

function readSkillVersion(skillMdPath) {
  try {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) return 'unknown';
    const metadata = yaml.load(yamlMatch[1]);
    return metadata?.version || 'unknown';
  } catch (_err) {
    return 'unknown';
  }
}

function findInstalledSkillInfo(skillsRoot) {
  const skillDirs = getSkillDirs(skillsRoot);
  if (skillDirs.length === 0) return { installed: false, version: null };

  const byName = new Map(skillDirs.map(p => [path.basename(p), p]));
  const orderedDirs = [
    ...MANAGED_SKILL_HINTS.filter(name => byName.has(name)).map(name => byName.get(name)),
    ...skillDirs.filter(p => !MANAGED_SKILL_HINTS.includes(path.basename(p)))
  ];

  for (const skillDir of orderedDirs) {
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) continue;
    return { installed: true, version: readSkillVersion(skillMdPath) };
  }

  return { installed: false, version: null };
}

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
    codex: getUserSkillsPath('codex'),
    opencode: path.join(homeDir, '.agent', 'skills'),
    gemini: path.join(homeDir, '.gemini', 'skills'),
    antigravity: path.join(homeDir, '.agent', 'skills'),
    cursor: path.join(homeDir, '.cursor', 'skills'),
    adal: path.join(homeDir, '.adal', 'skills')
  };
  
  for (const [platform, skillDir] of Object.entries(skillDirs)) {
    const info = findInstalledSkillInfo(skillDir);
    if (!info.installed) continue;
    result.installed = true;
    result.platforms.push(platform);
    result.versions[platform] = info.version || 'unknown';
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
    copilot: path.join(homeDir, '.github', 'skills'),
    claude: path.join(homeDir, '.claude', 'skills'),
    codex: getUserSkillsPath('codex'),
    opencode: path.join(homeDir, '.agent', 'skills'),
    gemini: path.join(homeDir, '.gemini', 'skills'),
    antigravity: path.join(homeDir, '.agent', 'skills'),
    cursor: path.join(homeDir, '.cursor', 'skills'),
    adal: path.join(homeDir, '.adal', 'skills')
  };

  const skillsDir = platformMap[platform];
  if (!skillsDir) {
    return { installed: false, version: null };
  }

  const info = findInstalledSkillInfo(skillsDir);
  if (!info.installed) return { installed: false, version: null };
  return { installed: true, version: info.version || 'unknown' };
}

module.exports = { 
  checkInstalledVersion, 
  isUpdateAvailable,
  checkPlatformInstallation
};
