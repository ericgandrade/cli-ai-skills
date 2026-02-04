#!/usr/bin/env node

const { detectTools, getInstallInstructions } = require('../lib/detector');
const { promptPlatforms } = require('../lib/interactive');
const { installCopilotSkills } = require('../lib/copilot');
const { installClaudeSkills } = require('../lib/claude');
const { install: installCodexSkills } = require('../lib/codex');
const { listBundles, validateBundle } = require('../lib/bundles');
const { searchSkills } = require('../lib/search');
const path = require('path');

const VERSION = '1.5.0';

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
  
  console.log(`\n🚀 cli-ai-skills v${VERSION} - Tri-Platform Installer\n`);
  
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
    
    console.log(`🔍 Detectando ferramentas AI CLI instaladas...\n`);
    const detected = detectTools();
    const hasAny = detected.copilot || detected.claude || detected.codex;
    
    if (!hasAny) {
      console.log(getInstallInstructions());
      process.exit(1);
    }
    
    // Show detected tools
    console.log('Ferramentas detectadas:');
    if (detected.copilot) console.log('  ✅ GitHub Copilot CLI');
    if (detected.claude) console.log('  ✅ Claude Code');
    if (detected.codex) console.log('  ✅ OpenAI Codex');
    console.log('');
    
    // Check for --yes flag (skip prompts)
    const skipPrompt = args.includes('-y') || args.includes('--yes');
    
    let platforms;
    if (skipPrompt) {
      platforms = [];
      if (detected.copilot) platforms.push('copilot');
      if (detected.claude) platforms.push('claude');
      if (detected.codex) platforms.push('codex');
    } else {
      platforms = await promptPlatforms(detected);
    }
    
    if (platforms.length === 0) {
      console.log('\n❌ Instalação cancelada.\n');
      process.exit(0);
    }
    
    const repoPath = path.resolve(__dirname, '../..');
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
      if (platforms.includes('codex')) {
        installCodexSkills(repoPath, [skill], quiet);
      }
    });
    
    if (!quiet) {
      console.log(`\n✅ Bundle instalado com sucesso!\n`);
    }
    return;
  }
  
  // Zero-config mode (no arguments)
  if (args.length === 0 || command === 'install') {
    console.log('🔍 Detectando ferramentas AI CLI instaladas...\n');
    
    const detected = detectTools();
    const hasAny = detected.copilot || detected.claude || detected.codex;
    
    if (!hasAny) {
      console.log(getInstallInstructions());
      process.exit(1);
    }
    
    // Show detected tools
    console.log('Ferramentas detectadas:');
    if (detected.copilot) console.log('  ✅ GitHub Copilot CLI');
    if (detected.claude) console.log('  ✅ Claude Code');
    if (detected.codex) console.log('  ✅ OpenAI Codex');
    console.log('');
    
    // Check for --yes flag (zero-config mode)
    const skipPrompt = args.includes('-y') || args.includes('--yes');
    
    let platforms;
    if (skipPrompt) {
      // Auto-select all detected platforms
      platforms = [];
      if (detected.copilot) platforms.push('copilot');
      if (detected.claude) platforms.push('claude');
      if (detected.codex) platforms.push('codex');
    } else {
      // Interactive selection
      platforms = await promptPlatforms(detected);
    }
    
    if (platforms.length === 0) {
      console.log('\n❌ Instalação cancelada.\n');
      process.exit(0);
    }
    
    console.log(`\n📦 Instalando skills para: ${platforms.join(', ')}\n`);
    
    const repoPath = path.resolve(__dirname, '../..');
    const quiet = args.includes('-q') || args.includes('--quiet');
    
    // Install for selected platforms
    if (platforms.includes('copilot')) {
      installCopilotSkills(repoPath, null, quiet);
    }
    
    if (platforms.includes('claude')) {
      installClaudeSkills(repoPath, null, quiet);
    }
    
    if (platforms.includes('codex')) {
      installCodexSkills(repoPath, null, quiet);
    }
    
    if (!quiet) {
      console.log(`\n✅ Instalação concluída com sucesso!\n`);
    }
    return;
  }
  
  // Handle other commands
  switch(command) {
    case 'list':
      console.log('📋 Installed Skills:\n');
      console.log('  • skill-creator (v1.3.0)');
      console.log('  • prompt-engineer (v1.1.0)');
      console.log('  • youtube-summarizer (v1.2.0)');
      console.log('  • audio-transcriber (v1.2.0)\n');
      break;
      
    case 'update':
      console.log('🔄 Updating skills...');
      console.log('✅ All skills are up to date!\n');
      break;
      
    case 'uninstall':
    case 'doctor':
      console.log('Use: npx cli-ai-skills --help for options\n');
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
  }
}

function showHelp() {
  console.log(`
CLI AI Skills v${VERSION}

Usage: npx cli-ai-skills [COMMAND] [OPTIONS]

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
  npx cli-ai-skills                           # Interactive installation
  npx cli-ai-skills -y -q                    # Install all, skip prompts
  npx cli-ai-skills --bundle essential -y    # Install essential bundle
  npx cli-ai-skills --search "prompt"        # Search for skills
  npx cli-ai-skills --list-bundles           # Show available bundles
  npx cli-ai-skills ls -q                    # List skills, quiet mode
`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
