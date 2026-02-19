#!/bin/bash
set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SOURCE_DIR="skills"
PLATFORMS=(".github/skills" ".claude/skills" ".codex/skills" ".agent/skills" ".gemini/skills" ".cursor/skills" ".adal/skills")
NPM_PLATFORMS=("cli-installer/skills/copilot" "cli-installer/skills/claude" "cli-installer/skills/codex" "cli-installer/skills/agent" "cli-installer/skills/gemini" "cli-installer/skills/cursor" "cli-installer/skills/adal")

echo -e "${BLUE}🔄 Building skills for all platforms...${NC}"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo -e "${RED}❌ Source directory '$SOURCE_DIR' not found!${NC}"
  exit 1
fi

# Count skills
SKILL_COUNT=$(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d ! -name ".*" | wc -l | xargs)
echo -e "${BLUE}📦 Found $SKILL_COUNT skills in '$SOURCE_DIR'${NC}"

# Sync to each platform
for platform in "${PLATFORMS[@]}"; do
  echo -e "${BLUE}   → Syncing to $platform${NC}"
  
  # Create platform directory
  mkdir -p "$platform"
  
  # Copy all skills (rsync ensures exact copy)
  rsync -av --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.DS_Store' \
    --exclude '*.swp' \
    "$SOURCE_DIR/" "$platform/" > /dev/null 2>&1
  
  echo -e "${GREEN}   ✓ Synced $SKILL_COUNT skills${NC}"
done

# Sync to npm package platforms
echo -e "${BLUE}📦 Syncing to npm package...${NC}"
for platform in "${NPM_PLATFORMS[@]}"; do
  echo -e "${BLUE}   → Syncing to $platform${NC}"

  # Create platform directory
  mkdir -p "$platform"

  # Copy all skills (rsync ensures exact copy)
  rsync -av --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.DS_Store' \
    --exclude '*.swp' \
    "$SOURCE_DIR/" "$platform/" > /dev/null 2>&1

  echo -e "${GREEN}   ✓ Synced $SKILL_COUNT skills${NC}"
done

echo -e "${GREEN}✅ All skills built successfully!${NC}"

# Verify sync
echo -e "${BLUE}🔍 Verifying sync...${NC}"
for skill in "$SOURCE_DIR"/*/ ; do
  if [ -d "$skill" ]; then
    skill_name=$(basename "$skill")

    # Verify platform directories
    for platform in "${PLATFORMS[@]}"; do
      if [ ! -d "$platform/$skill_name" ]; then
        echo -e "${RED}⚠️  Missing: $platform/$skill_name${NC}"
        exit 1
      fi
    done

    # Verify npm package directories
    for platform in "${NPM_PLATFORMS[@]}"; do
      if [ ! -d "$platform/$skill_name" ]; then
        echo -e "${RED}⚠️  Missing: $platform/$skill_name${NC}"
        exit 1
      fi
    done
  fi
done
echo -e "${GREEN}✓ Sync verified${NC}"
