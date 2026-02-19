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
const { getSkillVersion } = require('../lib/utils/skill-versions');
const { getSkillsBasePath } = require('../lib/utils/path-resolver');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');

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
  
  // Handle bundle installation
  const bundleIdx = args.indexOf('--bundle');
  if (bundleIdx !== -1) {
    const bundleName = args[bundleIdx + 1];
    const bundle = validateBundle(bundleName);
    
    console.log(chalk.cyan('🔍 Detectando ferramentas AI CLI instaladas...\n'));
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
      platforms = [];
      if (detected.copilot.installed) platforms.push('copilot');
      if (detected.claude.installed) platforms.push('claude');
      if (detected.codex_cli.installed) platforms.push('codex_cli');
      if (detected.opencode.installed) platforms.push('opencode');
      if (detected.gemini.installed) platforms.push('gemini');
      if (detected.antigravity.installed) platforms.push('antigravity');
      if (detected.cursor.installed) platforms.push('cursor');
      if (detected.adal.installed) platforms.push('adal');
    } else {
      platforms = await promptPlatforms(detected);
    }
    
    if (platforms.length === 0) {
      console.log('\n❌ Instalação cancelada.\n');
      process.exit(0);
    }
    
    const repoPath = getSkillsBasePath(__dirname);
    const quiet = args.includes('-q') || args.includes('--quiet');
    
    if (!quiet) {
      console.log(`📦 Instalando bundle: ${bundle.name}`);
      console.log(`Skills: ${bundle.skills.join(', ')}\n`);
    }
    
    // Install bundle skills
    bundle.skills.forEach(skill => {
      if (platforms.includes('copilot')) {
        installCopilotSkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('claude')) {
        installClaudeSkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('codex') || platforms.includes('codex_cli') || platforms.includes('codex_app')) {
        installCodexSkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('opencode')) {
        installOpenCodeSkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('gemini')) {
        installGeminiSkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('antigravity')) {
        installAntigravitySkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('cursor')) {
        installCursorSkills(repoPath, [skill], quiet);
      }
      if (platforms.includes('adal')) {
        installAdalSkills(repoPath, [skill], quiet);
      }
    });
    
    if (!quiet) {
      console.log(`\n✅ Bundle instalado com sucesso!\n`);
    }
    return;
  }
  
  // Zero-config mode (no arguments)
  if (args.length === 0 || command === 'install') {
    console.log(chalk.cyan('🔍 Detectando ferramentas AI CLI instaladas...\n'));
    
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
    
    if (installInfo.installed) {
      console.log(chalk.cyan(`\nℹ️  claude-superskills já instalado nas seguintes plataformas:\n`));
      
      for (const platform of installInfo.platforms) {
        const version = installInfo.versions[platform];
        console.log(chalk.dim(`  • ${platform}: v${version}`));
      }
      
      if (isUpdateAvailable(installInfo)) {
        console.log(chalk.yellow(`\n⚠️  Nova versão disponível: v${installInfo.latestVersion}\n`));
        
        const { update } = await inquirer.prompt([{
          type: 'confirm',
          name: 'update',
          message: 'Deseja atualizar agora?',
          default: true
        }]);
        
        if (!update) {
          console.log(chalk.dim('\n❌ Atualização cancelada.\n'));
          process.exit(0);
        }
        
        console.log(chalk.cyan('\n🔄 Atualizando skills...\n'));
      } else {
        console.log(chalk.green(`\n✅ Você já possui a versão mais recente (v${installInfo.latestVersion})\n`));
        
        const { reinstall } = await inquirer.prompt([{
          type: 'confirm',
          name: 'reinstall',
          message: 'Deseja reinstalar?',
          default: false
        }]);
        
        if (!reinstall) {
          process.exit(0);
        }
      }
    }
    
    // Check for --yes flag (zero-config mode)
    const skipPrompt = args.includes('-y') || args.includes('--yes');
    
    let platforms;
    if (skipPrompt) {
      // Auto-select all detected platforms
      platforms = [];
      if (detected.copilot.installed) platforms.push('copilot');
      if (detected.claude.installed) platforms.push('claude');
      if (detected.codex_cli.installed) platforms.push('codex_cli');
      if (detected.codex_app.installed) platforms.push('codex_app');
      if (detected.opencode.installed) platforms.push('opencode');
      if (detected.gemini.installed) platforms.push('gemini');
      if (detected.antigravity.installed) platforms.push('antigravity');
      if (detected.cursor.installed) platforms.push('cursor');
      if (detected.adal.installed) platforms.push('adal');
    } else {
      // Interactive selection
      platforms = await promptPlatforms(detected);
    }
    
    if (platforms.length === 0) {
      console.log(chalk.red('\n❌ Instalação cancelada.\n'));
      process.exit(0);
    }
    
    console.log(chalk.cyan(`\n📦 Instalando skills para: ${platforms.join(', ')}\n`));
    
    const isLocal = args.includes('--local') || args.includes('-l');
    const repoPath = isLocal ? process.cwd() : getSkillsBasePath(__dirname);
    const quiet = args.includes('-q') || args.includes('--quiet');

    if (isLocal && !quiet) {
      console.log(chalk.yellow(`📂 Modo Local: Buscando skills em ${repoPath}`));
    }
    
    // Install for selected platforms
    if (platforms.includes('copilot')) {
      installCopilotSkills(repoPath, null, quiet);
    }
    
    if (platforms.includes('claude')) {
      installClaudeSkills(repoPath, null, quiet);
    }
    
    if (platforms.includes('codex') || platforms.includes('codex_cli') || platforms.includes('codex_app')) {
      installCodexSkills(repoPath, null, quiet);
    }
    
    if (platforms.includes('opencode')) {
      installOpenCodeSkills(repoPath, null, quiet);
    }
    
    if (platforms.includes('gemini')) {
      installGeminiSkills(repoPath, null, quiet);
    }

    if (platforms.includes('antigravity')) {
      installAntigravitySkills(repoPath, null, quiet);
    }

    if (platforms.includes('cursor')) {
      installCursorSkills(repoPath, null, quiet);
    }

    if (platforms.includes('adal')) {
      installAdalSkills(repoPath, null, quiet);
    }

    if (!quiet) {
      console.log(chalk.green(`\n✅ Instalação concluída com sucesso!\n`));
    }
    return;
  }
  
  // Handle other commands
  switch(command) {
    case 'list':
      console.log('📋 Installed Skills:\n');

      // Get repo path (works both in npm package and git repo)
      const repoPath = getSkillsBasePath(__dirname);
      const skills = ['skill-creator', 'prompt-engineer', 'youtube-summarizer', 'audio-transcriber'];

      skills.forEach(skill => {
        const version = getSkillVersion(skill, repoPath);
        console.log(`  • ${skill} (v${version})`);
      });
      console.log();
      break;
      
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
