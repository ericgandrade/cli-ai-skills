#!/usr/bin/env node

/**
 * Generate skills_index.json from all SKILL.md files
 * Extracts YAML frontmatter from skills across all platforms
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🔍 Scanning skills...');

const skillsDir = path.join(__dirname, '../.github/skills');
const skills = [];

// Read each skill's SKILL.md
const skillDirs = fs.readdirSync(skillsDir).filter(f => {
  const fullPath = path.join(skillsDir, f);
  return fs.statSync(fullPath).isDirectory();
});

skillDirs.forEach(skillName => {
  const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
  
  if (!fs.existsSync(skillPath)) {
    console.warn(`⚠️  ${skillName}/SKILL.md not found`);
    return;
  }
  
  const content = fs.readFileSync(skillPath, 'utf8');
  
  // Extract YAML frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.warn(`⚠️  No YAML frontmatter in ${skillName}/SKILL.md`);
    return;
  }
  
  try {
    const metadata = yaml.load(match[1]);
    
    // Validate required fields
    const required = ['name', 'version', 'description', 'category', 'tags', 'risk', 'platforms'];
    const missing = required.filter(field => !metadata[field]);
    
    if (missing.length > 0) {
      console.warn(`⚠️  ${skillName} missing fields: ${missing.join(', ')}`);
    }
    
    skills.push({
      name: metadata.name || skillName,
      version: metadata.version || '0.0.0',
      description: metadata.description || '',
      category: metadata.category || 'uncategorized',
      tags: metadata.tags || [],
      risk: metadata.risk || 'unknown',
      platforms: metadata.platforms || [],
      triggers: metadata.triggers || []
    });
    
    console.log(`✅ ${skillName} v${metadata.version}`);
  } catch (e) {
    console.error(`❌ Error parsing ${skillName}/SKILL.md: ${e.message}`);
  }
});

// Sort by name
skills.sort((a, b) => a.name.localeCompare(b.name));

// Create index
const index = {
  version: '1.0.0',
  generated: new Date().toISOString(),
  skills
};

// Write index
const indexPath = path.join(__dirname, '../skills_index.json');
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log(`\n✅ Generated skills_index.json with ${skills.length} skills`);
console.log(`📄 File: ${indexPath}`);
