#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('cli-ai-skills')
  .description(chalk.cyan('🤖 Install AI skills for GitHub Copilot CLI and Claude Code'))
  .version(packageJson.version, '-v, --version', 'Output the current version');

// Command: install
program
  .command('install [skills...]')
  .description('Install AI skills')
  .option('-a, --all', 'Install all available skills')
  .option('-g, --global', 'Install globally (default)')
  .option('-l, --local', 'Install in current repository')
  .option('--copilot', 'Install only for GitHub Copilot CLI')
  .option('--claude', 'Install only for Claude Code')
  .option('-y, --yes', 'Skip confirmations')
  .option('--copy', 'Copy files instead of symlinks')
  .action(async (skillNames, options) => {
    try {
      const installCommand = require('../lib/commands/install');
      await installCommand(skillNames, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Command: uninstall
program
  .command('uninstall <skill>')
  .description('Uninstall a skill')
  .option('-g, --global', 'Uninstall from global location')
  .option('-l, --local', 'Uninstall from local repository')
  .action(async (skill, options) => {
    try {
      const uninstallCommand = require('../lib/commands/uninstall');
      await uninstallCommand(skill, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Command: list
program
  .command('list')
  .alias('ls')
  .description('List available and installed skills')
  .option('-i, --installed', 'Show only installed skills')
  .option('-a, --available', 'Show only available skills')
  .action(async (options) => {
    try {
      const listCommand = require('../lib/commands/list');
      await listCommand(options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Command: update
program
  .command('update [skills...]')
  .description('Update installed skills')
  .option('-a, --all', 'Update all skills')
  .option('-y, --yes', 'Skip confirmations')
  .action(async (skillNames, options) => {
    try {
      const updateCommand = require('../lib/commands/update');
      await updateCommand(skillNames, options);
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Command: doctor
program
  .command('doctor')
  .description('Diagnose installation issues')
  .action(async () => {
    try {
      const doctorCommand = require('../lib/commands/doctor');
      await doctorCommand();
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Error handling
program.configureOutput({
  writeErr: (str) => process.stderr.write(chalk.red(str))
});

program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
