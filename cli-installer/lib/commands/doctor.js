const chalk = require('chalk');
const PlatformDetector = require('../core/detector');
const { execSync } = require('child_process');

async function doctorCommand() {
  console.log(chalk.cyan.bold('\n🔍 CLI AI Skills Doctor\n'));
  console.log('Running diagnostics...\n');

  const detector = new PlatformDetector();
  let issues = 0;
  let warnings = 0;

  console.log(chalk.cyan('━'.repeat(60)));
  console.log(chalk.bold('\nSystem Environment:\n'));

  // Check Node.js version
  console.log(chalk.bold('Node.js:'));
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (nodeMajor >= 14) {
    console.log(chalk.green(`  ✅ ${nodeVersion}`));
  } else {
    console.log(chalk.red(`  ❌ ${nodeVersion} (require >= 14.0.0)`));
    console.log(chalk.dim(`     Update Node.js: https://nodejs.org/`));
    issues++;
  }

  // Check OS
  console.log(chalk.bold('\nOperating System:'));
  const platform = process.platform;
  const osMap = {
    'darwin': 'macOS',
    'linux': 'Linux',
    'win32': 'Windows'
  };
  console.log(chalk.green(`  ✅ ${osMap[platform] || platform}`));

  console.log(chalk.cyan('\n' + '━'.repeat(60)));
  console.log(chalk.bold('\nAI Platforms:\n'));

  // Check GitHub Copilot
  console.log(chalk.bold('GitHub Copilot CLI:'));
  const copilotInfo = await detector.detectCopilot();
  if (copilotInfo.cliInstalled) {
    console.log(chalk.green(`  ✅ Installed (${copilotInfo.version})`));
    console.log(chalk.dim(`     Skills directory: ${copilotInfo.globalPath}`));
    
    const writable = await detector.isWritable(copilotInfo.globalPath);
    if (writable) {
      console.log(chalk.green(`     ✅ Directory writable`));
    } else {
      console.log(chalk.yellow(`     ⚠️  Directory not writable`));
      warnings++;
    }
  } else if (copilotInfo.installed) {
    console.log(chalk.yellow('  ⚠️  Directory exists but CLI not installed'));
    console.log(chalk.dim(`     Install: https://docs.github.com/copilot/cli`));
    warnings++;
  } else {
    console.log(chalk.yellow('  ⚠️  Not installed'));
    console.log(chalk.dim(`     Install: https://docs.github.com/copilot/cli`));
  }

  // Check Claude Code
  console.log(chalk.bold('\nClaude Code:'));
  const claudeInfo = await detector.detectClaude();
  if (claudeInfo.installed) {
    console.log(chalk.green('  ✅ Detected'));
    console.log(chalk.dim(`     Skills directory: ${claudeInfo.globalPath}`));
    
    const writable = await detector.isWritable(claudeInfo.globalPath);
    if (writable) {
      console.log(chalk.green(`     ✅ Directory writable`));
    } else {
      console.log(chalk.yellow(`     ⚠️  Directory not writable`));
      warnings++;
    }
  } else {
    console.log(chalk.yellow('  ⚠️  Not detected'));
    console.log(chalk.dim(`     Install: https://claude.ai/code`));
  }

  console.log(chalk.cyan('\n' + '━'.repeat(60)));
  console.log(chalk.bold('\nNetwork Connectivity:\n'));

  // Check GitHub access
  console.log(chalk.bold('GitHub API:'));
  try {
    execSync('ping -c 1 api.github.com', { stdio: 'ignore' });
    console.log(chalk.green('  ✅ Reachable (https://api.github.com)'));
  } catch (error) {
    console.log(chalk.red('  ❌ Cannot reach GitHub API'));
    console.log(chalk.dim('     Check your internet connection'));
    issues++;
  }

  console.log(chalk.cyan('\n' + '━'.repeat(60)));

  // Summary
  console.log();
  if (issues === 0 && warnings === 0) {
    console.log(chalk.green.bold('✨ Everything looks good!\n'));
  } else if (issues === 0) {
    console.log(chalk.yellow.bold(`⚠️  Found ${warnings} warning(s)\n`));
  } else {
    console.log(chalk.red.bold(`❌ Found ${issues} error(s) and ${warnings} warning(s)\n`));
  }

  console.log(chalk.cyan('📊 Diagnostics Summary:'));
  const checks = 3 + (copilotInfo.cliInstalled ? 1 : 0) + (claudeInfo.installed ? 1 : 0);
  const passed = checks - issues - warnings;
  console.log(chalk.dim(`  ✅ ${passed} checks passed`));
  if (warnings > 0) console.log(chalk.dim(`  ⚠️  ${warnings} warnings`));
  if (issues > 0) console.log(chalk.dim(`  ❌ ${issues} errors`));

  console.log();
}

module.exports = doctorCommand;
