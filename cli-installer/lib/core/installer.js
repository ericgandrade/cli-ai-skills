const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

class SkillInstaller {
  constructor(detector, downloader, versionChecker) {
    this.detector = detector;
    this.downloader = downloader;
    this.versionChecker = versionChecker;
  }

  /**
   * Install a skill
   * @param {string} skillName - Name of the skill
   * @param {Object} options - Installation options
   * @returns {Object} Installation result
   */
  async install(skillName, options = {}) {
    const {
      platforms = ['copilot', 'claude'],
      scope = 'global',
      method = 'symlink',
      force = false
    } = options;

    const results = {
      skillName,
      success: false,
      platforms: {},
      errors: []
    };

    try {
      // Get platform paths
      const platformInfo = await this.detector.detectAll();
      const installPaths = this.detector.getInstallPaths(scope, platformInfo);

      // Ensure directories exist
      await this.detector.ensureDirectories(installPaths);

      // Install for each selected platform
      for (const platform of platforms) {
        if (!installPaths[platform]) {
          results.errors.push(`${platform} not available`);
          continue;
        }

        try {
          // Download skill for this platform
          const sourcePath = await this.downloader.downloadSkill(skillName, platform);
          const targetPath = path.join(installPaths[platform], skillName);

          // Check if already exists
          const exists = await fs.pathExists(targetPath);
          if (exists && !force) {
            // Get version info
            const sourceVersion = await this.versionChecker.extractVersionFromSkill(sourcePath);
            const targetVersion = await this.versionChecker.extractVersionFromSkill(targetPath);

            results.platforms[platform] = {
              status: 'exists',
              currentVersion: targetVersion,
              availableVersion: sourceVersion,
              skipped: true
            };
            continue;
          }

          // Remove existing if force
          if (exists) {
            await fs.remove(targetPath);
          }

          // Install based on method
          if (method === 'symlink' && scope === 'global') {
            // Create symlink (only for global installations)
            await fs.symlink(sourcePath, targetPath, 'dir');
            results.platforms[platform] = {
              status: 'installed',
              method: 'symlink',
              path: targetPath
            };
          } else {
            // Copy files (for local or when symlink not desired)
            await fs.copy(sourcePath, targetPath);
            results.platforms[platform] = {
              status: 'installed',
              method: 'copy',
              path: targetPath
            };
          }

        } catch (error) {
          results.errors.push(`${platform}: ${error.message}`);
          results.platforms[platform] = {
            status: 'failed',
            error: error.message
          };
        }
      }

      results.success = Object.values(results.platforms).some(p => p.status === 'installed');
    } catch (error) {
      results.errors.push(error.message);
    }

    return results;
  }

  /**
   * Uninstall a skill
   * @param {string} skillName - Name of the skill
   * @param {Object} options - Uninstall options
   */
  async uninstall(skillName, options = {}) {
    const { platforms = ['copilot', 'claude'], scope = 'global' } = options;
    
    const platformInfo = await this.detector.detectAll();
    const installPaths = this.detector.getInstallPaths(scope, platformInfo);

    const results = { removed: [], failed: [] };

    for (const platform of platforms) {
      if (!installPaths[platform]) continue;

      const skillPath = path.join(installPaths[platform], skillName);
      
      if (await fs.pathExists(skillPath)) {
        try {
          await fs.remove(skillPath);
          results.removed.push(platform);
        } catch (error) {
          results.failed.push({ platform, error: error.message });
        }
      }
    }

    return results;
  }

  /**
   * Get version from downloaded skill
   */
  async getDownloadedVersion(skillPath) {
    return await this.versionChecker.extractVersionFromSkill(skillPath);
  }
}

module.exports = SkillInstaller;
