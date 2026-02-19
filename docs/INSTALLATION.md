# Installation Guide

Complete guide for installing **CLI AI Skills** on your system.

## 📋 Table of Contents

- [Quick Install](#-quick-install)
- [Installation Methods](#-installation-methods)
- [Requirements](#-requirements)
- [Platform-Specific Notes](#-platform-specific-notes)
- [Troubleshooting](#-troubleshooting)
- [Uninstallation](#-uninstallation)
- [Upgrading](#-upgrading)

---

## 🚀 Quick Install

**Recommended (one-liner):**

```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

Or with wget:

```bash
wget -qO- https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

This script will:
- ✅ Detect your operating system (macOS/Linux/WSL)
- ✅ Verify Node.js >= 16.0.0 is installed
- ✅ Offer to install Node.js via nvm if missing
- ✅ Install claude-superskills globally via npm
- ✅ Detect installed AI CLI tools (Copilot, Claude, Codex, OpenCode, Gemini)
- ✅ Show next steps

---

## 📦 Installation Methods

### Method 1: Shell Installer (Recommended)

**Interactive install:**
```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

**Non-interactive (CI/CD):**
```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash -s -- --yes
```

**With options:**
```bash
# Skip Node.js version check
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash -s -- --skip-node-check

# Verbose output
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash -s -- --verbose

# Help
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash -s -- --help
```

**Advantages:**
- ✅ Works without Node.js pre-installed
- ✅ One-line command
- ✅ Detects and guides Node.js installation
- ✅ Detects AI tools automatically
- ✅ CI/CD friendly with `--yes` flag

---

### Method 2: NPX (Zero-Install)

```bash
npx claude-superskills
```

**Advantages:**
- ✅ No installation needed
- ✅ Always uses latest version
- ✅ Doesn't pollute global namespace
- ✅ Works immediately if you have Node.js

**Best for:**
- Quick one-time use
- Testing before installing
- Always wanting latest version

---

### Method 3: NPM Global Install

```bash
npm install -g claude-superskills
```

Then run:
```bash
claude-superskills
```

**Advantages:**
- ✅ Permanent command in PATH
- ✅ Works offline after install
- ✅ Faster startup (already installed)
- ✅ Pin specific version

**Best for:**
- Regular users
- Offline environments
- Controlled versioning

---

### Method 4: Local Development

For contributors or local testing:

```bash
git clone https://github.com/ericgandrade/claude-superskills.git
cd claude-superskills/cli-installer
npm link
```

This creates a symlink to your local copy. Any changes you make will be reflected immediately.

**Unlink:**
```bash
npm unlink -g claude-superskills
```

---

## 📋 Requirements

### Minimum Requirements

- **Node.js:** >= 16.0.0 (LTS recommended)
- **npm:** >= 7.0.0 (comes with Node.js)
- **Operating System:** macOS, Linux, or WSL

### Recommended

- **Node.js:** >= 18.0.0 (Active LTS)
- **AI CLI Tool:** At least one of:
  - GitHub Copilot CLI (`gh copilot`)
  - Claude Code (directory: `~/.claude`)
  - OpenAI Codex (directory: `~/.codex`)
  - OpenCode CLI (`opencode`)
  - Gemini CLI (`gemini`)

### Installing Node.js

If you don't have Node.js installed, the shell installer will guide you. Or install manually:

#### Using nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js LTS
nvm install --lts
nvm use --lts
```

#### Using Package Managers

**macOS (Homebrew):**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nodejs npm
```

**CentOS/RedHat:**
```bash
sudo yum install nodejs npm
```

#### Official Installer

Download from: https://nodejs.org/

---

## 🖥️ Platform-Specific Notes

### macOS

**Full support** ✅

```bash
# Verify Node.js
node --version  # Should be >= 16.0.0

# Install via shell script (recommended)
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

---

### Linux (Ubuntu, Debian, CentOS, Fedora, etc.)

**Full support** ✅

```bash
# Verify Node.js
node --version

# Install via shell script
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash

# Or with wget
wget -qO- https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

---

### Windows (WSL)

**Full support via WSL** ✅

1. Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install
2. Open WSL terminal
3. Run installer:

```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
```

---

### Windows (Git Bash/PowerShell)

**Use NPM method** ⚠️

The shell installer doesn't work on pure Windows. Use npm instead:

```bash
# PowerShell or Git Bash
npm install -g claude-superskills

# Or use npx
npx claude-superskills
```

---

## 🔧 Troubleshooting

### Issue: "Node.js not found"

**Solution:** Install Node.js >= 16.0.0

```bash
# Check if Node.js is installed
node --version

# If not, install via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

---

### Issue: "npm command not found"

**Solution:** npm comes with Node.js. Reinstall Node.js.

```bash
# If using nvm
nvm install --lts

# Or download from nodejs.org
```

---

### Issue: "Permission denied" when installing globally

**Solution:** Use nvm or fix npm permissions

**Option 1: Use nvm (recommended)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

**Option 2: Fix npm permissions**
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

### Issue: "claude-superskills: command not found" after install

**Solution:** Reload your shell or check PATH

```bash
# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Verify installation
npm list -g claude-superskills

# Check PATH
echo $PATH | grep npm
```

---

### Issue: Shell installer fails on macOS

**Solution:** Check curl and bash versions

```bash
# Verify curl
curl --version

# Try with bash explicitly
bash <(curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh)

# Or download and run
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

---

### Issue: "No AI CLI tools detected"

This is **normal** if you haven't installed GitHub Copilot CLI, Claude Code, or other supported tools yet.

**What to do:**
1. Install at least one AI CLI tool first:
   - **GitHub Copilot CLI:** https://github.com/github/copilot-cli
   - **Claude Code:** https://claude.ai/code
   - **OpenAI Codex:** https://openai.com/codex
   - **OpenCode:** https://opencode.ai
   - **Gemini CLI:** https://gemini.google.com/cli

2. After installing, run `npx claude-superskills` again

---

### Issue: Codex App not detecting skills

**Symptoms:**
- Skills installed successfully
- Codex CLI (`codex --version`) works
- Skills don't appear in Codex App

**Root Cause:**
Codex uses a non-standard path structure: `~/.codex/vendor_imports/skills/skills/.curated/`

**Solution:** The installer now handles this automatically (v1.7.3+)

**Verify installation:**
```bash
# Check if skills are in the correct location
ls -la ~/.codex/vendor_imports/skills/skills/.curated/

# You should see symlinks to:
# - skill-creator
# - prompt-engineer
# - youtube-summarizer
# - audio-transcriber
```

**If skills are missing:**
```bash
# Reinstall
npx claude-superskills --all -y

# Or use doctor command to diagnose
npx claude-superskills doctor
```

**Restart Codex App:**
After installation, you may need to:
1. Quit Codex App completely
2. Reopen Codex App
3. Skills should now appear in the skills menu

**Manual Installation (fallback):**
```bash
# Create directory structure
mkdir -p ~/.codex/vendor_imports/skills/skills/.curated

# Clone repository
git clone https://github.com/ericgandrade/claude-superskills.git

# Create symlinks manually
cd ~/.codex/vendor_imports/skills/skills/.curated
ln -s /path/to/claude-superskills/.codex/skills/skill-creator skill-creator
ln -s /path/to/claude-superskills/.codex/skills/prompt-engineer prompt-engineer
ln -s /path/to/claude-superskills/.codex/skills/youtube-summarizer youtube-summarizer
ln -s /path/to/claude-superskills/.codex/skills/audio-transcriber audio-transcriber
```

---
   - **Claude Code:** https://code.claude.ai/
   
2. Run `claude-superskills` again - it will detect the tools

The installer works fine without AI tools, but you won't be able to install skills until you have one.

---

## 🗑️ Uninstallation

### Quick Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/uninstall.sh | bash
```

### Manual Uninstall

**Remove npm package:**
```bash
npm uninstall -g claude-superskills
```

**Remove installed skills:**
```bash
# GitHub Copilot CLI
rm -rf ~/.copilot/skills/*

# Claude Code
rm -rf ~/.claude/skills/*

# Codex
rm -rf ~/.codex/skills/*

# OpenCode
rm -rf ~/.opencode/skills/*

# Gemini CLI
rm -rf ~/.gemini/skills/*
```

### Uninstaller Options

```bash
# Dry run (see what would be removed)
bash uninstall.sh --dry-run

# Non-interactive
bash uninstall.sh --yes

# Remove everything including configs
bash uninstall.sh --yes --purge
```

---

## ⬆️ Upgrading

### Upgrade via NPX (Automatic)

If you use npx, you always get the latest version:

```bash
npx claude-superskills
```

### Upgrade Global Install

```bash
npm update -g claude-superskills
```

Or reinstall:

```bash
npm uninstall -g claude-superskills
npm install -g claude-superskills
```

### Upgrade via Shell Installer

The shell installer always installs the latest version:

```bash
curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash -s -- --yes
```

### Check Current Version

```bash
claude-superskills --version
```

Or:

```bash
npm list -g claude-superskills
```

---

## 📚 Additional Resources

- **GitHub Repository:** https://github.com/ericgandrade/claude-superskills
- **NPM Package:** https://npmjs.com/package/claude-superskills
- **Issues:** https://github.com/ericgandrade/claude-superskills/issues
- **Changelog:** https://github.com/ericgandrade/claude-superskills/blob/main/cli-installer/CHANGELOG.md

---

## 🤝 Need Help?

If you encounter issues not covered here:

1. Check existing issues: https://github.com/ericgandrade/claude-superskills/issues
2. Create a new issue with:
   - Your OS and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Error message
   - Steps to reproduce

We're here to help! 🚀
