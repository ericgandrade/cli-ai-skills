const fs = require('fs');
const path = require('path');
const os = require('os');
const semver = require('semver');
const yaml = require('js-yaml');

/**
 * Extract skill version from SKILL.md YAML frontmatter
 */
function extractSkillVersion(skillPath) {
  const skillFile = path.join(skillPath, 'SKILL.md');
  if (!fs.existsSync(skillFile)) return null;
  
  const content = fs.readFileSync(skillFile, 'utf8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  try {
    const frontmatter = yaml.load(match[1]);
    return frontmatter.version || null;
  } catch {
    return null;
  }
}

/**
 * Install Antigravity skills
 * Docs: https://antigravity.google/docs/skills
 * 
 * Paths (both valid):
 * - Global: ~/.gemini/antigravity/skills/ (default, all workspaces)
 * - Workspace: .antigravity/skills/ (project-specific)
 */
async function installAntigravitySkills(skills, options = {}) {
  const useGlobal = options.global !== false; // Default: global (consistent with other platforms)
  const forceReinstall = options.force || false;
  
  const targetBase = useGlobal 
    ? path.join(os.homedir(), '.gemini', 'antigravity', 'skills')
    : path.join(process.cwd(), '.antigravity', 'skills');
  
  const sourceBase = path.join(__dirname, '..', 'skills', 'antigravity');
  
  if (!fs.existsSync(sourceBase)) {
    throw new Error(`Antigravity skills source directory not found: ${sourceBase}`);
  }
  
  // Create target directory
  fs.mkdirSync(targetBase, { recursive: true });
  
  const availableSkills = fs.readdirSync(sourceBase).filter(name => {
    return fs.statSync(path.join(sourceBase, name)).isDirectory();
  });
  
  const skillsToInstall = skills.length > 0 
    ? skills.filter(s => availableSkills.includes(s))
    : availableSkills;
  
  const installed = [];
  const skipped = [];
  const updated = [];
  
  for (const skillName of skillsToInstall) {
    const sourcePath = path.join(sourceBase, skillName);
    const targetPath = path.join(targetBase, skillName);
    const skillExists = fs.existsSync(targetPath);
    
    // Version-based update detection
    const sourceVersion = extractSkillVersion(sourcePath);
    const targetVersion = skillExists ? extractSkillVersion(targetPath) : null;
    
    let shouldInstall = !skillExists || forceReinstall;
    
    if (skillExists && !forceReinstall && sourceVersion && targetVersion) {
      // SemVer comparison
      if (semver.valid(sourceVersion) && semver.valid(targetVersion)) {
        shouldInstall = semver.gt(sourceVersion, targetVersion);
        if (shouldInstall) {
          updated.push(`${skillName}: ${targetVersion} → ${sourceVersion}`);
        }
      } else {
        // Fallback to mtime comparison
        const sourceMtime = fs.statSync(path.join(sourcePath, 'SKILL.md')).mtime;
        const targetMtime = fs.statSync(path.join(targetPath, 'SKILL.md')).mtime;
        shouldInstall = sourceMtime > targetMtime;
      }
    }
    
    if (!shouldInstall) {
      skipped.push(skillName);
      continue;
    }
    
    // Copy skill directory
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(targetPath, { recursive: true });
    
    function copyRecursive(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyRecursive(sourcePath, targetPath);
    
    if (skillExists && !updated.includes(skillName)) {
      updated.push(skillName);
    } else if (!skillExists) {
      installed.push(skillName);
    }
  }
  
  return {
    installed,
    updated,
    skipped,
    targetPath: targetBase,
    isGlobal: useGlobal
  };
}

/**
 * List installed Antigravity skills
 */
async function listAntigravitySkills(options = {}) {
  const useGlobal = options.global !== false; // Default: global
  
  const targetBase = useGlobal 
    ? path.join(os.homedir(), '.gemini', 'antigravity', 'skills')
    : path.join(process.cwd(), '.antigravity', 'skills');
  
  if (!fs.existsSync(targetBase)) {
    return [];
  }
  
  const skills = fs.readdirSync(targetBase)
    .filter(name => {
      const skillPath = path.join(targetBase, name);
      return fs.statSync(skillPath).isDirectory() && 
             fs.existsSync(path.join(skillPath, 'SKILL.md'));
    })
    .map(name => {
      const version = extractSkillVersion(path.join(targetBase, name));
      return { name, version: version || 'unknown' };
    });
  
  return skills;
}

/**
 * Uninstall Antigravity skills
 */
async function uninstallAntigravitySkills(skills, options = {}) {
  const useGlobal = options.global !== false; // Default: global
  
  const targetBase = useGlobal 
    ? path.join(os.homedir(), '.gemini', 'antigravity', 'skills')
    : path.join(process.cwd(), '.antigravity', 'skills');
  
  if (!fs.existsSync(targetBase)) {
    return { removed: [], notFound: skills };
  }
  
  const removed = [];
  const notFound = [];
  
  for (const skillName of skills) {
    const targetPath = path.join(targetBase, skillName);
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
      removed.push(skillName);
    } else {
      notFound.push(skillName);
    }
  }
  
  return { removed, notFound };
}

/**
 * Update Antigravity skills (alias for install with detection)
 */
async function updateAntigravitySkills(skills, options = {}) {
  return await installAntigravitySkills(skills, options);
}

/**
 * Check for available Antigravity skill updates
 */
async function checkAntigravityUpdates(options = {}) {
  const useGlobal = options.global !== false; // Default: global
  
  const targetBase = useGlobal 
    ? path.join(os.homedir(), '.gemini', 'antigravity', 'skills')
    : path.join(process.cwd(), '.antigravity', 'skills');
  
  const sourceBase = path.join(__dirname, '..', 'skills', 'antigravity');
  
  if (!fs.existsSync(targetBase)) {
    return { available: [], upToDate: [] };
  }
  
  const installedSkills = fs.readdirSync(targetBase).filter(name => {
    return fs.statSync(path.join(targetBase, name)).isDirectory() &&
           fs.existsSync(path.join(targetBase, name, 'SKILL.md'));
  });
  
  const available = [];
  const upToDate = [];
  
  for (const skillName of installedSkills) {
    const sourcePath = path.join(sourceBase, skillName);
    const targetPath = path.join(targetBase, skillName);
    
    if (!fs.existsSync(sourcePath)) continue;
    
    const sourceVersion = extractSkillVersion(sourcePath);
    const targetVersion = extractSkillVersion(targetPath);
    
    if (sourceVersion && targetVersion) {
      if (semver.valid(sourceVersion) && semver.valid(targetVersion)) {
        if (semver.gt(sourceVersion, targetVersion)) {
          available.push({
            name: skillName,
            current: targetVersion,
            latest: sourceVersion
          });
        } else {
          upToDate.push({ name: skillName, version: targetVersion });
        }
      } else {
        // Fallback to mtime
        const sourceMtime = fs.statSync(path.join(sourcePath, 'SKILL.md')).mtime;
        const targetMtime = fs.statSync(path.join(targetPath, 'SKILL.md')).mtime;
        if (sourceMtime > targetMtime) {
          available.push({
            name: skillName,
            current: targetVersion,
            latest: sourceVersion
          });
        } else {
          upToDate.push({ name: skillName, version: targetVersion });
        }
      }
    }
  }
  
  return { available, upToDate };
}

module.exports = {
  installAntigravitySkills,
  listAntigravitySkills,
  uninstallAntigravitySkills,
  updateAntigravitySkills,
  checkAntigravityUpdates
};
