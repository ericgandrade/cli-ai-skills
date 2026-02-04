/**
 * Search command - find skills by keyword
 */

const fs = require('fs');
const path = require('path');

function loadSkillsIndex() {
  const indexPath = path.join(__dirname, '../../skills_index.json');
  try {
    return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  } catch (e) {
    console.error('❌ skills_index.json not found');
    process.exit(1);
  }
}

function searchSkills(keyword) {
  if (!keyword || keyword.trim() === '') {
    console.error('❌ Please provide a search keyword');
    process.exit(1);
  }

  const index = loadSkillsIndex();
  const searchableText = keyword.toLowerCase();
  
  const results = index.skills.filter(skill => {
    const text = [
      skill.name,
      skill.description,
      ...(skill.tags || []),
      skill.category
    ].join(' ').toLowerCase();
    
    return text.includes(searchableText);
  });
  
  if (results.length === 0) {
    console.log(`\n🔍 No skills found matching "${keyword}"\n`);
    return;
  }
  
  console.log(`\n🔍 Found ${results.length} skill(s) matching "${keyword}":\n`);
  results.forEach(skill => {
    console.log(`  • ${skill.name} v${skill.version}`);
    console.log(`    ${skill.description}`);
    console.log(`    Category: ${skill.category} | Tags: ${(skill.tags || []).join(', ')}\n`);
  });
}

module.exports = {
  loadSkillsIndex,
  searchSkills
};
