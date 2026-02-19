# GitHub Actions Workflows Guide

This document provides guidelines, best practices, and troubleshooting for GitHub Actions workflows in this repository.

## 📋 Table of Contents

- [Available Workflows](#available-workflows)
- [YAML Best Practices](#yaml-best-practices)
- [Validation Tools](#validation-tools)
- [Troubleshooting](#troubleshooting)
- [Common Errors](#common-errors)

---

## Available Workflows

### 1. `publish-npm.yml`

**Purpose:** Automatically publish the `claude-superskills` package to npm when version is bumped.

**Triggers:**
- Manual dispatch (workflow_dispatch)
- Push to tags matching `v*` pattern

**Key Requirements:**
- Package version in `cli-installer/package.json` must be NEW (not already published)
- `package-lock.json` must exist in `cli-installer/`
- All tests must pass (`npm test`)
- Valid `NPM_TOKEN` secret configured

**Configuration:**
```yaml
working-directory: ./cli-installer  # CRITICAL: Package is in subdirectory
```

**Manual Execution:**
```bash
# Via GitHub CLI
gh workflow run publish-npm.yml

# Via GitHub UI
# Navigate to: Actions → publish-npm.yml → Run workflow
```

### 2. `validate.yml` (Continuous Integration)

**Purpose:** Validate workflows, skills, and package integrity on every push/PR.

**Checks:**
- YAML syntax in all workflows
- Skills YAML frontmatter validation
- Skills content quality validation
- npm package tests

**Triggers:**
- Push to `main` branch
- Pull requests to `main`

---

## YAML Best Practices

### Indentation Rules

GitHub Actions YAML is **extremely sensitive** to indentation. Follow these rules strictly:

#### ✅ CORRECT Structure

```yaml
name: My Workflow

on:                      # Root level (0 spaces)
  push:                  # 2 spaces
    branches:            # 4 spaces
      - main             # 6 spaces
  workflow_dispatch:     # 2 spaces

jobs:                    # Root level (0 spaces)
  build:                 # 2 spaces
    runs-on: ubuntu-latest  # 4 spaces
    steps:               # 4 spaces
      - name: Checkout   # 6 spaces
        uses: actions/checkout@v4  # 8 spaces
        
      - name: Run command  # 6 spaces
        run: echo "Hello"  # 8 spaces
```

#### ❌ COMMON MISTAKES

```yaml
# WRONG: jobs nested under triggers
on:
  push:
    branches:
      - main
      jobs:              # ❌ Should be at root level!
        build:
```

```yaml
# WRONG: Inconsistent indentation
on:
  push:
      branches:          # ❌ Should be 4 spaces, not 6
            - main       # ❌ Should be 6 spaces, not 12
```

```yaml
# WRONG: Mixing tabs and spaces
on:
→ push:                  # ❌ Tab character
  branches:              # ❌ Spaces
```

### Multi-line Strings

```yaml
# Preferred: Use | for multi-line commands
- name: Multi-line script
  run: |
    echo "Line 1"
    echo "Line 2"
    echo "Line 3"

# Alternative: Use > for folded text
- name: Long description
  run: >
    This is a very long command
    that spans multiple lines
    but will be joined together
```

### Working Directory

When `package.json` is NOT in repository root:

```yaml
steps:
  - name: Install dependencies
    working-directory: ./cli-installer  # Specify subdirectory
    run: npm ci
    
  - name: Run tests
    working-directory: ./cli-installer
    run: npm test
    
  - name: Publish
    working-directory: ./cli-installer
    run: npm publish
```

### Environment Variables

```yaml
env:
  NODE_VERSION: '20'
  
jobs:
  build:
    env:
      CI: true
    steps:
      - name: Use env var
        run: echo ${{ env.NODE_VERSION }}
```

---

## Validation Tools

### 1. GitHub CLI (Recommended)

```bash
# Validate workflow syntax
gh workflow view publish-npm.yml

# List all workflows
gh workflow list

# View workflow run logs
gh run list
gh run view <run-id>
```

### 2. yamllint

```bash
# Install
brew install yamllint  # macOS
apt install yamllint   # Ubuntu

# Validate single file
yamllint .github/workflows/publish-npm.yml

# Validate all workflows
yamllint .github/workflows/*.yml
```

### 3. actionlint (GitHub Actions-specific)

```bash
# Install
brew install actionlint  # macOS

# Validate workflows
actionlint .github/workflows/*.yml
```

### 4. VS Code Extensions

- **YAML** by Red Hat (syntax highlighting + validation)
- **GitHub Actions** by GitHub (autocomplete + inline docs)

---

## Troubleshooting

### Workflow Not Triggering

**Problem:** Pushed code but workflow didn't run.

**Checklist:**
- [ ] Verify trigger conditions in `on:` section
- [ ] Check branch name matches (e.g., `main` vs `master`)
- [ ] Ensure workflow file is in `.github/workflows/`
- [ ] Validate YAML syntax with `gh workflow view`

**Example Debug:**
```bash
# Check workflow status
gh workflow list

# View recent runs
gh run list --workflow=publish-npm.yml
```

### YAML Syntax Error

**Problem:** `Invalid workflow file` error on push.

**Solution:**
1. **Validate locally BEFORE pushing:**
   ```bash
   yamllint .github/workflows/publish-npm.yml
   gh workflow view publish-npm.yml
   ```

2. **Check indentation:**
   - Use **2 spaces** per level (NOT tabs)
   - Ensure consistent spacing
   - Verify root-level keys (`name`, `on`, `jobs`) at column 0

3. **Common fixes:**
   ```bash
   # Convert tabs to spaces
   expand -t 2 workflow.yml > workflow_fixed.yml
   
   # Check for mixed line endings
   dos2unix .github/workflows/*.yml
   ```

### npm ci Failed: package-lock.json Not Found

**Problem:** `npm ci` requires existing package-lock.json with lockfileVersion >= 1.

**Solution:**
```bash
cd cli-installer
npm install  # Generates package-lock.json
git add package-lock.json
git commit -m "chore: add package-lock.json"
git push
```

**Prevention:** Always commit `package-lock.json` alongside `package.json`.

### 403 Forbidden: Version Already Published

**Problem:** Cannot publish version X.Y.Z - already exists on npm.

**Solution:**
```bash
cd cli-installer

# Increment version (choose one)
npm version patch  # 1.0.0 → 1.0.1 (bug fixes)
npm version minor  # 1.0.0 → 1.1.0 (new features)
npm version major  # 1.0.0 → 2.0.0 (breaking changes)

# Commit version bump
cd ..
git add cli-installer/package.json cli-installer/package-lock.json
git commit -m "chore: bump version to $(node -p "require('./cli-installer/package.json').version")"
git push
```

**Prevention:** Use `scripts/bump-version.sh` to automate this process.

### Working Directory Errors

**Problem:** Commands fail because package.json is in subdirectory.

**Solution:** Add `working-directory` to ALL npm-related steps:

```yaml
steps:
  - name: Install
    working-directory: ./cli-installer  # ✅ Add this
    run: npm ci
    
  - name: Test
    working-directory: ./cli-installer  # ✅ Add this
    run: npm test
    
  - name: Publish
    working-directory: ./cli-installer  # ✅ Add this
    run: npm publish
```

---

## Common Errors

### Error: `jobs` unexpected

**Cause:** `jobs:` nested under `on:` instead of root level.

**Fix:**
```yaml
# ❌ WRONG
on:
  push:
    branches:
      - main
      jobs:        # Indented too far
        build:

# ✅ CORRECT
on:
  push:
    branches:
      - main

jobs:              # Root level
  build:
```

### Error: Invalid value for `on`

**Cause:** Missing required fields or incorrect syntax.

**Fix:**
```yaml
# ❌ WRONG
on:
  push:
    - main       # Missing 'branches:' key

# ✅ CORRECT
on:
  push:
    branches:
      - main
```

### Error: `npm ERR! code EUSAGE`

**Cause:** Running `npm ci` without `package-lock.json`.

**Fix:**
```bash
npm install          # Generate package-lock.json
git add package-lock.json
git commit -m "chore: add lockfile"
```

### Error: Workflow permission denied

**Cause:** Missing repository secrets or permissions.

**Fix:**
1. **Check secrets:** Settings → Secrets and variables → Actions
2. **Required secrets:**
   - `NPM_TOKEN` (for npm publish)
3. **Repository permissions:** Settings → Actions → General → Workflow permissions
   - Enable "Read and write permissions"

---

## Best Practices Checklist

Before modifying workflows:

- [ ] Validate YAML syntax locally (`yamllint`, `gh workflow view`)
- [ ] Test changes in a fork/branch first
- [ ] Use `workflow_dispatch` trigger for manual testing
- [ ] Add comments explaining complex logic
- [ ] Keep workflows DRY (use reusable workflows/composite actions)
- [ ] Pin action versions (`@v4`, not `@main`)
- [ ] Set explicit timeouts (`timeout-minutes: 10`)
- [ ] Use caching for dependencies (`actions/cache`)

Before publishing to npm:

- [ ] Version bumped in `package.json`
- [ ] Version follows SemVer (patch/minor/major)
- [ ] Tests pass locally (`npm test`)
- [ ] No uncommitted changes
- [ ] `package-lock.json` committed
- [ ] Run `scripts/pre-publish-check.sh`

---

## Quick Reference

### Manual Workflow Execution

```bash
# Trigger workflow manually
gh workflow run publish-npm.yml

# Check status
gh run list --workflow=publish-npm.yml --limit 5

# View logs
gh run view <run-id> --log
```

### Validate Before Push

```bash
# Validate all workflows
./scripts/validate-workflows.sh

# Check npm package
./scripts/pre-publish-check.sh

# Bump version safely
./scripts/bump-version.sh patch  # or minor/major
```

### Emergency Rollback

```bash
# Cancel running workflow
gh run cancel <run-id>

# Unpublish from npm (within 72 hours)
npm unpublish claude-superskills@<version>

# Revert commit
git revert <commit-sha>
git push
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/best-practices-for-workflows)
- [npm CLI Documentation](https://docs.npmjs.com/cli/v9)
- [Semantic Versioning](https://semver.org/)

---

**Last Updated:** 2026-02-02  
**Maintained By:** Repository maintainers  
**Questions?** Open an issue or discussion on GitHub
