#!/bin/bash

echo "🔍 Checking AI CLI tools installation..."
echo ""

# Check GitHub Copilot CLI
if command -v gh &> /dev/null && gh copilot --version &> /dev/null 2>&1; then
    COPILOT_VERSION=$(gh copilot --version 2>&1 | head -n1)
    echo "✅ GitHub Copilot CLI: INSTALLED"
    echo "   Version: $COPILOT_VERSION"
    echo "   Config: ~/.copilot/"
    COPILOT_INSTALLED=true
else
    echo "❌ GitHub Copilot CLI: NOT INSTALLED"
    echo "   Install: gh extension install github/gh-copilot"
    COPILOT_INSTALLED=false
fi

echo ""

# Check Claude Code
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>&1 || echo "Unknown version")
    echo "✅ Claude Code: INSTALLED"
    echo "   Version: $CLAUDE_VERSION"
    echo "   Config: ~/.claude/"
    CLAUDE_INSTALLED=true
else
    echo "❌ Claude Code: NOT INSTALLED"
    echo "   Install: Follow instructions at https://claude.ai/code"
    CLAUDE_INSTALLED=false
fi

echo ""
echo "────────────────────────────────────────"

# Summary
if [ "$COPILOT_INSTALLED" = true ] && [ "$CLAUDE_INSTALLED" = true ]; then
    echo "✅ Both tools installed - create skills for both platforms"
    exit 0
elif [ "$COPILOT_INSTALLED" = true ]; then
    echo "⚠️  Only Copilot installed - create skills in .github/skills/"
    exit 0
elif [ "$CLAUDE_INSTALLED" = true ]; then
    echo "⚠️  Only Claude installed - create skills in .claude/skills/"
    exit 0
else
    echo "❌ No AI CLI tools installed - install at least one to use skills"
    exit 1
fi
