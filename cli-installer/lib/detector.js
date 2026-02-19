const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Detecta ferramentas AI CLI instaladas no sistema
 * @returns {Object} { copilot: {installed, version, path}, claude: {...}, codex_cli: {...}, codex_app: {...}, ... }
 */
function detectTools() {
  const tools = {
    copilot: detectCopilot(),
    claude: detectClaude(),
    codex_cli: detectCodexCli(),
    codex_app: detectCodexApp(),
    opencode: detectOpenCode(),
    gemini: detectGemini(),
    antigravity: detectAntigravity(),
    cursor: detectCursor(),
    adal: detectAdal()
  };

  return tools;
}

/**
 * Detecta GitHub Copilot CLI
 */
function detectCopilot() {
  try {
    const version = execSync('gh copilot --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const path = execSync('which gh', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path };
  } catch (e) {
    return { installed: false, version: null, path: null };
  }
}

/**
 * Detecta Claude Code
 */
function detectClaude() {
  try {
    const version = execSync('claude --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const path = execSync('which claude', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path };
  } catch (e) {
    return { installed: false, version: null, path: null };
  }
}

/**
 * Detecta OpenAI Codex CLI
 */
function detectCodexCli() {
  try {
    const version = execSync('codex --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const path = execSync('which codex', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path };
  } catch (e) {
    return { installed: false, version: null, path: null };
  }
}

/**
 * Detecta OpenAI Codex App (Desktop)
 */
function detectCodexApp() {
  // Check macOS
  if (os.platform() === 'darwin') {
    const appPath = '/Applications/Codex.app';
    if (fs.existsSync(appPath)) {
      try {
        // Try to get version from Info.plist
        const plistPath = path.join(appPath, 'Contents', 'Info.plist');
        const version = 'Codex Desktop'; // Could parse plist for exact version
        return { installed: true, version, path: appPath };
      } catch (e) {
        return { installed: true, version: 'unknown', path: appPath };
      }
    }
  }
  
  // Check Linux (if applicable)
  if (os.platform() === 'linux') {
    // Could check for ~/.local/share/applications or similar
    const homeDir = os.homedir();
    const possiblePaths = [
      path.join(homeDir, '.local', 'share', 'codex'),
      '/opt/Codex',
      '/usr/local/bin/Codex'
    ];
    
    for (const appPath of possiblePaths) {
      if (fs.existsSync(appPath)) {
        return { installed: true, version: 'Codex Desktop', path: appPath };
      }
    }
  }
  
  // Check Windows
  if (os.platform() === 'win32') {
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const appPath = path.join(programFiles, 'Codex', 'Codex.exe');
    if (fs.existsSync(appPath)) {
      return { installed: true, version: 'Codex Desktop', path: appPath };
    }
  }
  
  return { installed: false, version: null, path: null };
}

/**
 * @deprecated Use detectCodexCli() and detectCodexApp() instead
 * Detecta OpenAI Codex (mantido para backward compatibility)
 */
function detectCodex() {
  return detectCodexCli();
}

/**
 * Detecta OpenCode
 */
function detectOpenCode() {
  try {
    const version = execSync('opencode --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const path = execSync('which opencode', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path };
  } catch (e) {
    // Método alternativo: verificar via npm global
    try {
      execSync('npm list -g opencode', { stdio: 'ignore' });
      return { installed: true, version: 'unknown', path: 'npm global' };
    } catch {
      return { installed: false, version: null, path: null };
    }
  }
}

/**
 * Detecta Gemini CLI
 */
function detectGemini() {
  try {
    const version = execSync('gemini --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const path = execSync('which gemini', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path };
  } catch (e) {
    // Método alternativo: verificar via npm global
    try {
      execSync('npm list -g gemini-cli', { stdio: 'ignore' });
      return { installed: true, version: 'unknown', path: 'npm global' };
    } catch {
      return { installed: false, version: null, path: null };
    }
  }
}

/**
 * Detect Google Antigravity installation
 */
function detectAntigravity() {
  try {
    const version = execSync('antigravity --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const pathExec = execSync('which antigravity', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path: pathExec };
  } catch {
    return { installed: false, version: null, path: null };
  }
}

/**
 * Detect Cursor IDE
 */
function detectCursor() {
  // Check macOS Application
  if (os.platform() === 'darwin') {
    const appPath = '/Applications/Cursor.app';
    if (fs.existsSync(appPath)) {
      return { installed: true, version: 'Cursor IDE', path: appPath };
    }
  }

  // Check for 'cursor' command
  try {
    const pathExec = execSync('which cursor', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version: 'Cursor CLI', path: pathExec };
  } catch {
    // Check for ~/.cursor directory
    const homeDir = os.homedir();
    if (fs.existsSync(path.join(homeDir, '.cursor'))) {
        return { installed: true, version: 'Unknown', path: path.join(homeDir, '.cursor') };
    }
    return { installed: false, version: null, path: null };
  }
}

/**
 * Detect AdaL CLI
 */
function detectAdal() {
  try {
    const version = execSync('adal --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const pathExec = execSync('which adal', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { installed: true, version, path: pathExec };
  } catch {
    // Check for ~/.adal directory
    const homeDir = os.homedir();
    if (fs.existsSync(path.join(homeDir, '.adal'))) {
        return { installed: true, version: 'Unknown', path: path.join(homeDir, '.adal') };
    }
    return { installed: false, version: null, path: null };
  }
}

/**
 * Retorna mensagem de ajuda para ferramentas não instaladas
 */
function getInstallInstructions() {
  return `
╔════════════════════════════════════════════════════════════╗
║  Nenhuma ferramenta AI CLI detectada!                      ║
╚════════════════════════════════════════════════════════════╝

Instale ao menos uma das seguintes ferramentas:

📦 GitHub Copilot CLI:
   gh extension install github/gh-copilot

📦 Claude Code:
   npm install -g @anthropic-ai/claude-code

📦 OpenAI Codex:
   npm install -g @openai/codex

📦 OpenCode:
   npm install -g opencode

📦 Gemini CLI:
   npm install -g @google/gemini-cli

📦 Google Antigravity:
   https://antigravity.google/download

Após instalar, execute novamente: npx claude-superskills
  `;
}

module.exports = { detectTools, getInstallInstructions, detectCodex, detectCodexCli, detectCodexApp, detectAntigravity, detectCursor, detectAdal };

