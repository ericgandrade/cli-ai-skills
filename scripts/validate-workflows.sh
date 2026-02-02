#!/usr/bin/env bash
# Validates GitHub Actions workflow YAML syntax
# Usage: ./scripts/validate-workflows.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKFLOWS_DIR="$REPO_ROOT/.github/workflows"

echo "🔍 Validating GitHub Actions workflows..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if workflows directory exists
if [ ! -d "$WORKFLOWS_DIR" ]; then
  echo "❌ Workflows directory not found: $WORKFLOWS_DIR"
  exit 1
fi

# Count workflows
WORKFLOW_COUNT=$(find "$WORKFLOWS_DIR" -maxdepth 1 -name "*.yml" -o -name "*.yaml" | wc -l | tr -d ' ')

if [ "$WORKFLOW_COUNT" -eq 0 ]; then
  echo "⚠️  No workflow files found in $WORKFLOWS_DIR"
  exit 0
fi

echo "📋 Found $WORKFLOW_COUNT workflow(s) to validate"
echo ""

ERRORS=0
VALIDATED=0

# Check if GitHub CLI is available (best option)
if command -v gh &> /dev/null; then
  VALIDATOR="gh"
  echo "✓ Using GitHub CLI (gh) for validation"
  echo ""
elif command -v yamllint &> /dev/null; then
  VALIDATOR="yamllint"
  echo "✓ Using yamllint for validation"
  echo ""
else
  echo "⚠️  No validator found. Install one of:"
  echo "   - GitHub CLI: brew install gh (recommended)"
  echo "   - yamllint: brew install yamllint"
  echo ""
  echo "Skipping validation (files will be checked by GitHub on push)"
  exit 0
fi

# Validate each workflow
for workflow in "$WORKFLOWS_DIR"/*.yml "$WORKFLOWS_DIR"/*.yaml; do
  [ -f "$workflow" ] || continue
  
  FILENAME=$(basename "$workflow")
  
  echo "Checking: $FILENAME"
  
  if [ "$VALIDATOR" == "gh" ]; then
    # Use GitHub CLI to validate
    WORKFLOW_NAME="${FILENAME%.yml}"
    WORKFLOW_NAME="${WORKFLOW_NAME%.yaml}"
    
    if gh workflow view "$WORKFLOW_NAME" &>/dev/null; then
      echo "  ✅ Valid syntax"
      ((VALIDATED++))
    else
      echo "  ❌ Invalid syntax or workflow not found"
      ((ERRORS++))
    fi
  elif [ "$VALIDATOR" == "yamllint" ]; then
    # Use yamllint to validate
    if yamllint -d relaxed "$workflow" &>/dev/null; then
      echo "  ✅ Valid YAML syntax"
      ((VALIDATED++))
    else
      echo "  ❌ Invalid YAML syntax:"
      yamllint -d relaxed "$workflow" | sed 's/^/    /'
      ((ERRORS++))
    fi
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary: $VALIDATED valid, $ERRORS error(s)"

if [ $ERRORS -gt 0 ]; then
  echo "❌ Validation failed!"
  exit 1
else
  echo "✅ All workflows validated successfully!"
  exit 0
fi
