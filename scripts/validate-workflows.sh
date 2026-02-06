#!/usr/bin/env bash
# Validates GitHub Actions workflow YAML syntax
# Usage: ./scripts/validate-workflows.sh

# Remove 'set -e' to prevent premature exit
# set -e

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
WORKFLOW_COUNT=$(find "$WORKFLOWS_DIR" -maxdepth 1 \( -name "*.yml" -o -name "*.yaml" \) | wc -l | tr -d ' ')

if [ "$WORKFLOW_COUNT" -eq 0 ]; then
  echo "⚠️  No workflow files found in $WORKFLOWS_DIR"
  exit 0
fi

echo "📋 Found $WORKFLOW_COUNT workflow(s) to validate"
echo ""

ERRORS=0
VALIDATED=0

# Use Python's yaml module for validation (most reliable cross-platform)
if command -v python3 &> /dev/null; then
  VALIDATOR="python"
  echo "✓ Using Python YAML parser for validation"
  echo ""
else
  echo "⚠️  Python 3 not found. Skipping YAML validation."
  echo "   Install Python 3 or yamllint for validation."
  exit 0
fi

# Validate each workflow
for workflow in "$WORKFLOWS_DIR"/*.yml "$WORKFLOWS_DIR"/*.yaml; do
  [ -f "$workflow" ] || continue
  
  FILENAME=$(basename "$workflow")
  
  echo "Checking: $FILENAME"
  
  # Validate YAML syntax with Python
  if python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
    # Check for required GitHub Actions fields
    HAS_NAME=$(grep -q "^name:" "$workflow" && echo "yes" || echo "no")
    HAS_ON=$(grep -q "^on:" "$workflow" && echo "yes" || echo "no")
    
    if [ "$HAS_NAME" = "yes" ] && [ "$HAS_ON" = "yes" ]; then
      echo "  ✅ Valid YAML with required fields"
      VALIDATED=$((VALIDATED + 1))
    else
      echo "  ❌ Missing required fields (name or on)"
      ERRORS=$((ERRORS + 1))
    fi
  else
    echo "  ❌ Invalid YAML syntax:"
    python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>&1 | sed 's/^/    /'
    ERRORS=$((ERRORS + 1))
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
