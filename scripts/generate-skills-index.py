#!/usr/bin/env python3
"""Generate skills_index.json from all SKILL.md files under skills/."""

import os
import json
import yaml
from datetime import datetime
from pathlib import Path

print("🔍 Scanning skills...")

skills_dir = Path(__file__).parent.parent / 'skills'
skills = []

# Read each skill's SKILL.md
for skill_name in sorted(os.listdir(skills_dir)):
    skill_path = skills_dir / skill_name
    
    if not skill_path.is_dir():
        continue
    
    skill_md = skill_path / 'SKILL.md'
    
    if not skill_md.exists():
        print(f"⚠️  {skill_name}/SKILL.md not found")
        continue
    
    with open(skill_md, 'r') as f:
        content = f.read()
    
    # Extract YAML frontmatter
    if not content.startswith('---'):
        print(f"⚠️  No YAML frontmatter in {skill_name}/SKILL.md")
        continue
    
    # Find the closing ---
    lines = content.split('\n')
    yaml_end = None
    for i in range(1, len(lines)):
        if lines[i] == '---':
            yaml_end = i
            break
    
    if yaml_end is None:
        print(f"⚠️  Malformed YAML frontmatter in {skill_name}/SKILL.md")
        continue
    
    yaml_content = '\n'.join(lines[1:yaml_end])
    
    try:
        metadata = yaml.safe_load(yaml_content)
        
        # Validate metadata and fill defaults for optional fields.
        required = ['name', 'description']
        missing = [field for field in required if not metadata.get(field)]
        if missing:
            print(f"⚠️  {skill_name} missing required fields: {', '.join(missing)}")
        
        skills.append({
            'name': metadata.get('name', skill_name),
            'version': metadata.get('version', '0.0.0'),
            'description': metadata.get('description', ''),
            'category': metadata.get('category', 'general'),
            'tags': metadata.get('tags', []),
            'risk': metadata.get('risk', 'unknown'),
            'platforms': metadata.get('platforms', []),
            'triggers': metadata.get('triggers', [])
        })
        
        print(f"✅ {skill_name} v{metadata.get('version', '0.0.0')}")
    except Exception as e:
        print(f"❌ Error parsing {skill_name}/SKILL.md: {e}")

# Sort by name
skills.sort(key=lambda x: x['name'])

# Create index
index = {
    'version': '1.0.0',
    'generated': datetime.now().isoformat() + 'Z',
    'skills': skills
}

# Write index
index_path = Path(__file__).parent.parent / 'skills_index.json'
with open(index_path, 'w') as f:
    json.dump(index, f, indent=2)

print(f"\n✅ Generated skills_index.json with {len(skills)} skills")
print(f"📄 File: {index_path}")
