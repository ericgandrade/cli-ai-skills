const semver = require('semver');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class VersionChecker {
  /**
   * Extract version from SKILL.md frontmatter
   * @param {string} skillPath - Path to skill directory (containing SKILL.md)
   * @returns {string|null} Version string or null
   */
  async extractVersionFromSkill(skillPath) {
    const skillFile = path.join(skillPath, 'SKILL.md');
    
    if (!await fs.pathExists(skillFile)) {
      return null;
    }

    try {
      const content = await fs.readFile(skillFile, 'utf8');
      
      // Extract YAML frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        return null;
      }

      const frontmatter = yaml.load(frontmatterMatch[1]);
      return frontmatter.version || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Compare two versions
   * @param {string} current - Current version
   * @param {string} latest - Latest version
   * @returns {string} 'outdated', 'latest', 'newer', or 'unknown'
   */
  compareVersions(current, latest) {
    if (!semver.valid(current) || !semver.valid(latest)) {
      return 'unknown';
    }

    if (semver.gt(latest, current)) {
      return 'outdated'; // Update available
    } else if (semver.eq(current, latest)) {
      return 'latest';
    } else {
      return 'newer'; // Installed version is newer (beta/dev)
    }
  }

  /**
   * Check if skill needs update
   * @param {string} installedPath - Path to installed skill
   * @param {string} latestVersion - Latest available version
   * @returns {Object} Update status
   */
  async checkUpdate(installedPath, latestVersion) {
    const currentVersion = await this.extractVersionFromSkill(installedPath);
    
    if (!currentVersion) {
      return {
        installed: false,
        needsUpdate: false,
        currentVersion: null,
        latestVersion
      };
    }

    const status = this.compareVersions(currentVersion, latestVersion);

    return {
      installed: true,
      needsUpdate: status === 'outdated',
      currentVersion,
      latestVersion,
      status
    };
  }

  /**
   * Get installed version for a skill
   * @param {string} skillName - Name of the skill
   * @param {string} platform - Platform (copilot or claude)
   * @returns {string|null} Version string or null
   */
  async getInstalledVersion(skillName, platform) {
    const os = require('os');
    const homeDir = os.homedir();
    
    let skillPath;
    if (platform === 'copilot') {
      skillPath = path.join(homeDir, '.copilot', 'skills', skillName);
    } else if (platform === 'claude') {
      skillPath = path.join(homeDir, '.claude', 'skills', skillName);
    } else {
      return null;
    }

    return await this.extractVersionFromSkill(skillPath);
  }

  /**
   * Check version status for a skill
   * @param {string} skillName - Name of the skill
   * @param {string} platform - Platform (copilot or claude)
   * @param {string} latestVersion - Latest version (optional, will fetch if not provided)
   * @returns {string} Status: 'outdated', 'latest', 'newer', 'not_installed', 'unknown'
   */
  async checkVersion(skillName, platform, latestVersion = null) {
    const installedVersion = await this.getInstalledVersion(skillName, platform);
    
    if (!installedVersion) {
      return 'not_installed';
    }

    if (!latestVersion) {
      // If latest version not provided, we can't compare
      return 'unknown';
    }

    return this.compareVersions(installedVersion, latestVersion);
  }
}

module.exports = VersionChecker;
