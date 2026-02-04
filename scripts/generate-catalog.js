#!/usr/bin/env node

/**
 * Generate CATALOG.md from skills_index.json
 * Auto-generates a human-readable catalog of all skills
 */

const fs = require('fs');
const path = require('path');

// Read skills index
const indexPath = path.join(__dirname, '../skills_index.json');
if (!fs.existsSync(indexPath)) {
  console.error('❌ skills_index.json not found. Run generate-skills-index.js first.');
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// Start building catalog
let catalog = `# 📚 CLI AI Skills Catalog

**Generated:** ${new Date().toISOString()}  
**Total Skills:** ${index.skills.length}  
**Platforms:** GitHub Copilot CLI, Claude Code, OpenAI Codex

---

## 📋 All Skills

`;

// Add skills table
catalog += `| Skill | Version | Category | Tags | Risk | Platforms |
|-------|---------|----------|------|------|-----------|
`;

index.skills.forEach(skill => {
  const tags = (skill.tags || []).slice(0, 3).join(', ');
  const platforms = (skill.platforms || []).map(p => {
    if (p === 'github-copilot-cli') return '🤖';
    if (p === 'claude-code') return '🧠';
    if (p === 'codex') return '⚙️';
    return p;
  }).join(' ');
  
  catalog += `| **${skill.name}** | ${skill.version} | ${skill.category} | ${tags}... | ${skill.risk} | ${platforms} |
`;
});

catalog += `

---

## 🎯 Skills by Category

`;

// Group by category
const categories = {};
index.skills.forEach(skill => {
  if (!categories[skill.category]) {
    categories[skill.category] = [];
  }
  categories[skill.category].push(skill);
});

Object.entries(categories).forEach(([category, skills]) => {
  catalog += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
  
  skills.forEach(skill => {
    catalog += `- **${skill.name}** (v${skill.version})\n`;
    catalog += `  - Description: ${skill.description.substring(0, 100)}...\n`;
    catalog += `  - Tags: ${(skill.tags || []).join(', ')}\n\n`;
  });
});

catalog += `---

## 🏷️ Skills by Tag

`;

// Group by tags
const tags = {};
index.skills.forEach(skill => {
  (skill.tags || []).forEach(tag => {
    if (!tags[tag]) {
      tags[tag] = [];
    }
    tags[tag].push(skill);
  });
});

Object.entries(tags)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 20) // Top 20 tags
  .forEach(([tag, skills]) => {
    catalog += `- **${tag}** (${skills.length}): ${skills.map(s => s.name).join(', ')}\n`;
  });

catalog += `

---

## 📦 Curated Bundles

See [Bundles Guide](docs/bundles/bundles.md) for curated collections of skills by use case.

`;

// Write catalog
const catalogPath = path.join(__dirname, '../CATALOG.md');
fs.writeFileSync(catalogPath, catalog);

console.log(`✅ CATALOG.md generated (${index.skills.length} skills)`);
console.log(`📄 File: ${catalogPath}`);
