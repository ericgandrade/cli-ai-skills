# Versioning Guide

This document defines the versioning strategy for the **cli-ai-skills** project and all individual skills.

---

## 📦 Package Versioning (cli-installer)

**File:** `cli-installer/package.json`  
**Current Version:** 1.3.1  
**Follows:** [Semantic Versioning 2.0.0](https://semver.org/)

### Version Format: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x) - Breaking changes to installer API or behavior
- **MINOR** (x.3.x) - New skills added or major skill upgrades
- **PATCH** (x.x.1) - Bug fixes, minor improvements, documentation updates

### When to Bump

| Change | Version Bump | Example |
|--------|-------------|---------|
| New skill added | MINOR | 1.2.0 → 1.3.0 |
| Skill upgraded to new major version | MINOR | 1.3.0 → 1.4.0 |
| Bug fix in installer | PATCH | 1.3.0 → 1.3.1 |
| Breaking change in installer CLI | MAJOR | 1.3.1 → 2.0.0 |
| Documentation update only | PATCH | 1.3.1 → 1.3.2 |

### NPM Publishing Rules

1. **Always update version** in `package.json` before publishing
2. **Always update CHANGELOG.md** with changes
3. **Always create git tag** matching the version (`v1.3.1`)
4. **Always push tags** to GitHub after publishing

---

## 🧩 Skill Versioning

**Files:** `.github/skills/*/SKILL.md` and `.claude/skills/*/SKILL.md`  
**Follows:** [Semantic Versioning 2.0.0](https://semver.org/)

### Version Format: `MAJOR.MINOR.PATCH`

Each skill maintains its **own independent version** in YAML frontmatter:

```yaml
---
name: skill-name
version: 1.2.0
---
```

### When to Bump

| Change | Version Bump | Example |
|--------|-------------|---------|
| Breaking change in skill behavior | MAJOR | 1.2.0 → 2.0.0 |
| New feature added to skill | MINOR | 1.2.0 → 1.3.0 |
| Bug fix or minor improvement | PATCH | 1.2.0 → 1.2.1 |
| Documentation update only | PATCH | 1.2.0 → 1.2.1 |

### Skill-Specific CHANGELOGs

Each skill with significant changes should have its own CHANGELOG:

- **File:** `.github/skills/<skill-name>/CHANGELOG.md`
- **Mirror:** `.claude/skills/<skill-name>/CHANGELOG.md`

Example: `audio-transcriber` has a CHANGELOG because it went from v1.0.0 → v1.1.0 with major features.

**Not all skills need a CHANGELOG** - only those with multiple versions or complex changes.

---

## 🔄 Synchronization Rules

### Dual-Platform Parity

All skills **must** maintain identical versions across platforms:

```
.github/skills/skill-name/SKILL.md → version: 1.2.0
.claude/skills/skill-name/SKILL.md → version: 1.2.0  ✅ SAME
```

### Version Consistency Matrix

| File | Version Field | Must Match |
|------|---------------|------------|
| `cli-installer/package.json` | `"version"` | NPM published version |
| `cli-installer/CHANGELOG.md` | `## [X.Y.Z]` heading | package.json version |
| `.github/skills/*/SKILL.md` | `version:` frontmatter | `.claude/skills/*/SKILL.md` |
| `.github/skills/README.md` | Skill headers (`v1.2.0`) | SKILL.md version |
| `.claude/skills/README.md` | Skill headers (`v1.2.0`) | SKILL.md version |
| `README.md` (root) | Skill sections (`v1.2.0`) | SKILL.md version |
| Git tags | `v1.3.1` | package.json version |

---

## 🏷️ Git Tagging Strategy

### Tag Format

**Installer releases only:**
```
v1.3.1  → matches cli-installer/package.json version
```

**Do NOT tag individual skills** - only the NPM package releases.

### Tagging Workflow

```bash
# After bumping version in package.json and updating CHANGELOG.md
git add -A
git commit -m "chore: bump version to X.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin main
git push origin vX.Y.Z
```

### Viewing Tags

```bash
# List all tags
git tag -l

# View specific tag details
git show v1.3.1
```

---

## 📝 Release Checklist

Use this checklist for every release to ensure consistency:

### Pre-Release

- [ ] All skills have correct versions in SKILL.md (both .github and .claude)
- [ ] Skills index READMEs updated (.github/skills/README.md + .claude/skills/README.md)
- [ ] Root README.md updated with skill versions
- [ ] Individual skill READMEs updated (if skill changed)
- [ ] Skill CHANGELOGs created/updated (for major skill changes)

### Package Release

- [ ] Bump version in `cli-installer/package.json`
- [ ] Update `cli-installer/CHANGELOG.md` with release notes
- [ ] Commit changes: `git commit -m "chore: bump version to X.Y.Z"`
- [ ] Create git tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
- [ ] Push commits: `git push origin main`
- [ ] Push tags: `git push origin vX.Y.Z`
- [ ] Publish to NPM: `npm publish` (from cli-installer directory)

### Post-Release

- [ ] Verify NPM package published: `npm view cli-ai-skills`
- [ ] Verify git tag on GitHub: Check releases page
- [ ] Test installation: `npx cli-ai-skills@latest install <skill>`
- [ ] Update GitHub release notes (optional but recommended)

---

## 🧪 Version Verification Commands

Run these to audit version consistency:

```bash
# Check package version
cat cli-installer/package.json | grep '"version"'

# Check all skill versions
for skill in .github/skills/*/SKILL.md; do
  echo "$(basename $(dirname $skill)): $(grep '^version:' $skill)"
done

# Check git tags
git tag -l | sort -V

# Check NPM published versions
npm view cli-ai-skills versions

# Verify dual-platform sync
diff .github/skills/README.md .claude/skills/README.md
```

---

## 📊 Current State (as of 2026-02-03)

### Package Version
- **cli-installer:** 1.3.1 ✅
- **NPM Published:** 1.3.1 ✅
- **Git Tag:** v1.3.1 ✅

### Skill Versions
- **prompt-engineer:** 1.0.1 ✅
- **skill-creator:** 1.1.0 ✅
- **youtube-summarizer:** 1.2.0 ✅
- **audio-transcriber:** 1.1.0 ✅

### Synchronization Status
- ✅ All SKILL.md versions match across .github and .claude
- ✅ Skills index READMEs updated with all 4 skills
- ✅ Root README.md reflects current skill versions
- ✅ CHANGELOG.md matches package.json version
- ✅ Git tag created and pushed
- ✅ NPM package published

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Forgetting to update .claude/** when changing .github/
2. ❌ **Version mismatch** between SKILL.md and README.md headers
3. ❌ **Publishing to NPM without git tag**
4. ❌ **Creating tags for skills** (only tag installer releases)
5. ❌ **Skipping CHANGELOG.md updates**
6. ❌ **Not testing `npx cli-ai-skills@latest` after publishing**

---

## 📚 References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [NPM Versioning Guide](https://docs.npmjs.com/about-semantic-versioning)
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)

---

**Last Updated:** February 3, 2026  
**Maintainer:** Eric Andrade

## Platform Addition Versioning Strategy

When adding support for a new platform (e.g., Codex):

1. **Skills:** PATCH bump (X.Y.Z → X.Y.Z+1)
   - Rationale: Technical adaptation, not new functionality
   - Changes: Remove/add platform-specific elements (triggers, examples)
   - Workflows remain 100% identical

2. **NPM Package:** MINOR bump (X.Y.Z → X.Y+1.0)
   - Rationale: New platform = new feature for end users
   - Reflects repository-level enhancement

Example (v1.4.0):
  - prompt-engineer: 1.0.1 → 1.0.2
  - skill-creator: 1.1.0 → 1.1.1
  - youtube-summarizer: 1.1.0 → 1.1.1
  - audio-transcriber: 1.1.0 → 1.1.1
  - cli-ai-skills (NPM): 1.3.1 → 1.4.0

## Tri-Platform Synchronization Matrix

| Component | .github | .claude | .codex | Sync Required? |
|-----------|---------|---------|--------|----------------|
| SKILL.md workflows | ✓ | ✓ | ✓ | YES (100% identical) |
| YAML frontmatter | Triggers ✓ | Triggers ✓ | No triggers | Partial |
| Examples | copilot> | claude> | codex> | Platform-specific |
| Zero-config design | ✓ | ✓ | ✓ | YES (philosophy) |
