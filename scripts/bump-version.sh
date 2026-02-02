#!/usr/bin/env bash
# Safely bump npm package version
# Usage: ./scripts/bump-version.sh [patch|minor|major|prepatch|preminor|premajor]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PKG_DIR="$REPO_ROOT/cli-installer"

# Check argument
if [ -z "$1" ]; then
  echo "Usage: ./scripts/bump-version.sh [patch|minor|major|prepatch|preminor|premajor]"
  echo ""
  echo "Version types:"
  echo "  patch      1.0.0 → 1.0.1  (bug fixes)"
  echo "  minor      1.0.0 → 1.1.0  (new features, backward compatible)"
  echo "  major      1.0.0 → 2.0.0  (breaking changes)"
  echo "  prepatch   1.0.0 → 1.0.1-0  (pre-release patch)"
  echo "  preminor   1.0.0 → 1.1.0-0  (pre-release minor)"
  echo "  premajor   1.0.0 → 2.0.0-0  (pre-release major)"
  exit 1
fi

VERSION_TYPE="$1"

# Validate version type
case "$VERSION_TYPE" in
  patch|minor|major|prepatch|preminor|premajor|prerelease)
    ;;
  *)
    echo "❌ Invalid version type: $VERSION_TYPE"
    echo "   Valid types: patch, minor, major, prepatch, preminor, premajor, prerelease"
    exit 1
    ;;
esac

# Check if package directory exists
if [ ! -d "$PKG_DIR" ]; then
  echo "❌ Package directory not found: $PKG_DIR"
  exit 1
fi

cd "$PKG_DIR"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
if [ -z "$CURRENT_VERSION" ]; then
  echo "❌ Cannot read version from package.json"
  exit 1
fi

echo "📦 Bumping cli-ai-skills version"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Current version: $CURRENT_VERSION"
echo "Increment type:  $VERSION_TYPE"
echo ""

# Check if version already published (for non-prerelease)
if [[ ! "$VERSION_TYPE" =~ ^pre ]]; then
  PUBLISHED_VERSION=$(npm view cli-ai-skills version 2>/dev/null || echo "0.0.0")
  
  if [ "$CURRENT_VERSION" = "$PUBLISHED_VERSION" ]; then
    echo "⚠️  Warning: Current version $CURRENT_VERSION is already published on npm"
    echo ""
  fi
fi

# Bump version (without creating git tag)
echo "⏳ Running npm version $VERSION_TYPE..."
npm version "$VERSION_TYPE" --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Version bumped successfully!"
echo ""
echo "Old version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Review changes:"
echo "   git diff cli-installer/package.json cli-installer/package-lock.json"
echo ""
echo "2. Update CHANGELOG.md (if not done yet):"
echo "   vim cli-installer/CHANGELOG.md"
echo ""
echo "3. Commit changes:"
echo "   git add cli-installer/package.json cli-installer/package-lock.json"
echo "   git commit -m 'chore: bump version to $NEW_VERSION'"
echo ""
echo "4. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "5. Trigger publish workflow:"
echo "   gh workflow run publish-npm.yml"
echo ""
echo "Or create a git tag (auto-triggers workflow):"
echo "   git tag v$NEW_VERSION"
echo "   git push origin v$NEW_VERSION"
echo ""
