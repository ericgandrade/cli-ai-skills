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
const { listBundles, validateBundle } = require('../lib/bundles');
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

const VALID_SCOPES = new Set(['global', 'local', 'both']);
const PLATFORM_LOCAL_DIRS = {
  copilot: path.join(process.cwd(), '.github', 'skills'),
  claude: path.join(process.cwd(), '.claude', 'skills'),
  codex: path.join(process.cwd(), '.codex', 'skills'),
  opencode: path.join(process.cwd(), '.agent', 'skills'),
  gemini: path.join(process.cwd(), '.gemini', 'skills'),
  antigravity: path.join(process.cwd(), '.agent', 'skills'),
  cursor: path.join(process.cwd(), '.cursor', 'skills'),
  adal: path.join(process.cwd(), '.adal', 'skills')
};

function getFlagValue(args, flagName) {
  const idx = args.indexOf(flagName);
  if (idx === -1) return null;
  return args[idx + 1] || null;
}

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
    if (spinner) spinner.fail(`Failed to fetch skills from GitHub (${err.message})`);
    throw err;
  }
}

function getDetectedPlatforms(detected) {
  const platforms = [];
  if (detected.copilot.installed) platforms.push('copilot');
  if (detected.claude.installed) platforms.push('claude');
  if (detected.codex_cli.installed || detected.codex_app.installed) platforms.push('codex');
  if (detected.opencode.installed) platforms.push('opencode');
  if (detected.gemini.installed) platforms.push('gemini');
  if (detected.antigravity.installed) platforms.push('antigravity');
  if (detected.cursor.installed) platforms.push('cursor');
  if (detected.adal.installed) platforms.push('adal');
  return platforms;
}

function getManagedSkillNames() {
  const all = new Set();
  const homeDir = os.homedir();

  // 1) Prefer local repo source when running from repository checkout.
  const repoSkillsDir = path.join(process.cwd(), 'skills');
  if (fs.existsSync(repoSkillsDir)) {
    for (const entry of fs.readdirSync(repoSkillsDir)) {
      const skillDir = path.join(repoSkillsDir, entry);
      if (fs.existsSync(path.join(skillDir, 'SKILL.md')) && fs.statSync(skillDir).isDirectory()) {
        all.add(entry);
      }
    }
  }

  // 2) Read any cached skills versions already downloaded by installer.
  const cacheBase = path.join(homeDir, '.claude-superskills', 'cache');
  if (fs.existsSync(cacheBase)) {
    for (const version of fs.readdirSync(cacheBase)) {
      const versionSkillsDir = path.join(cacheBase, version, 'skills');
      if (!fs.existsSync(versionSkillsDir)) continue;
      for (const entry of fs.readdirSync(versionSkillsDir)) {
        const skillDir = path.join(versionSkillsDir, entry);
        if (fs.existsSync(path.join(skillDir, 'SKILL.md')) && fs.statSync(skillDir).isDirectory()) {
          all.add(entry);
        }
      }
    }
  }

  // 3) Optional fallback to bundle declarations (if bundles.json exists).
  try {
    const bundlesPath = path.join(__dirname, '..', 'bundles.json');
    if (fs.existsSync(bundlesPath)) {
      const bundles = JSON.parse(fs.readFileSync(bundlesPath, 'utf8'));
      for (const bundle of Object.values(bundles.bundles || {})) {
        for (const skill of bundle.skills || []) {
          all.add(skill);
        }
      }
    }
  } catch {
    // Ignore bundle file issues; uninstall has runtime fallback.
  }

  return Array.from(all).sort();
}

function getPlatformTargetDir(platform) {
  return getUserSkillsPath(platform) || null;
}

function getPlatformTargetDirs(platform, options = {}) {
  const scope = options.scope || 'global';
  const globalDir = getPlatformTargetDir(platform);
  const localDir = PLATFORM_LOCAL_DIRS[platform] || null;

  if (scope === 'local') return localDir ? [localDir] : [];
  if (scope === 'both') {
    return [...new Set([globalDir, localDir].filter(Boolean))];
  }
  return globalDir ? [globalDir] : [];
}

function getInstalledManagedCount(targetDir, managedSkills) {
  if (!fs.existsSync(targetDir)) return 0;

  let count = 0;
  for (const skill of managedSkills) {
    const skillDir = path.join(targetDir, skill);
    if (!fs.existsSync(path.join(skillDir, 'SKILL.md'))) continue;
    if (fs.statSync(skillDir).isDirectory()) count++;
  }
  return count;
}

function getPlatformInstallStatus(platform) {
  const managedSkills = getManagedSkillNames();
  const globalDir = getPlatformTargetDir(platform);
  const localDir = PLATFORM_LOCAL_DIRS[platform] || null;
  const globalCount = getInstalledManagedCount(globalDir, managedSkills);
  const localCount = localDir ? getInstalledManagedCount(localDir, managedSkills) : 0;

  return {
    globalDir,
    localDir,
    globalCount,
    localCount,
    hasGlobal: globalCount > 0,
    hasLocal: localCount > 0
  };
}

async function promptScope(actionLabel) {
  const { scope } = await inquirer.prompt([{
    type: 'list',
    name: 'scope',
    message: `Where should ${actionLabel} happen?`,
    choices: [
      {
        name: 'Global (Recommended)',
        value: 'global',
        short: 'global'
      },
      {
        name: 'Local (Current repository)',
        value: 'local',
        short: 'local'
      },
      {
        name: 'Global + Local (Advanced; may cause confusion)',
        value: 'both',
        short: 'both'
      }
    ],
    default: 'global'
  }]);

  if (scope !== 'both') return scope;

  console.log(chalk.yellow('\n⚠️  Global + Local may cause inconsistent skill resolution in some tools.'));
  const { confirmBoth } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmBoth',
    message: 'Continue with both scopes?',
    default: false
  }]);
  if (!confirmBoth) return 'global';

  const { confirmBothAgain } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmBothAgain',
    message: 'Confirm again: apply to both global and local?',
    default: false
  }]);
  return confirmBothAgain ? 'both' : 'global';
}

function parseScope(args) {
  const scopeArg = getFlagValue(args, '--scope');
  const claudeScopeArg = getFlagValue(args, '--claude-scope');
  const hasGlobalFlag = args.includes('--global') || args.includes('-g');
  const hasLocalFlag = args.includes('--local') || args.includes('-l');

  if (hasGlobalFlag && hasLocalFlag) {
    throw new Error('Use only one of --global or --local.');
  }

  const candidates = [scopeArg, claudeScopeArg].filter(Boolean);
  if (hasGlobalFlag) candidates.push('global');
  if (hasLocalFlag) candidates.push('local');

  if (candidates.length === 0) return null;

  const unique = Array.from(new Set(candidates.map(v => String(v).toLowerCase())));
  if (unique.length > 1) {
    throw new Error(`Conflicting scope options: ${unique.join(', ')}`);
  }

  const scope = unique[0];
  if (!VALID_SCOPES.has(scope)) {
    throw new Error(`Invalid scope "${scope}". Use: global, local, or both.`);
  }
  return scope;
}

async function uninstallManagedSkills(platforms, quiet, options = {}) {
  let managedSkills = getManagedSkillNames();
  const targets = [...new Set(platforms.flatMap(platform => getPlatformTargetDirs(platform, options)).filter(Boolean))];
  let removedCount = 0;

  // Runtime fallback when packaged metadata is unavailable (e.g. npx runtime):
  // remove all installed skill directories that contain SKILL.md on selected targets.
  if (managedSkills.length === 0) {
    const discovered = new Set();
    for (const targetDir of targets) {
      if (!(await fs.pathExists(targetDir))) continue;
      const entries = await fs.readdir(targetDir);
      for (const entry of entries) {
        const skillDir = path.join(targetDir, entry);
        if (!(await fs.pathExists(path.join(skillDir, 'SKILL.md')))) continue;
        const stat = await fs.stat(skillDir);
        if (stat.isDirectory()) discovered.add(entry);
      }
    }
    managedSkills = Array.from(discovered);
  }

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

async function runUninstallFlow(detected, quiet, skipPrompt, cliScopeOverride = null) {
  const allPlatforms = getDetectedPlatforms(detected);
  if (allPlatforms.length === 0) {
    console.log(chalk.yellow('\n⚠️  No supported platforms detected for uninstall.\n'));
    return;
  }

  let selectedPlatforms = allPlatforms;
  let shouldClearCache = true;
  let scope = cliScopeOverride || 'global';

  if (!skipPrompt) {
    const { uninstallMode } = await inquirer.prompt([{
      type: 'list',
      name: 'uninstallMode',
      message: 'How do you want to uninstall?',
      choices: [
        { name: 'Uninstall from all detected platforms', value: 'all' },
        { name: 'Choose platforms to uninstall', value: 'select' },
        { name: 'Cancel', value: 'cancel' }
      ],
      default: 'all'
    }]);

    if (uninstallMode === 'cancel') {
      console.log(chalk.dim('\n❌ Operation cancelled.\n'));
      process.exit(0);
    }

    if (uninstallMode === 'select') {
      selectedPlatforms = await promptPlatforms(detected, {
        message: 'Uninstall skills from which platforms? (Press ESC to cancel)',
        defaultChecked: false
      });
      if (selectedPlatforms.length === 0) {
        console.log(chalk.dim('\n❌ No platform selected. Operation cancelled.\n'));
        process.exit(0);
      }
    }

    scope = cliScopeOverride || await promptScope('uninstall');

    const { clearCacheNow } = await inquirer.prompt([{
      type: 'confirm',
      name: 'clearCacheNow',
      message: 'Clear local skills cache (~/.claude-superskills/cache) too?',
      default: true
    }]);
    shouldClearCache = clearCacheNow;
  } else if (!quiet) {
    console.log(chalk.cyan('\n🗑️  Auto mode: uninstalling from all detected platforms and clearing cache...\n'));
  }

  if (!quiet) {
    console.log(chalk.cyan(`\n🧹 Uninstalling skills from: ${selectedPlatforms.join(', ')}\n`));
    console.log(chalk.gray(`   Scope: ${scope}`));
  }

  await uninstallManagedSkills(selectedPlatforms, quiet, { scope });
  if (shouldClearCache) {
    await clearSkillsCache(quiet);
  }

  if (!quiet) {
    console.log(chalk.green('\n✅ Uninstall complete!\n'));
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

async function getInstalledSkillsByPlatforms(platforms) {
  const targets = [...new Set(platforms.map(getPlatformTargetDir).filter(Boolean))];
  const installed = new Set();

  for (const targetDir of targets) {
    if (!(await fs.pathExists(targetDir))) continue;
    const entries = await fs.readdir(targetDir);
    for (const entry of entries) {
      const skillDir = path.join(targetDir, entry);
      if (!(await fs.pathExists(path.join(skillDir, 'SKILL.md')))) continue;
      const stat = await fs.stat(skillDir);
      if (stat.isDirectory()) {
        installed.add(entry);
      }
    }
  }

  return Array.from(installed).sort();
}

function getInstallerByPlatform(platform) {
  const installers = {
    copilot: installCopilotSkills,
    claude: installClaudeSkills,
    codex: installCodexSkills,
    opencode: installOpenCodeSkills,
    gemini: installGeminiSkills,
    antigravity: installAntigravitySkills,
    cursor: installCursorSkills,
    adal: installAdalSkills
  };
  return installers[platform] || null;
}

async function installForPlatforms(cacheDir, platforms, skills, quiet, scope) {
  for (const platform of platforms) {
    const installer = getInstallerByPlatform(platform);
    if (!installer) continue;

    const targetDirs = getPlatformTargetDirs(platform, { scope });
    if (targetDirs.length === 0) continue;

    for (const targetDir of targetDirs) {
      const isLocal = targetDir.startsWith(process.cwd());
      const label = `${platform} (${isLocal ? 'local' : 'global'})`;
      await installer(cacheDir, skills, quiet, targetDir, label);
    }
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
  const skipPrompt = args.includes('-y') || args.includes('--yes');
  const cliScopeOverride = parseScope(args);

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

    const scope = cliScopeOverride || (skipPrompt ? 'global' : await promptScope('installation'));
    if (!quiet) {
      console.log(chalk.gray(`Scope: ${scope} (${scope === 'global' ? 'recommended' : 'advanced'})`));
      if (scope === 'both') {
        console.log(chalk.yellow('⚠️  Global + Local can cause tool confusion. Global is recommended.'));
      }
    }

    // Download / verify skills cache
    const cacheDir = await warmCache(quiet);

    if (!quiet) {
      console.log(`📦 Installing bundle: ${bundle.name}`);
      console.log(`Skills: ${bundle.skills.join(', ')}\n`);
    }

    // Install bundle skills
    for (const skill of bundle.skills) {
      await installForPlatforms(cacheDir, platforms, [skill], quiet, scope);
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

    const detectedPlatforms = getDetectedPlatforms(detected);
    const platformScopeStatus = Object.fromEntries(
      detectedPlatforms.map(p => [p, getPlatformInstallStatus(p)])
    );

    if (!quiet && detectedPlatforms.length > 0) {
      console.log(chalk.cyan('\nInstall status by scope:'));
      for (const platform of detectedPlatforms) {
        const status = platformScopeStatus[platform];
        const globalStatus = status.hasGlobal ? `installed (${status.globalCount})` : 'not installed';
        const localStatus = status.hasLocal ? `installed (${status.localCount})` : 'not installed';
        console.log(chalk.dim(`  • ${platform}: global=${globalStatus} | local=${localStatus}`));
      }
    }

    // Check if already installed
    const installInfo = checkInstalledVersion();
    const hasAnyLocalInstall = Object.values(platformScopeStatus).some(s => s.hasLocal);
    const hasAnyGlobalInstall = Object.values(platformScopeStatus).some(s => s.hasGlobal);
    const hasExistingInstall = installInfo.installed || hasAnyGlobalInstall || hasAnyLocalInstall;
    let requiresCleanReinstall = false;

    if (hasExistingInstall) {
      console.log(chalk.cyan(`\nℹ️  claude-superskills already installed on the following platforms:\n`));

      if (installInfo.platforms.length > 0) {
        for (const platform of installInfo.platforms) {
          const version = installInfo.versions[platform];
          console.log(chalk.dim(`  • ${platform}: v${version}`));
        }
      }
      for (const platform of detectedPlatforms) {
        const status = platformScopeStatus[platform];
        console.log(chalk.dim(`  • ${platform}(global): ${status.hasGlobal ? 'installed' : 'not installed'}`));
        console.log(chalk.dim(`  • ${platform}(local): ${status.hasLocal ? 'installed' : 'not installed'}`));
      }

      const updateAvailable = installInfo.installed ? isUpdateAvailable(installInfo) : false;

      if (skipPrompt) {
        if (updateAvailable) {
          console.log(chalk.cyan('\n🔄 Auto mode: updating skills...\n'));
          requiresCleanReinstall = true;
        } else {
          console.log(chalk.cyan('\n♻️  Auto mode: reinstalling latest skills...\n'));
          requiresCleanReinstall = true;
        }
      } else if (updateAvailable) {
        console.log(chalk.yellow(`\n⚠️  New version available: v${installInfo.latestVersion}\n`));

        const { action } = await inquirer.prompt([{
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            { name: 'Update to latest version', value: 'update' },
            { name: 'Reinstall from scratch', value: 'reinstall' },
            { name: 'Uninstall skills', value: 'uninstall' },
            { name: 'Cancel', value: 'cancel' }
          ],
          default: 'update'
        }]);

        if (action === 'cancel') {
          console.log(chalk.dim('\n❌ Operation cancelled.\n'));
          process.exit(0);
        }

        if (action === 'uninstall') {
          await runUninstallFlow(detected, quiet, skipPrompt, cliScopeOverride);
          return;
        }

        if (action === 'update') {
          console.log(chalk.cyan('\n🔄 Updating skills...\n'));
        } else {
          console.log(chalk.cyan('\n♻️  Reinstalling skills from scratch...\n'));
        }
        requiresCleanReinstall = true;
      } else {
        console.log(chalk.green(`\n✅ You already have the latest version (v${installInfo.latestVersion})\n`));

        const { action } = await inquirer.prompt([{
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            { name: 'Reinstall from scratch', value: 'reinstall' },
            { name: 'Uninstall skills', value: 'uninstall' },
            { name: 'Cancel', value: 'cancel' }
          ],
          default: 'reinstall'
        }]);

        if (action === 'cancel') {
          console.log(chalk.dim('\n❌ Operation cancelled.\n'));
          process.exit(0);
        }

        if (action === 'uninstall') {
          await runUninstallFlow(detected, quiet, skipPrompt, cliScopeOverride);
          return;
        }

        console.log(chalk.cyan('\n♻️  Reinstalling skills from scratch...\n'));
        requiresCleanReinstall = true;
      }
    }

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

    const scope = cliScopeOverride || (skipPrompt ? 'global' : await promptScope('installation'));

    console.log(chalk.cyan(`\n📦 Installing skills for: ${platforms.join(', ')}\n`));
    console.log(chalk.gray(`   Scope: ${scope} (${scope === 'global' ? 'recommended' : 'advanced'})`));
    if (scope === 'both') {
      console.log(chalk.yellow('   ⚠️  Global + Local may cause confusion in some tools.'));
    }
    console.log();

    if (requiresCleanReinstall) {
      if (!quiet) {
        console.log(chalk.cyan('♻️  Running clean reinstall: uninstall + cache cleanup...\n'));
      }
      await uninstallManagedSkills(platforms, quiet, { scope });
      await clearSkillsCache(quiet);
      if (!quiet) console.log();
    }

    // Download / verify skills cache
    const cacheDir = await warmCache(quiet);

    await installForPlatforms(cacheDir, platforms, null, quiet, scope);

    if (!quiet) {
      console.log(chalk.green(`\n✅ Installation complete!\n`));
    }
    return;
  }

  // Handle other commands
  switch(command) {
    case 'list': {
      console.log('📋 Installed Skills:\n');
      const detected = detectTools();
      const platforms = getDetectedPlatforms(detected);
      const skills = await getInstalledSkillsByPlatforms(platforms);
      skills.forEach(skill => {
        console.log(`  • ${skill}`);
      });
      if (skills.length === 0) {
        console.log('  (none)');
      }
      console.log();
      break;
    }

    case 'update':
      console.log('🔄 Updating skills...');
      console.log('✅ All skills are up to date!\n');
      break;

    case 'uninstall':
      console.log(chalk.cyan('🔍 Detecting installed AI CLI tools...\n'));
      await runUninstallFlow(detectTools(), quiet, skipPrompt, cliScopeOverride);
      break;

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
  --scope SCOPE   Scope for selected platforms: global|local|both (default: global)
  --claude-scope SCOPE  Backward-compatible alias of --scope
  --global, -g    Alias for --scope global
  --local, -l     Alias for --scope local
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
  npx claude-superskills --scope global           # Global install (recommended)
  npx claude-superskills --scope local            # Local install for current repository
  npx claude-superskills --scope both             # Global + local install (advanced)
  npx claude-superskills uninstall -y             # Uninstall all + clear cache
`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
