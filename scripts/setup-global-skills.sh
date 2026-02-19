#!/bin/bash

SKILLS_REPO=$1

if [ -z "$SKILLS_REPO" ]; then
    echo "Usage: ./setup-global-skills.sh <path-to-skills-repo>"
    echo ""
    echo "Example:"
    echo "  ./setup-global-skills.sh ~/code/claude-superskills"
    echo "  ./setup-global-skills.sh /Users/username/Projects/my-skills"
    echo ""
    exit 1
fi

# Expand tilde and resolve path
SKILLS_REPO="${SKILLS_REPO/#\~/$HOME}"
SKILLS_REPO=$(cd "$SKILLS_REPO" 2>/dev/null && pwd || echo "$SKILLS_REPO")

if [ ! -d "$SKILLS_REPO" ]; then
    echo "❌ Directory not found: $SKILLS_REPO"
    echo ""
    echo "Please provide a valid path to your skills repository."
    exit 1
fi

echo "🔧 Setting up global skills from:"
echo "   $SKILLS_REPO"
echo ""

CONFIGURED=0

# GitHub Copilot
if command -v gh &> /dev/null && gh copilot --version &> /dev/null 2>&1; then
    echo "✅ Configuring GitHub Copilot..."
    mkdir -p ~/.copilot
    
    cat > ~/.copilot/config.json << EOF
{
  "skills": {
    "directories": [
      "$SKILLS_REPO/.github/skills"
    ]
  }
}
EOF
    echo "   Config written to: ~/.copilot/config.json"
    echo "   Skills path: $SKILLS_REPO/.github/skills"
    CONFIGURED=$((CONFIGURED + 1))
else
    echo "⚠️  GitHub Copilot CLI not installed - skipping"
fi

echo ""

# Claude Code
if command -v claude &> /dev/null; then
    echo "✅ Configuring Claude Code..."
    mkdir -p ~/.claude
    
    cat > ~/.claude/config.json << EOF
{
  "skills": {
    "directories": [
      "$SKILLS_REPO/.claude/skills"
    ]
  }
}
EOF
    echo "   Config written to: ~/.claude/config.json"
    echo "   Skills path: $SKILLS_REPO/.claude/skills"
    CONFIGURED=$((CONFIGURED + 1))
else
    echo "⚠️  Claude Code not installed - skipping"
fi

echo ""
echo "────────────────────────────────────────"

if [ $CONFIGURED -eq 0 ]; then
    echo "❌ No AI CLI tools found. Install at least one:"
    echo "   • GitHub Copilot CLI: gh extension install github/gh-copilot"
    echo "   • Claude Code: https://claude.ai/code"
    exit 1
fi

echo "✅ Global skills configured successfully!"
echo ""
echo "Test with:"
if command -v gh &> /dev/null && gh copilot --version &> /dev/null 2>&1; then
    echo "  copilot> list skills"
fi
if command -v claude &> /dev/null; then
    echo "  claude> list skills"
fi
echo ""
