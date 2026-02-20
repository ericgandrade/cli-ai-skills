const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_BASE = path.join(os.homedir(), '.claude-superskills', 'cache');

/**
 * Get the cached skills path for a given version.
 * Skills are downloaded from GitHub and stored at:
 *   ~/.claude-superskills/cache/{version}/skills/
 * @param {string} version - Package version, e.g. "1.10.3"
 * @returns {string} Path to the skills directory in cache
 */
function getCachedSkillsPath(version) {
  return path.join(CACHE_BASE, version, 'skills');
}

/**
 * Get user home directory skills path for a platform.
 * Includes multi-path fallback for Codex (robust solution).
 * @param {string} platform - Platform name
 * @returns {string} Path to user's skills directory
 */
function getCodexSkillPaths() {
  const home = process.env.HOME || process.env.USERPROFILE;
  return [
    path.join(home, '.agents', 'skills'),
    path.join(home, '.codex', 'vendor_imports', 'skills', 'skills', '.curated'),
    path.join(home, '.codex', 'vendor_imports', 'skills', 'skills', '.custom'),
    path.join(home, '.codex', 'skills')
  ];
}

function getUserSkillsPath(platform) {
  const home = process.env.HOME || process.env.USERPROFILE;

  // Codex official path: ~/.agents/skills (keep legacy fallbacks for compatibility)
  if (platform === 'codex') {
    const codexPaths = getCodexSkillPaths();

    for (const codexPath of codexPaths) {
      if (fs.existsSync(codexPath)) {
        return codexPath;
      }
    }

    return codexPaths[0];
  }

  const platformDirs = {
    'copilot':    path.join(home, '.github', 'skills'),
    'claude':     path.join(home, '.claude', 'skills'),
    'opencode':   path.join(home, '.agent', 'skills'),
    'gemini':     path.join(home, '.gemini', 'skills'),
    'antigravity':path.join(home, '.agent', 'skills'),
    'cursor':     path.join(home, '.cursor', 'skills'),
    'adal':       path.join(home, '.adal', 'skills')
  };

  return platformDirs[platform] || path.join(home, `.${platform}`, 'skills');
}

module.exports = {
  getCachedSkillsPath,
  getUserSkillsPath,
  getCodexSkillPaths
};
