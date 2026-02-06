const chalk = require('chalk');

/**
 * Exibe tabela formatada de ferramentas detectadas
 * Agora com Codex CLI e Codex App separados
 * @param {Object} tools - Objeto retornado por detectTools()
 */
function displayToolsTable(tools) {
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ Ferramenta            │ Status   │ Versão                    │');
  console.log('├──────────────────────────────────────────────────────────────────┤');
  
  const toolNames = {
    copilot: 'GitHub Copilot CLI',
    claude: 'Claude Code',
    codex_cli: 'OpenAI Codex CLI',
    codex_app: 'OpenAI Codex App',
    opencode: 'OpenCode',
    gemini: 'Gemini CLI'
  };
  
  for (const [key, name] of Object.entries(toolNames)) {
    const tool = tools[key];
    if (!tool) continue; // Skip if tool not in detected object
    
    const status = tool.installed ? chalk.green('✓') : chalk.red('✗');
    const version = tool.version || chalk.gray('-');
    
    // Formatar linha com espaçamento fixo
    const namePadded = name.padEnd(21);
    const statusPadded = '  ' + status + '      ';
    const versionStr = String(version).substring(0, 26);
    const versionPadded = versionStr.padEnd(26);
    
    console.log(`│ ${namePadded} │${statusPadded}│ ${versionPadded}│`);
  }
  
  console.log('└──────────────────────────────────────────────────────────────────┘\n');
}

/**
 * Retorna resumo de ferramentas detectadas (simples)
 * @param {Object} tools - Objeto retornado por detectTools()
 * @returns {Object} { total: number, installed: number, names: string[] }
 */
function getToolsSummary(tools) {
  const installed = [];
  
  if (tools.copilot && tools.copilot.installed) installed.push('copilot');
  if (tools.claude && tools.claude.installed) installed.push('claude');
  if (tools.codex_cli && tools.codex_cli.installed) installed.push('codex_cli');
  if (tools.codex_app && tools.codex_app.installed) installed.push('codex_app');
  if (tools.opencode && tools.opencode.installed) installed.push('opencode');
  if (tools.gemini && tools.gemini.installed) installed.push('gemini');
  
  return {
    total: 6,
    installed: installed.length,
    names: installed
  };
}

module.exports = { displayToolsTable, getToolsSummary };
