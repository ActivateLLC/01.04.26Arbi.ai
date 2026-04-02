#!/bin/bash

# Setup Git Hooks for Pre-commit Validation
# Run this script once to set up pre-commit hooks: chmod +x scripts/setup-hooks.sh && ./scripts/setup-hooks.sh

echo "Setting up Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "Running pre-commit checks..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Run linter
echo -e "\n${YELLOW}1/4 Running linter...${NC}"
if ! npm run lint; then
    echo -e "${RED}❌ Linting failed. Please fix errors before committing.${NC}"
    echo -e "${YELLOW}Tip: Run 'npm run lint:fix' to auto-fix some issues${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Linting passed${NC}"

# Run type check
echo -e "\n${YELLOW}2/4 Running type check...${NC}"
if ! npm run type-check; then
    echo -e "${RED}❌ Type checking failed. Please fix type errors before committing.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Type check passed${NC}"

# Run tests
echo -e "\n${YELLOW}3/4 Running tests...${NC}"
if ! npm run test:run; then
    echo -e "${RED}❌ Tests failed. Please fix failing tests before committing.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Tests passed${NC}"

# Check for sensitive files
echo -e "\n${YELLOW}4/4 Checking for sensitive files...${NC}"
if git diff --cached --name-only | grep -E '\.(env|env\.local|env\.production)$'; then
    echo -e "${RED}❌ Warning: You're about to commit environment files!${NC}"
    echo -e "${YELLOW}This may expose sensitive information.${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo -e "${RED}Commit aborted.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ No sensitive files detected${NC}"

echo -e "\n${GREEN}✅ All pre-commit checks passed!${NC}"
exit 0
EOF

# Make pre-commit hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now run automatically before each commit."
echo "It will check:"
echo "  1. Linting (ESLint)"
echo "  2. Type checking (TypeScript)"
echo "  3. Tests (Vitest)"
echo "  4. Sensitive files (.env)"
echo ""
echo "To skip the hook (not recommended), use: git commit --no-verify"
echo ""
echo "To uninstall, remove: .git/hooks/pre-commit"
