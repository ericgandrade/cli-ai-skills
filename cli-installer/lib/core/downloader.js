const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const ora = require('ora');
const yaml = require('js-yaml');

class SkillDownloader {
  constructor() {
    this.repoOwner = 'ericgandrade';
    this.repoName = 'claude-superskills';
    this.branch = 'main';
    this.cacheDir = path.join(os.homedir(), '.claude-superskills', 'cache');
  }

  /**
   * List available skills from GitHub
   * @returns {Array} List of skill objects
   */
  async listAvailableSkills() {
    const spinner = ora('Fetching available skills...').start();
    
    try {
      const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/.github/skills`;
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'claude-superskills-installer'
        }
      });

      const skills = [];
      
      for (const item of response.data) {
        if (item.type === 'dir') {
          // Get SKILL.md to extract metadata
          const skillMeta = await this.getSkillMetadata(item.name, '.github');
          skills.push({
            name: item.name,
            version: skillMeta.version,
            description: skillMeta.description
          });
        }
      }

      spinner.succeed(`Found ${skills.length} skills`);
      return skills;
    } catch (error) {
      spinner.fail('Failed to fetch skills');
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  /**
   * Get skill metadata from SKILL.md
   * @param {string} skillName - Name of the skill
   * @param {string} basePath - '.github' or '.claude'
   * @returns {Object} Skill metadata
   */
  async getSkillMetadata(skillName, basePath = '.github') {
    try {
      const url = `https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/${this.branch}/${basePath}/skills/${skillName}/SKILL.md`;
      const response = await axios.get(url);
      
      // Extract YAML frontmatter
      const frontmatterMatch = response.data.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        return yaml.load(frontmatterMatch[1]);
      }
      
      return { version: 'unknown', description: 'No description' };
    } catch (error) {
      return { version: 'unknown', description: 'No description' };
    }
  }

  /**
   * Download a skill directory from GitHub
   * @param {string} skillName - Name of the skill
   * @param {string} platform - 'copilot' or 'claude'
   * @returns {string} Path to downloaded skill
   */
  async downloadSkill(skillName, platform = 'copilot') {
    const spinner = ora(`Downloading ${skillName}...`).start();
    
    const basePath = platform === 'copilot' ? '.github/skills' : '.claude/skills';
    const skillPath = path.join(this.cacheDir, platform, skillName);
    
    try {
      // Ensure cache directory exists
      await fs.ensureDir(skillPath);

      // Get directory contents from GitHub API
      const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${basePath}/${skillName}`;
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'claude-superskills-installer'
        }
      });

      // Download each file
      await this.downloadDirectory(response.data, skillPath);
      
      spinner.succeed(`Downloaded ${skillName}`);
      return skillPath;
    } catch (error) {
      spinner.fail(`Failed to download ${skillName}`);
      throw new Error(`Download error: ${error.message}`);
    }
  }

  /**
   * Recursively download directory contents
   * @param {Array} contents - GitHub API contents response
   * @param {string} targetPath - Target directory path
   */
  async downloadDirectory(contents, targetPath) {
    for (const item of contents) {
      const itemPath = path.join(targetPath, item.name);

      if (item.type === 'file') {
        // Download file
        const response = await axios.get(item.download_url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'claude-superskills-installer'
          }
        });
        await fs.writeFile(itemPath, response.data);
      } else if (item.type === 'dir') {
        // Recursively download subdirectory
        await fs.ensureDir(itemPath);
        const subDirResponse = await axios.get(item.url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'claude-superskills-installer'
          }
        });
        await this.downloadDirectory(subDirResponse.data, itemPath);
      }
    }
  }

  /**
   * Clear download cache
   */
  async clearCache() {
    await fs.remove(this.cacheDir);
  }

  /**
   * Get cache directory path
   * @returns {string} Cache directory path
   */
  getCacheDir() {
    return this.cacheDir;
  }
}

module.exports = SkillDownloader;
