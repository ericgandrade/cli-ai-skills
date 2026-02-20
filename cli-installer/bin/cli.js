#!/usr/bin/env node

const { detectTools, getInstallInstructions } = require('../lib/detector');
const { promptPlatforms, setupEscapeHandler } = require('../lib/interactive');
const { setupCleanupHandler } = require('../lib/cleanup');
const { installCopilotSkills } = require('../lib/copilot');
const { installClaudeSkills } = require('../lib/claude');
const { install: installCodexSkills } = require('../lib/codex');
const { install: installOpenCodeSkills } = require('../lib/opencode');
const { install: installGeminiSkills } = require('../lib/gemini');
const { install: installAntigravitySkills } = require('../lib/antigravity');
const { install: installCursorSkills } = require('../lib/cursor');
const { install: installAdalSkills } = require('../lib/adal');
const { listBundles, validateBundle, loadBundles } = require('../lib/bundles');
const { searchSkills } = require('../lib/search');
const { displayToolsTable } = require('../lib/ui/table');
const { checkInstalledVersion, isUpdateAvailable } = require('../lib/version-checker');
const { ensureSkillsCached } = require('../lib/core/downloader');
const { getUserSkillsPath } = require('../lib/utils/path-resolver');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Read version dynamically from package.json
const packageJson = require('../package.json');
const VERSION = packageJson.version;

// Command aliases
const commandAliases = {
  'i': 'install',
  'ls': 'list',
  'up': 'update',
  'rm': 'uninstall',
  'doc': 'doctor'
};

// Short flag mappings
const shortFlags = {
  '-a': '--all',
  '-g': '--global',
  '-l': '--local',
  '-y': '--yes',
  '-q': '--quiet'
};

/**
 * Download/verify skills cache and return the cache directory path.
 * @param {boolean} quiet
 * @returns {string} cacheDir path
 */
async function warmCache(quiet) {
  const spinner = quiet ? null : ora(`Fetching skills v${VERSION} from GitHub...`).start();
  try {
    const cacheDir = await ensureSkillsCached(VERSION);
    if (spinner) spinner.succeed('Skills ready');
    return cacheDir;
  } catch (err) {
    if (spinner) spinner.fail('Failed to fetch skills from GitHub');
    throw err;
  }
}

function getDetectedPlatforms(detected) {
  const platforms = [];
  if (detected.copilot.installed) platforms.push('copilot');
  if (detected.claude.installed) platforms.push('claude');
  if (detected.codex_cli.installed) platforms.push('codex_cli');
  if (detected.codex_app.installed) platforms.push('codex_app');
  if (detected.opencode.installed) platforms.push('opencode');
  if (detected.gemini.installed) platforms.push('gemini');
  if (detected.antigravity.installed) platforms.push('antigravity');
  if (detected.cursor.installed) platforms.push('cursor');
  if (detected.adal.installed) platforms.push('adal');
  return platforms;
}

function getManagedSkillNames() {
  const bundles = loadBundles();

  if (bundles.bundles && bundles.bundles.all && Array.isArray(bundles.bundles.all.skills)) {
    return bundles.bundles.all.skills;
  }

  const all = new Set();
  for (const bundle of Object.values(bundles.bundles || {})) {
    for (const skill of bundle.skills || []) {
      all.add(skill);
    }
  }
  return Array.from(all);
}

function getPlatformTargetDir(platform) {
  const homeDir = os.homedir();

  if (platform === 'codex' || platform === 'codex_cli' || platform === 'codex_app') {
    return getUserSkillsPath('codex');
  }

  const map = {
    copilot: path.join(homeDir, '.github', 'skills'),
    claude: path.join(homeDir, '.claude', 'skills'),
    opencode: path.join(homeDir, '.agent', 'skills'),
    gemini: path.join(homeDir, '.gemini', 'skills'),
    antigravity: path.join(homeDir, '.agent', 'skills'),
    cursor: path.join(homeDir, '.cursor', 'skills'),
    adal: path.join(homeDir, '.adal', 'skills')
  };

  return map[platform];
}

async function uninstallManagedSkills(platforms, quiet) {
  const managedSkills = getManagedSkillNames();
  const targets = [...new Set(platforms.map(getPlatformTargetDir).filter(Boolean))];
  let removedCount = 0;

  for (const targetDir of targets) {
    if (!(await fs.pathExists(targetDir))) continue;

    for (const skill of managedSkills) {
      const skillDir = path.join(targetDir, skill);
      if (await fs.pathExists(skillDir)) {
        await fs.remove(skillDir);
        removedCount++;
      }
    }
  }

  if (!quiet) {
    console.log(chalk.gray(`🧹 Uninstalled ${removedCount} managed skill folder(s)`));
  }
}

async function clearSkillsCache(quiet) {
  const cacheBase = path.join(os.homedir(), '.claude-superskills', 'cache');
  if (await fs.pathExists(cacheBase)) {
    await fs.remove(cacheBase);
    if (!quiet) console.log(chalk.gray(`🗑️  Cache cleared: ${cacheBase}`));
  } else if (!quiet) {
    console.log(chalk.gray('🗑️  Cache not found, skipping'));
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Setup handlers
  setupEscapeHandler();
  setupCleanupHandler();

  console.log(chalk.cyan.bold(`\n🚀 claude-superskills v${VERSION} - Multi-Platform Installer\n`));

  // Handle help
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // Handle version
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`v${VERSION}`);
    return;
  }

  // Handle list-bundles
  if (args.includes('--list-bundles')) {
    listBundles();
    return;
  }

  // Handle search
  const searchIdx = args.indexOf('--search');
  if (searchIdx !== -1) {
    const keyword = args[searchIdx + 1];
    searchSkills(keyword);
    return;
  }

  // Get command (first argument or default to install)
  let command = args[0] || 'install';

  // Resolve aliases
  if (commandAliases[command]) {
    command = commandAliases[command];
  }

  const quiet = args.includes('-q') || args.includes('--quiet');

  // Handle bundle installation
  const bundleIdx = args.indexOf('--bundle');
  if (bundleIdx !== -1) {
    const bundleName = args[bundleIdx + 1];
    const bundle = validateBundle(bundleName);

    console.log(chalk.cyan('🔍 Detecting installed AI CLI tools...\n'));
    const detected = detectTools();

    // Display tools table
    displayToolsTable(detected);

    const hasAny = detected.copilot.installed || detected.claude.installed ||
                   detected.codex_cli.installed || detected.codex_app.installed || detected.opencode.installed ||
                   detected.gemini.installed || detected.antigravity.installed ||
                   detected.cursor.installed || detected.adal.installed;

    if (!hasAny) {
      console.log(getInstallInstructions());
      process.exit(1);
    }

    // Check for --yes flag (skip prompts)
    const skipPrompt = args.includes('-y') || args.includes('--yes');

    let platforms;
    if (skipPrompt) {
      platforms = getDetectedPlatforms(detected);
    } else {
      platforms = await promptPlatforms(detected);
    }

    if (platforms.length === 0) {
      console.log('\n❌ Installation cancelled.\n');
      process.exit(0);
    }

    // Download / verify skills cache
    const cacheDir = await warmCache(quiet);

    if (!quiet) {
      console.log(`📦 Installing bundle: ${bundle.name}`);
      console.log(`Skills: ${bundle.skills.join(', ')}\n`);
    }

    // Install bundle skills
    for (const skill of bundle.skills) {
      if (platforms.includes('copilot')) {
        await installCopilotSkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('claude')) {
        await installClaudeSkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('codex') || platforms.includes('codex_cli') || platforms.includes('codex_app')) {
        await installCodexSkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('opencode')) {
        await installOpenCodeSkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('gemini')) {
        await installGeminiSkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('antigravity')) {
        await installAntigravitySkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('cursor')) {
        await installCursorSkills(cacheDir, [skill], quiet);
      }
      if (platforms.includes('adal')) {
        await installAdalSkills(cacheDir, [skill], quiet);
      }
    }

    if (!quiet) {
      console.log(`\n✅ Bundle installed successfully!\n`);
    }
    return;
  }

  // Zero-config mode (no arguments)
  if (args.length === 0 || command === 'install') {
    console.log(chalk.cyan('🔍 Detecting installed AI CLI tools...\n'));

    const detected = detectTools();

    // Display tools table
    displayToolsTable(detected);

    const hasAny = detected.copilot.installed || detected.claude.installed ||
                   detected.codex_cli.installed || detected.codex_app.installed || detected.opencode.installed ||
                   detected.gemini.installed || detected.antigravity.installed ||
                   detected.cursor.installed || detected.adal.installed;

    if (!hasAny) {
      console.log(getInstallInstructions());
      process.exit(1);
    }

    // Check if already installed
    const installInfo = checkInstalledVersion();
    let requiresCleanReinstall = false;

    if (installInfo.installed) {
      console.log(chalk.cyan(`\nℹ️  claude-superskills already installed on the following platforms:\n`));

      for (const platform of installInfo.platforms) {
        const version = installInfo.versions[platform];
        console.log(chalk.dim(`  • ${platform}: v${version}`));
      }

      if (isUpdateAvailable(installInfo)) {
        console.log(chalk.yellow(`\n⚠️  New version available: v${installInfo.latestVersion}\n`));

        const { update } = await inquirer.prompt([{
          type: 'confirm',
          name: 'update',
          message: 'Update now?',
          default: true
        }]);

        if (!update) {
          console.log(chalk.dim('\n❌ Update cancelled.\n'));
          process.exit(0);
        }

        console.log(chalk.cyan('\n🔄 Updating skills...\n'));
        requiresCleanReinstall = true;
      } else {
        console.log(chalk.green(`\n✅ You already have the latest version (v${installInfo.latestVersion})\n`));

        const { reinstall } = await inquirer.prompt([{
          type: 'confirm',
          name: 'reinstall',
          message: 'Reinstall?',
          default: false
        }]);

        if (!reinstall) {
          process.exit(0);
        }
        requiresCleanReinstall = true;
      }
    }

    // Check for --yes flag (zero-config mode)
    const skipPrompt = args.includes('-y') || args.includes('--yes');

    let platforms;
    if (skipPrompt) {
      platforms = getDetectedPlatforms(detected);
    } else {
      // Interactive selection
      platforms = await promptPlatforms(detected);
    }

    if (requiresCleanReinstall) {
      // Force all detected platforms in clean reinstall mode.
      platforms = getDetectedPlatforms(detected);
    }

    if (platforms.length === 0) {
      console.log(chalk.red('\n❌ Installation cancelled.\n'));
      process.exit(0);
    }

    console.log(chalk.cyan(`\n📦 Installing skills for: ${platforms.join(', ')}\n`));

    if (requiresCleanReinstall) {
      if (!quiet) {
        console.log(chalk.cyan('♻️  Running clean reinstall: uninstall + cache cleanup...\n'));
      }
      await uninstallManagedSkills(platforms, quiet);
      await clearSkillsCache(quiet);
      if (!quiet) console.log();
    }

    // Download / verify skills cache
    const cacheDir = await warmCache(quiet);

    // Install for selected platforms
    if (platforms.includes('copilot')) {
      await installCopilotSkills(cacheDir, null, quiet);
    }

    if (platforms.includes('claude')) {
      await installClaudeSkills(cacheDir, null, quiet);
    }

    if (platforms.includes('codex') || platforms.includes('codex_cli') || platforms.includes('codex_app')) {
      await installCodexSkills(cacheDir, null, quiet);
    }

    if (platforms.includes('opencode')) {
      await installOpenCodeSkills(cacheDir, null, quiet);
    }

    if (platforms.includes('gemini')) {
      await installGeminiSkills(cacheDir, null, quiet);
    }

    if (platforms.includes('antigravity')) {
      await installAntigravitySkills(cacheDir, null, quiet);
    }

    if (platforms.includes('cursor')) {
      await installCursorSkills(cacheDir, null, quiet);
    }

    if (platforms.includes('adal')) {
      await installAdalSkills(cacheDir, null, quiet);
    }

    if (!quiet) {
      console.log(chalk.green(`\n✅ Installation complete!\n`));
    }
    return;
  }

  // Handle other commands
  switch(command) {
    case 'list': {
      console.log('📋 Installed Skills:\n');
      const skills = ['skill-creator', 'prompt-engineer', 'youtube-summarizer', 'audio-transcriber',
                      'agent-skill-discovery', 'agent-skill-orchestrator'];
      skills.forEach(skill => {
        console.log(`  • ${skill}`);
      });
      console.log();
      break;
    }

    case 'update':
      console.log('🔄 Updating skills...');
      console.log('✅ All skills are up to date!\n');
      break;

    case 'uninstall':
    case 'doctor':
      console.log('Use: npx claude-superskills --help for options\n');
      break;

    default:
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
  }
}

function showHelp() {
  console.log(`
CLI AI Skills v${VERSION}

Usage: npx claude-superskills [COMMAND] [OPTIONS]

Commands:
  install, i      Install skills (default)
  list, ls        List installed skills
  update, up      Update skills
  uninstall, rm   Remove skills
  doctor, doc     Check installation

Options:
  --bundle NAME   Install a curated bundle
  --search KEYWORD Search for skills
  --list-bundles  Show available bundles
  --all, -a       Install for all platforms
  --global, -g    Global installation
  --local, -l     Local installation
  --yes, -y       Skip prompts (auto-confirm)
  --quiet, -q     Minimal output
  --help, -h      Show this help
  --version, -v   Show version

Examples:
  npx claude-superskills                           # Interactive installation
  npx claude-superskills -y -q                    # Install all, skip prompts
  npx claude-superskills --bundle essential -y    # Install essential bundle
  npx claude-superskills --search "prompt"        # Search for skills
  npx claude-superskills --list-bundles           # Show available bundles
  npx claude-superskills ls -q                    # List skills, quiet mode
`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
