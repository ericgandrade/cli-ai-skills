#!/usr/bin/env bash
#
# CLI AI Skills Uninstaller
# https://github.com/ericandrade/cli-ai-skills
#
# Usage:
#   bash uninstall.sh
#   curl -fsSL https://raw.githubusercontent.com/ericandrade/cli-ai-skills/main/scripts/uninstall.sh | bash
#
# Options:
#   --yes, -y              Skip all confirmations
#   --purge                Remove all data including configurations
#   --dry-run              Show what would be removed without removing
#   --help, -h             Show this help message

set -euo pipefail

# Uninstaller version
UNINSTALLER_VERSION="1.0.0"

# Configuration
PACKAGE_NAME="cli-ai-skills"

# Flags
SKIP_CONFIRMATION=false
PURGE=false
DRY_RUN=false

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

print_dry_run() {
    echo -e "${YELLOW}[DRY RUN]${NC} $1"
}

# Show help
show_help() {
    cat << EOF
${BOLD}CLI AI Skills Uninstaller${NC} v${UNINSTALLER_VERSION}

${BOLD}USAGE:${NC}
    bash uninstall.sh [OPTIONS]
    curl -fsSL https://raw.githubusercontent.com/ericandrade/cli-ai-skills/main/scripts/uninstall.sh | bash

${BOLD}OPTIONS:${NC}
    -y, --yes              Skip all confirmations
    --purge                Remove all data including configurations
    --dry-run              Show what would be removed without removing
    -h, --help             Show this help message

${BOLD}EXAMPLES:${NC}
    # Interactive uninstall
    bash uninstall.sh

    # Non-interactive
    bash uninstall.sh --yes

    # See what would be removed
    bash uninstall.sh --dry-run

    # Complete removal including configs
    bash uninstall.sh --yes --purge

${BOLD}WHAT GETS REMOVED:${NC}
    • npm global package (cli-ai-skills)
    • Installed skills in ~/.copilot/skills/
    • Installed skills in ~/.claude/skills/
    • Installed skills in ~/.codex/skills/
    • Installed skills in ~/.opencode/skills/
    • Installed skills in ~/.gemini/skills/
    • (with --purge) Empty platform directories

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
            --purge)
                PURGE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            -h|--help)
                show_help
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

# Check if package is installed
check_package_installed() {
    if npm list -g "${PACKAGE_NAME}" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Find installed skills in platform directories
find_installed_skills() {
    local platform_dirs=(
        "$HOME/.copilot/skills"
        "$HOME/.claude/skills"
        "$HOME/.codex/skills"
        "$HOME/.opencode/skills"
        "$HOME/.gemini/skills"
    )
    
    local found_skills=()
    
    for dir in "${platform_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            while IFS= read -r -d '' skill_dir; do
                local skill_name=$(basename "$skill_dir")
                local platform=$(basename "$(dirname "$dir")")
                found_skills+=("$platform:$skill_name:$skill_dir")
            done < <(find "$dir" -mindepth 1 -maxdepth 1 -type d -print0 2>/dev/null || true)
        fi
    done
    
    printf "%s\n" "${found_skills[@]}"
}

# Display what will be removed
display_removal_plan() {
    local package_installed=$1
    shift
    local skills=("$@")
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  Uninstallation Plan                                          ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    if [[ "$package_installed" == "true" ]]; then
        print_warning "Will remove npm package: ${PACKAGE_NAME}"
    else
        print_info "Package ${PACKAGE_NAME} not installed globally"
    fi
    
    echo ""
    
    if [[ ${#skills[@]} -gt 0 ]]; then
        print_warning "Will remove ${#skills[@]} installed skill(s):"
        echo ""
        
        # Group by platform
        declare -A platforms
        for skill_info in "${skills[@]}"; do
            IFS=':' read -r platform skill_name skill_path <<< "$skill_info"
            platforms[$platform]+="  • $skill_name\n"
        done
        
        for platform in "${!platforms[@]}"; do
            echo -e "${BOLD}${platform}:${NC}"
            echo -e "${platforms[$platform]}"
        done
    else
        print_info "No skills found in platform directories"
    fi
    
    if [[ "$PURGE" == "true" ]]; then
        echo ""
        print_warning "Will remove empty platform directories (--purge)"
    fi
}

# Confirm removal
confirm_removal() {
    if [[ "$SKIP_CONFIRMATION" == "true" ]]; then
        return 0
    fi
    
    echo ""
    read -p "Do you want to proceed with uninstallation? [y/N] " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        print_info "Uninstallation cancelled"
        exit 0
    fi
}

# Remove npm package
remove_npm_package() {
    print_step "Removing npm package"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_dry_run "Would run: npm uninstall -g ${PACKAGE_NAME}"
        return 0
    fi
    
    if npm uninstall -g "${PACKAGE_NAME}" > /dev/null 2>&1; then
        print_success "Package removed successfully"
        return 0
    else
        print_error "Failed to remove package"
        return 1
    fi
}

# Remove installed skills
remove_skills() {
    local skills=("$@")
    
    if [[ ${#skills[@]} -eq 0 ]]; then
        return 0
    fi
    
    print_step "Removing installed skills"
    
    local removed_count=0
    local failed_count=0
    
    for skill_info in "${skills[@]}"; do
        IFS=':' read -r platform skill_name skill_path <<< "$skill_info"
        
        if [[ "$DRY_RUN" == "true" ]]; then
            print_dry_run "Would remove: $skill_path"
            continue
        fi
        
        if [[ -L "$skill_path" ]]; then
            # It's a symlink
            if rm "$skill_path" 2>/dev/null; then
                ((removed_count++))
            else
                print_error "Failed to remove symlink: $skill_path"
                ((failed_count++))
            fi
        elif [[ -d "$skill_path" ]]; then
            # It's a directory
            if rm -rf "$skill_path" 2>/dev/null; then
                ((removed_count++))
            else
                print_error "Failed to remove directory: $skill_path"
                ((failed_count++))
            fi
        fi
    done
    
    if [[ "$DRY_RUN" == "false" ]]; then
        if [[ $removed_count -gt 0 ]]; then
            print_success "Removed $removed_count skill(s)"
        fi
        
        if [[ $failed_count -gt 0 ]]; then
            print_warning "$failed_count skill(s) failed to remove"
        fi
    fi
}

# Cleanup empty platform directories
cleanup_empty_dirs() {
    if [[ "$PURGE" == "false" ]]; then
        return 0
    fi
    
    print_step "Cleaning up empty directories"
    
    local platform_dirs=(
        "$HOME/.copilot/skills"
        "$HOME/.claude/skills"
        "$HOME/.codex/skills"
        "$HOME/.opencode/skills"
        "$HOME/.gemini/skills"
    )
    
    for dir in "${platform_dirs[@]}"; do
        if [[ -d "$dir" ]] && [[ -z "$(ls -A "$dir" 2>/dev/null)" ]]; then
            if [[ "$DRY_RUN" == "true" ]]; then
                print_dry_run "Would remove empty directory: $dir"
            else
                if rmdir "$dir" 2>/dev/null; then
                    print_success "Removed empty directory: $dir"
                fi
            fi
        fi
    done
}

# Show completion message
show_completion() {
    echo ""
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║  ${BLUE}Dry Run Complete${NC}                                             ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        print_info "No changes were made"
        print_info "Run without --dry-run to actually uninstall"
    else
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║  ${GREEN}✓${NC} ${BOLD}Uninstallation Complete${NC}                                   ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        echo ""
        print_success "CLI AI Skills has been uninstalled"
        echo ""
        print_info "To reinstall, run:"
        echo "  ${CYAN}npx cli-ai-skills${NC}"
        echo "  or"
        echo "  ${CYAN}curl -fsSL https://raw.githubusercontent.com/ericandrade/cli-ai-skills/main/scripts/install.sh | bash${NC}"
    fi
    
    echo ""
}

# Main uninstallation flow
main() {
    parse_args "$@"
    
    # Show banner
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ${BOLD}CLI AI Skills Uninstaller${NC}                                   ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "DRY RUN MODE - No changes will be made"
    fi
    
    # Check if package is installed
    print_step "Checking installation"
    local package_installed="false"
    if check_package_installed; then
        package_installed="true"
        local installed_version=$(npm list -g "${PACKAGE_NAME}" 2>/dev/null | grep "${PACKAGE_NAME}" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")
        print_info "Found: ${PACKAGE_NAME}@${installed_version}"
    else
        print_info "Package not installed globally"
    fi
    
    # Find installed skills
    print_step "Scanning for installed skills"
    local skills_array=()
    while IFS= read -r line; do
        if [[ -n "$line" ]]; then
            skills_array+=("$line")
        fi
    done < <(find_installed_skills)
    
    if [[ ${#skills_array[@]} -gt 0 ]]; then
        print_info "Found ${#skills_array[@]} installed skill(s)"
    else
        print_info "No skills found"
    fi
    
    # Check if there's anything to remove
    if [[ "$package_installed" == "false" ]] && [[ ${#skills_array[@]} -eq 0 ]]; then
        echo ""
        print_info "Nothing to uninstall"
        exit 0
    fi
    
    # Display removal plan
    display_removal_plan "$package_installed" "${skills_array[@]}"
    
    # Confirm removal
    if [[ "$DRY_RUN" == "false" ]]; then
        confirm_removal
    fi
    
    # Remove npm package
    if [[ "$package_installed" == "true" ]]; then
        remove_npm_package
    fi
    
    # Remove skills
    remove_skills "${skills_array[@]}"
    
    # Cleanup empty directories
    cleanup_empty_dirs
    
    # Show completion
    show_completion
}

# Run main if executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
