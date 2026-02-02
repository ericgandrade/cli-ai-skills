const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

/**
 * Handles installation of Python requirements for skills
 */
class RequirementsInstaller {
  constructor() {
    this.pythonCmd = 'python3';
  }

  /**
   * Detect if skill has requirements to install
   * @param {string} skillPath - Path to skill directory
   * @returns {Promise<Object>} Requirements info
   */
  async detectRequirements(skillPath) {
    // Check for install script (preferred method)
    const installScript = path.join(skillPath, 'scripts', 'install-requirements.sh');
    
    if (await fs.pathExists(installScript)) {
      return {
        hasRequirements: true,
        scriptPath: installScript,
        type: 'bash',
        method: 'script'
      };
    }
    
    // Check for requirements.txt (fallback)
    const requirementsTxt = path.join(skillPath, 'requirements.txt');
    
    if (await fs.pathExists(requirementsTxt)) {
      const packages = await fs.readFile(requirementsTxt, 'utf-8');
      return {
        hasRequirements: true,
        file: requirementsTxt,
        packages: packages.split('\n').filter(p => p.trim() && !p.startsWith('#')),
        type: 'pip',
        method: 'requirements.txt'
      };
    }
    
    return { hasRequirements: false };
  }

  /**
   * Verify Python is available
   * @returns {Promise<Object>} Python availability info
   */
  async verifyPython() {
    try {
      const version = execSync(`${this.pythonCmd} --version`, { 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      
      return { 
        available: true, 
        version: version,
        command: this.pythonCmd
      };
    } catch (error) {
      return { available: false };
    }
  }

  /**
   * Install requirements for a skill
   * @param {Object} requirements - Requirements object from detectRequirements()
   * @param {Object} options - Installation options
   * @returns {Promise<Object>} Installation result
   */
  async installRequirements(requirements, options = {}) {
    if (!requirements.hasRequirements) {
      return { success: true, skipped: true };
    }

    const spinner = ora('Installing skill requirements...').start();

    try {
      if (requirements.type === 'bash') {
        // Execute installation script
        spinner.text = `Running ${path.basename(requirements.scriptPath)}...`;
        
        execSync(`bash "${requirements.scriptPath}"`, {
          stdio: options.verbose ? 'inherit' : 'pipe',
          cwd: path.dirname(requirements.scriptPath),
          env: { ...process.env, TERM: 'dumb' } // Prevent interactive prompts
        });
        
      } else if (requirements.type === 'pip') {
        // Install via pip
        spinner.text = `Installing Python packages: ${requirements.packages.join(', ')}...`;
        
        const packagesStr = requirements.packages.join(' ');
        execSync(`${this.pythonCmd} -m pip install --user --break-system-packages ${packagesStr}`, {
          stdio: options.verbose ? 'inherit' : 'pipe'
        });
      }

      spinner.succeed(chalk.green('Requirements installed successfully'));
      return { success: true };
      
    } catch (error) {
      spinner.fail(chalk.red('Requirements installation failed'));
      
      console.error(chalk.yellow('\n⚠️  Automatic installation failed'));
      console.error(chalk.gray(`Error: ${error.message}`));
      console.error(chalk.yellow('\n💡 You can install requirements manually:'));
      
      if (requirements.type === 'bash') {
        console.error(chalk.gray(`   bash ${requirements.scriptPath}`));
      } else if (requirements.type === 'pip') {
        console.error(chalk.gray(`   pip install --user ${requirements.packages.join(' ')}`));
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify if Python package is installed
   * @param {string} packageName - Package name to check
   * @returns {Promise<boolean>} True if installed
   */
  async isPackageInstalled(packageName) {
    try {
      execSync(`${this.pythonCmd} -c "import ${packageName}"`, {
        stdio: 'pipe'
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check status of requirements for installed skills
   * @param {string} skillPath - Path to skill directory
   * @returns {Promise<Object>} Status info
   */
  async checkRequirementsStatus(skillPath) {
    const requirements = await this.detectRequirements(skillPath);
    
    if (!requirements.hasRequirements) {
      return { hasRequirements: false, status: 'n/a' };
    }

    // For audio-transcriber, check if Whisper is installed
    const skillName = path.basename(skillPath);
    
    if (skillName === 'audio-transcriber') {
      const whisperInstalled = await this.isPackageInstalled('whisper');
      const fasterWhisperInstalled = await this.isPackageInstalled('faster_whisper');
      
      let status = 'not-installed';
      let details = [];
      
      if (fasterWhisperInstalled) {
        status = 'installed';
        details.push('faster-whisper');
      } else if (whisperInstalled) {
        status = 'installed';
        details.push('openai-whisper');
      }
      
      // Check ffmpeg
      try {
        execSync('which ffmpeg', { stdio: 'pipe' });
        details.push('ffmpeg');
      } catch {
        // ffmpeg not installed (optional)
      }
      
      return {
        hasRequirements: true,
        status,
        details,
        packages: fasterWhisperInstalled || whisperInstalled ? details : []
      };
    }
    
    // For other Python skills in the future
    return {
      hasRequirements: true,
      status: 'unknown',
      details: []
    };
  }
}

module.exports = RequirementsInstaller;
