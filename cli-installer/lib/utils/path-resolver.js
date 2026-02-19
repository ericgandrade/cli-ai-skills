const fs = require('fs');
const path = require('path');

/**
 * Determine if running from npm package or git repository
 * @param {string} dirname - __dirname from calling file
 * @returns {string} Base path for skills
 */
function getSkillsBasePath(dirname) {
  // For npm package: claude-superskills/bin/cli.js -> claude-superskills/
  // For git repo: claude-superskills/cli-installer/bin/cli.js -> claude-superskills/

  const packageSkillsPath = path.resolve(dirname, '..');
  const repoSkillsPath = path.resolve(dirname, '../..');

  // Check if we're in an npm package (skills/ exists as sibling to bin/)
  if (fs.existsSync(path.join(packageSkillsPath, 'skills'))) {
    // npm package structure: claude-superskills/skills/
    return packageSkillsPath;
  } else if (fs.existsSync(path.join(repoSkillsPath, 'skills'))) {
    // git repo structure: claude-superskills/cli-installer/../skills/
    return repoSkillsPath;
  } else {
    // Fallback to repo root
    return repoSkillsPath;
  }
}

/**
 * Get skills source path for a specific platform
 * Tries npm package structure first, then falls back to git repo structure
 * @param {string} basePath - Base path from getSkillsBasePath()
 * @param {string} platform - Platform name (copilot, claude, codex, opencode, gemini)
 * @returns {string} Path to skills directory for the platform
 */
function getSkillsSourcePath(basePath, platform) {
  // Platform directory mappings
  const platformDirs = {
    'copilot': '.github',
    'claude': '.claude',
    'codex': '.codex',
    'opencode': '.agent',
    'gemini': '.gemini',
    'antigravity': '.agent',
    'cursor': '.cursor',
    'adal': '.adal'
  };

  // For npm package: basePath/skills/{platform}/
  const npmPath = path.join(basePath, 'skills', platform);

  // For git repo: basePath/{.platform}/skills/
  const platformDir = platformDirs[platform] || `.${platform}`;
  const gitPath = path.join(basePath, platformDir, 'skills');

  // Try npm structure first, then git repo structure
  if (fs.existsSync(npmPath)) {
    return npmPath;
  } else if (fs.existsSync(gitPath)) {
    return gitPath;
  } else {
    // Return npm path as default (will be created during build)
    return npmPath;
  }
}

/**
 * Get user home directory skills path for a platform
 * Includes multi-path fallback for Codex (robust solution)
 * @param {string} platform - Platform name
 * @returns {string} Path to user's skills directory
 */
function getUserSkillsPath(platform) {
  const home = process.env.HOME || process.env.USERPROFILE;

  // Special handling for Codex with multi-path fallback
  if (platform === 'codex') {
    const codexPaths = [
      path.join(home, '.codex', 'vendor_imports', 'skills', 'skills', '.curated'), // Real path (primary)
      path.join(home, '.codex', 'vendor_imports', 'skills', 'skills', '.custom'),  // Alternative
      path.join(home, '.codex', 'skills')                                           // Documented path (fallback)
    ];

    // Return first existing path, or primary path if none exist (will be created)
    for (const codexPath of codexPaths) {
      if (fs.existsSync(codexPath)) {
        return codexPath;
      }
    }
    
    // Return primary path (will be created during install)
    return codexPaths[0];
  }

  const platformDirs = {
    'copilot': path.join(home, '.github', 'skills'),
    'claude': path.join(home, '.claude', 'skills'),
    'opencode': path.join(home, '.agent', 'skills'),
    'gemini': path.join(home, '.gemini', 'skills'),
    'antigravity': path.join(home, '.agent', 'skills'),
    'cursor': path.join(home, '.cursor', 'skills'),
    'adal': path.join(home, '.adal', 'skills')
  };

  return platformDirs[platform] || path.join(home, `.${platform}`, 'skills');
}

module.exports = {
  getSkillsBasePath,
  getSkillsSourcePath,
  getUserSkillsPath
};
