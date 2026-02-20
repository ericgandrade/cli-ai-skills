#!/usr/bin/env python3
"""Generate CATALOG.md from skills_index.json"""

import json
from datetime import datetime
from pathlib import Path

# Read skills index
index_path = Path(__file__).parent.parent / 'skills_index.json'
with open(index_path) as f:
    index = json.load(f)

# Start building catalog
catalog = f"""# 📚 Claude Superskills Catalog

**Generated:** {datetime.now().isoformat()}Z  
**Total Skills:** {len(index['skills'])}  
**Platforms:** GitHub Copilot CLI, Claude Code, OpenAI Codex, OpenCode, Gemini CLI, Antigravity, Cursor IDE, AdaL CLI

---

## 📋 All Skills

| Skill | Version | Category | Tags | Risk | Platforms |
|-------|---------|----------|------|------|-----------|
"""

# Add skills table
for skill in index['skills']:
    tags = ', '.join(skill['tags'][:3]) if skill['tags'] else 'N/A'
    platforms = ' '.join({
        'github-copilot-cli': '🤖',
        'claude-code': '🧠',
        'codex': '⚙️',
        'opencode': '🧩',
        'gemini': '♊',
        'antigravity': '🪂',
        'cursor': '🖱️',
        'adal': '🧪'
    }.get(p, p) for p in skill['platforms'])
    
    catalog += f"| **{skill['name']}** | {skill['version']} | {skill['category']} | {tags} | {skill['risk']} | {platforms} |\n"

catalog += "\n---\n\n## 🎯 Skills by Category\n\n"

# Group by category
categories = {}
for skill in index['skills']:
    cat = skill['category']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(skill)

for category in sorted(categories.keys()):
    catalog += f"### {category.capitalize()}\n\n"
    for skill in categories[category]:
        desc_preview = skill['description'][:100] if skill['description'] else 'N/A'
        catalog += f"- **{skill['name']}** (v{skill['version']})\n"
        catalog += f"  - Description: {desc_preview}...\n"
        catalog += f"  - Tags: {', '.join(skill['tags'])}\n\n"

catalog += "\n---\n\n## 📦 Curated Bundles\n\n"
catalog += "See [Bundles Guide](docs/bundles/bundles.md) for curated collections of skills by use case.\n"

# Write catalog
catalog_path = Path(__file__).parent.parent / 'CATALOG.md'
with open(catalog_path, 'w') as f:
    f.write(catalog)

print(f"✅ CATALOG.md generated ({len(index['skills'])} skills)")
