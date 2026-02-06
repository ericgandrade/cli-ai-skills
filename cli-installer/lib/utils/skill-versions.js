const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Extract version from SKILL.md frontmatter
 * @param {string} skillName - Name of the skill
 * @param {string} basePath - Base path where skills are located
 * @returns {string} Version string or 'unknown'
 */
function getSkillVersion(skillName, basePath) {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      // Git repo structure
      path.join(basePath, 'skills', skillName, 'SKILL.md'),
      path.join(basePath, '.github', 'skills', skillName, 'SKILL.md'),
      path.join(basePath, '.claude', 'skills', skillName, 'SKILL.md'),
      // NPM package structure (one level deeper with platform subdirs)
      path.join(basePath, 'skills', 'copilot', skillName, 'SKILL.md'),
      path.join(basePath, 'skills', 'claude', skillName, 'SKILL.md')
    ];

    for (const skillPath of possiblePaths) {
      if (fs.existsSync(skillPath)) {
        const content = fs.readFileSync(skillPath, 'utf8');

        // Extract YAML frontmatter
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
          const frontmatter = yaml.load(match[1]);
          if (frontmatter && frontmatter.version) {
            return frontmatter.version;
          }
        }
      }
    }

    return 'unknown';
  } catch (err) {
    console.error(`Error reading version for ${skillName}:`, err.message);
    return 'unknown';
  }
}

/**
 * Get versions for all available skills
 * @param {string[]} skillNames - Array of skill names
 * @param {string} basePath - Base path where skills are located
 * @returns {Object} Object with skillName: version pairs
 */
function getAllSkillVersions(skillNames, basePath) {
  const versions = {};
  for (const skillName of skillNames) {
    versions[skillName] = getSkillVersion(skillName, basePath);
  }
  return versions;
}

module.exports = {
  getSkillVersion,
  getAllSkillVersions
};
