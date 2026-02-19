#!/usr/bin/env bash
#
# CLI AI Skills Installer
# https://github.com/ericgandrade/claude-superskills
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
#   wget -qO- https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
#
# Options:
#   --yes, -y              Skip all confirmations
#   --skip-node-check      Skip Node.js version verification
#   --verbose              Show detailed output
#   --help, -h             Show this help message
#   --version, -v          Show installer version

set -euo pipefail

# Installer version
INSTALLER_VERSION="1.0.0"

# Configuration
MIN_NODE_VERSION="16.0.0"
PACKAGE_NAME="claude-superskills"
REPO_URL="https://github.com/ericgandrade/claude-superskills"

# Flags
SKIP_CONFIRMATION=false
SKIP_NODE_CHECK=false
VERBOSE=false

# Colors
if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    GREEN=''
    RED=''
    YELLOW=''
    BLUE=''
    CYAN=''
    BOLD=''
    NC=''
fi

# Cleanup on exit
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        print_error "Installation failed with exit code $exit_code"
    fi
}
trap cleanup EXIT INT TERM

# Print functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_step() {
    echo -e "\n${BOLD}${CYAN}▸${NC} $1"
}

verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${CYAN}[DEBUG]${NC} $1"
    fi
}

# Show help
show_help() {
    cat << EOF
${BOLD}CLI AI Skills Installer${NC} v${INSTALLER_VERSION}

${BOLD}USAGE:${NC}
    curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash
    wget -qO- https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash

${BOLD}OPTIONS:${NC}
    -y, --yes              Skip all confirmations (non-interactive mode)
    --skip-node-check      Skip Node.js version verification
    --verbose              Show detailed output
    -h, --help             Show this help message
    -v, --version          Show installer version

${BOLD}EXAMPLES:${NC}
    # Interactive install
    curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash

    # Non-interactive (CI/CD)
    curl -fsSL https://raw.githubusercontent.com/ericgandrade/claude-superskills/main/scripts/install.sh | bash -s -- --yes

${BOLD}REQUIREMENTS:${NC}
    - Node.js >= ${MIN_NODE_VERSION}
    - npm (comes with Node.js)
    - macOS, Linux, or WSL

${BOLD}MORE INFO:${NC}
    ${REPO_URL}

EOF
}

# Parse arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -y|--yes)
                SKIP_CONFIRMATION=true
                shift
                ;;
            --skip-node-check)
                SKIP_NODE_CHECK=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                echo "CLI AI Skills Installer v${INSTALLER_VERSION}"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# Detect operating system
detect_os() {
    verbose "Detecting operating system..."
    
    local os=""
    case "$(uname -s)" in
        Darwin*)
            os="macos"
            verbose "Detected: macOS"
            ;;
        Linux*)
            if grep -qi microsoft /proc/version 2>/dev/null; then
                os="wsl"
                verbose "Detected: WSL (Windows Subsystem for Linux)"
            else
                os="linux"
                verbose "Detected: Linux"
            fi
            ;;
        CYGWIN*|MINGW*|MSYS*)
            os="windows"
            verbose "Detected: Windows (Git Bash/MSYS)"
            ;;
        *)
            os="unsupported"
            verbose "Detected: Unknown/Unsupported OS"
            ;;
    esac
    
    echo "$os"
}

# Version comparison (semver)
version_compare() {
    local version1=$1
    local version2=$2
    
    # Remove 'v' prefix if present
    version1=${version1#v}
    version2=${version2#v}
    
    # Split versions into arrays
    IFS='.' read -ra ver1 <<< "$version1"
    IFS='.' read -ra ver2 <<< "$version2"
    
    # Compare major.minor.patch
    for i in 0 1 2; do
        local v1=${ver1[$i]:-0}
        local v2=${ver2[$i]:-0}
        
        if (( v1 > v2 )); then
            return 0  # version1 > version2
        elif (( v1 < v2 )); then
            return 1  # version1 < version2
        fi
    done
    
    return 0  # versions are equal
}

# Check if Node.js is installed and meets minimum version
check_node_installed() {
    verbose "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        verbose "Node.js not found in PATH"
        return 1
    fi
    
    local node_version
    node_version=$(node --version 2>/dev/null || echo "v0.0.0")
    verbose "Found Node.js $node_version"
    
    if version_compare "$node_version" "$MIN_NODE_VERSION"; then
        verbose "Node.js version is sufficient (>= $MIN_NODE_VERSION)"
        return 0
    else
        verbose "Node.js version is too old (< $MIN_NODE_VERSION)"
        return 1
    fi
}

# Offer to install Node.js via nvm
install_with_nvm() {
    print_step "Node.js Installation Required"
    
    echo "Node.js >= ${MIN_NODE_VERSION} is required but not found."
    echo ""
    
    if command -v nvm &> /dev/null; then
        print_info "nvm is already installed"
        echo ""
        echo "You can install Node.js with:"
        echo "  ${CYAN}nvm install --lts${NC}"
        echo "  ${CYAN}nvm use --lts${NC}"
        echo ""
        
        if [[ "$SKIP_CONFIRMATION" == "false" ]]; then
            read -p "Would you like to install Node.js now? [y/N] " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                nvm install --lts
                nvm use --lts
                print_success "Node.js installed successfully"
                return 0
            fi
        fi
    else
        print_warning "nvm (Node Version Manager) is not installed"
        echo ""
        echo "To install Node.js, you can:"
        echo ""
        echo "1. Install nvm (recommended):"
        echo "   ${CYAN}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
        echo "   Then run: ${CYAN}nvm install --lts${NC}"
        echo ""
        echo "2. Download from nodejs.org:"
        echo "   ${CYAN}https://nodejs.org/${NC}"
        echo ""
        echo "3. Use a package manager:"
        echo "   macOS:  ${CYAN}brew install node${NC}"
        echo "   Ubuntu: ${CYAN}sudo apt install nodejs npm${NC}"
        echo ""
    fi
    
    print_error "Please install Node.js and run this script again"
    exit 1
}

# Detect installed AI tools
detect_ai_tools() {
    verbose "Detecting AI CLI tools..."
    
    local tools=()
    
    # GitHub Copilot CLI
    if command -v gh &> /dev/null && gh copilot --version &> /dev/null; then
        local gh_version=$(gh copilot --version 2>/dev/null | head -1 || echo "unknown")
        tools+=("copilot:installed:$gh_version")
        verbose "Found: GitHub Copilot CLI ($gh_version)"
    else
        tools+=("copilot:not_installed:-")
        verbose "Not found: GitHub Copilot CLI"
    fi
    
    # Claude Code
    if [[ -d "$HOME/.claude" ]]; then
        tools+=("claude:installed:unknown")
        verbose "Found: Claude Code (directory exists)"
    else
        tools+=("claude:not_installed:-")
        verbose "Not found: Claude Code"
    fi
    
    # Codex
    if [[ -d "$HOME/.codex" ]]; then
        tools+=("codex:installed:unknown")
        verbose "Found: Codex (directory exists)"
    else
        tools+=("codex:not_installed:-")
        verbose "Not found: Codex"
    fi
    
    # OpenCode
    if command -v opencode &> /dev/null; then
        local oc_version=$(opencode --version 2>/dev/null || echo "unknown")
        tools+=("opencode:installed:$oc_version")
        verbose "Found: OpenCode ($oc_version)"
    else
        tools+=("opencode:not_installed:-")
        verbose "Not found: OpenCode"
    fi
    
    # Gemini CLI
    if command -v gemini &> /dev/null; then
        local gem_version=$(gemini --version 2>/dev/null || echo "unknown")
        tools+=("gemini:installed:$gem_version")
        verbose "Found: Gemini CLI ($gem_version)"
    else
        tools+=("gemini:not_installed:-")
        verbose "Not found: Gemini CLI"
    fi
    
    # Return as newline-delimited
    printf "%s\n" "${tools[@]}"
}

# Display tools table
display_tools_table() {
    local tools=("$@")
    
    echo ""
    echo "┌────────────────────────────────────────────────────────┐"
    echo "│ AI CLI Tools Detection                                 │"
    echo "├────────────────────────┬────────┬──────────────────────┤"
    echo "│ Tool                   │ Status │ Version              │"
    echo "├────────────────────────┼────────┼──────────────────────┤"
    
    for tool_info in "${tools[@]}"; do
        IFS=':' read -r name status version <<< "$tool_info"
        
        local display_name=""
        case "$name" in
            copilot) display_name="GitHub Copilot CLI" ;;
            claude) display_name="Claude Code" ;;
            codex) display_name="Codex" ;;
            opencode) display_name="OpenCode" ;;
            gemini) display_name="Gemini CLI" ;;
        esac
        
        local status_icon=""
        if [[ "$status" == "installed" ]]; then
            status_icon="${GREEN}✓${NC}"
        else
            status_icon="${RED}✗${NC}"
        fi
        
        printf "│ %-22s │ %-6s │ %-20s │\n" "$display_name" "$status_icon" "$version"
    done
    
    echo "└────────────────────────┴────────┴──────────────────────┘"
    echo ""
}

# Install claude-superskills
install_cli_ai_skills() {
    print_step "Installing ${PACKAGE_NAME}..."
    
    verbose "Running: npm install -g ${PACKAGE_NAME}"
    
    if [[ "$VERBOSE" == "true" ]]; then
        npm install -g "${PACKAGE_NAME}"
    else
        npm install -g "${PACKAGE_NAME}" > /dev/null 2>&1
    fi
    
    if [[ $? -eq 0 ]]; then
        print_success "${PACKAGE_NAME} installed successfully"
        return 0
    else
        print_error "Failed to install ${PACKAGE_NAME}"
        return 1
    fi
}

# Verify installation
verify_installation() {
    verbose "Verifying installation..."
    
    if command -v claude-superskills &> /dev/null; then
        local installed_version=$(claude-superskills --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")
        verbose "Installed version: $installed_version"
        print_success "Installation verified (v${installed_version})"
        return 0
    else
        print_error "Installation verification failed"
        return 1
    fi
}

# Show post-install instructions
show_post_install() {
    local tools=("$@")
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ${GREEN}✓${NC} ${BOLD}CLI AI Skills Installed Successfully!${NC}                      ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_step "Next Steps"
    echo ""
    echo "1. Run the installer:"
    echo "   ${CYAN}claude-superskills${NC}"
    echo ""
    echo "2. Or use npx (no install needed):"
    echo "   ${CYAN}npx claude-superskills${NC}"
    echo ""
    
    # Count installed tools
    local installed_count=0
    for tool_info in "${tools[@]}"; do
        IFS=':' read -r name status version <<< "$tool_info"
        if [[ "$status" == "installed" ]]; then
            ((installed_count++))
        fi
    done
    
    if [[ $installed_count -gt 0 ]]; then
        print_info "Detected ${installed_count}/5 AI CLI tools on your system"
        echo "   Skills will be installed for detected platforms"
    else
        print_warning "No AI CLI tools detected"
        echo "   Install GitHub Copilot CLI, Claude Code, or others first"
    fi
    
    echo ""
    print_step "Documentation"
    echo "   ${REPO_URL}"
    echo ""
    
    # Offer to run installer
    if [[ "$SKIP_CONFIRMATION" == "false" ]]; then
        echo ""
        read -p "Would you like to run the installer now? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            exec claude-superskills
        fi
    fi
}

# Main installation flow
main() {
    parse_args "$@"
    
    # Show banner
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ${BOLD}CLI AI Skills Installer${NC}                                     ║"
    echo "║  Universal skill library for AI CLI tools                     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Detect OS
    print_step "Detecting Operating System"
    local os
    os=$(detect_os)
    
    case "$os" in
        macos)
            print_success "macOS detected"
            ;;
        linux)
            print_success "Linux detected"
            ;;
        wsl)
            print_success "WSL (Windows Subsystem for Linux) detected"
            ;;
        windows)
            print_error "Pure Windows is not supported"
            echo ""
            echo "Please use:"
            echo "  • WSL (Windows Subsystem for Linux)"
            echo "  • Git Bash (install via: npm install -g claude-superskills)"
            echo "  • Or: npx claude-superskills"
            exit 1
            ;;
        *)
            print_error "Unsupported operating system"
            exit 1
            ;;
    esac
    
    # Check Node.js
    if [[ "$SKIP_NODE_CHECK" == "false" ]]; then
        print_step "Checking Node.js"
        
        if check_node_installed; then
            local node_version=$(node --version)
            print_success "Node.js ${node_version} installed"
        else
            install_with_nvm
        fi
    else
        print_warning "Skipping Node.js check (--skip-node-check)"
    fi
    
    # Detect AI tools
    print_step "Detecting AI CLI Tools"
    local tools_array=()
    while IFS= read -r line; do
        tools_array+=("$line")
    done < <(detect_ai_tools)
    
    display_tools_table "${tools_array[@]}"
    
    # Install package
    if ! install_cli_ai_skills; then
        exit 1
    fi
    
    # Verify installation
    if ! verify_installation; then
        exit 1
    fi
    
    # Show post-install
    show_post_install "${tools_array[@]}"
}

# Run main if executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
