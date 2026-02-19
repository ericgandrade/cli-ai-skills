#!/bin/bash
set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SOURCE_DIR="skills"

echo -e "${BLUE}🔍 Validating skills source...${NC}"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo -e "${RED}❌ Source directory '$SOURCE_DIR' not found!${NC}"
  exit 1
fi

# Count skills
SKILL_COUNT=$(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d ! -name ".*" | wc -l | xargs)
echo -e "${GREEN}✅ Found $SKILL_COUNT skills in '$SOURCE_DIR'${NC}"

for skill in "$SOURCE_DIR"/*/; do
  if [ -d "$skill" ]; then
    skill_name=$(basename "$skill")
    echo -e "${BLUE}   • $skill_name${NC}"
  fi
done

echo -e "${GREEN}✅ Skills source is ready. Installer downloads skills from GitHub at install time.${NC}"
