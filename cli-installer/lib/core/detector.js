const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync} = require('child_process');

class PlatformDetector {
  constructor() {
    this.homeDir = os.homedir();
  }

  /**
   * Detect all available platforms
   * @returns {Object} Platform detection results
   */
  async detectAll() {
    return {
      copilot: await this.detectCopilot(),
      claude: await this.detectClaude()
    };
  }

  /**
   * Detect GitHub Copilot CLI
   * @returns {Object} Detection result with installation status and paths
   */
  async detectCopilot() {
    const result = {
      installed: false,
      cliInstalled: false,
      version: null,
      globalPath: path.join(this.homeDir, '.copilot', 'skills'),
      localPath: path.join(process.cwd(), '.github', 'skills')
    };

    // Check if gh copilot is installed
    try {
      const version = execSync('gh copilot --version 2>&1', { encoding: 'utf8' });
      result.cliInstalled = true;
      result.version = version.trim();
    } catch (error) {
      result.cliInstalled = false;
    }

    // Check if global skills directory exists
    result.installed = await fs.pathExists(path.join(this.homeDir, '.copilot'));

    return result;
  }

  /**
   * Detect Claude Code
   * @returns {Object} Detection result with installation status and paths
   */
  async detectClaude() {
    const result = {
      installed: false,
      version: null,
      globalPath: path.join(this.homeDir, '.claude', 'skills'),
      localPath: path.join(process.cwd(), '.claude', 'skills')
    };

    // Check if .claude directory exists
    const claudeDir = path.join(this.homeDir, '.claude');
    result.installed = await fs.pathExists(claudeDir);

    // Try to get version from config
    if (result.installed) {
      const configPath = path.join(claudeDir, 'settings.local.json');
      if (await fs.pathExists(configPath)) {
        try {
          const config = await fs.readJson(configPath);
          result.version = config.version || 'unknown';
        } catch (error) {
          // Ignore JSON parse errors
        }
      }
    }

    return result;
  }

  /**
   * Get installation paths based on scope
   * @param {string} scope - 'global' or 'local'
   * @param {Object} platforms - Platform detection results
   * @returns {Object} Installation paths
   */
  getInstallPaths(scope, platforms) {
    const paths = {};

    if (scope === 'global') {
      if (platforms.copilot) {
        paths.copilot = platforms.copilot.globalPath;
      }
      if (platforms.claude) {
        paths.claude = platforms.claude.globalPath;
      }
    } else {
      // local
      if (platforms.copilot) {
        paths.copilot = platforms.copilot.localPath;
      }
      if (platforms.claude) {
        paths.claude = platforms.claude.localPath;
      }
    }

    return paths;
  }

  /**
   * Ensure installation directories exist
   * @param {Object} paths - Installation paths
   */
  async ensureDirectories(paths) {
    for (const [platform, dirPath] of Object.entries(paths)) {
      await fs.ensureDir(dirPath);
    }
  }

  /**
   * Check if directory is writable
   * @param {string} dirPath - Directory path to check
   * @returns {boolean} True if writable
   */
  async isWritable(dirPath) {
    try {
      await fs.access(dirPath, fs.constants.W_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = PlatformDetector;
