const fs = require('fs');
const path = require('path');

/**
 * Determine if running from npm package or git repository
 * @param {string} dirname - __dirname from calling file
 * @returns {string} Base path for skills
 */
function getSkillsBasePath(dirname) {
  // For npm package: cli-ai-skills/bin/cli.js -> cli-ai-skills/
  // For git repo: cli-ai-skills/cli-installer/bin/cli.js -> cli-ai-skills/

  const packageSkillsPath = path.resolve(dirname, '..');
  const repoSkillsPath = path.resolve(dirname, '../..');

  // Check if we're in an npm package (skills/ exists as sibling to bin/)
  if (fs.existsSync(path.join(packageSkillsPath, 'skills'))) {
    // npm package structure: cli-ai-skills/skills/
    return packageSkillsPath;
  } else if (fs.existsSync(path.join(repoSkillsPath, 'skills'))) {
    // git repo structure: cli-ai-skills/cli-installer/../skills/
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
    'opencode': '.opencode',
    'gemini': '.gemini'
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
 * @param {string} platform - Platform name
 * @returns {string} Path to user's skills directory
 */
function getUserSkillsPath(platform) {
  const home = process.env.HOME || process.env.USERPROFILE;

  const platformDirs = {
    'copilot': path.join(home, '.github', 'skills'),
    'claude': path.join(home, '.claude', 'skills'),
    'codex': path.join(home, '.codex', 'skills'),
    'opencode': path.join(home, '.opencode', 'skills'),
    'gemini': path.join(home, '.gemini', 'skills')
  };

  return platformDirs[platform] || path.join(home, `.${platform}`, 'skills');
}

module.exports = {
  getSkillsBasePath,
  getSkillsSourcePath,
  getUserSkillsPath
};
