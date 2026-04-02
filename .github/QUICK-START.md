# CI/CD Quick Start Guide

Quick reference for setting up and using the CI/CD pipeline.

## Initial Setup (5 minutes)

### 1. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit and add your keys
# Required: VITE_API_BASE_URL
# Recommended: GEMINI_API_KEY or VITE_GEMINI_API_KEY
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Validate Setup

```bash
npm run validate:env
```

### 4. Start Development

```bash
npm run dev
```

## GitHub Actions Setup (10 minutes)

### Required Secrets

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

```
GEMINI_API_KEY=your_gemini_api_key_here
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

### Getting Vercel IDs

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Get IDs
cat .vercel/project.json
```

## Common Commands

### Development

```bash
npm run dev              # Start dev server
npm run validate:env     # Check environment variables
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
npm run type-check       # Run TypeScript checks
```

### Testing

```bash
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Open Playwright UI
```

### Building

```bash
npm run build            # Build for production
npm run build:prod       # Build with validation
npm run preview          # Preview production build
npm run build:analyze    # Analyze bundle size
```

### Validation

```bash
npm run validate         # Run all checks (lint + type + test)
npm run validate:env     # Validate environment variables
```

### Cleanup

```bash
npm run clean            # Remove dist and cache
npm run clean:all        # Remove everything (including node_modules)
npm run reinstall        # Clean reinstall
```

## Before Committing

Run these to ensure CI will pass:

```bash
npm run validate         # All checks
npm run test:e2e         # E2E tests
npm run build:prod       # Production build
```

Or use the combined validation:

```bash
npm run validate && npm run build:prod
```

## PR Workflow

1. **Create branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and test:**
   ```bash
   npm run validate
   ```

3. **Commit:**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

4. **Push:**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create PR on GitHub**
   - CI will automatically run
   - Preview deployment will be created
   - Wait for all checks to pass

6. **Merge when ready**
   - Production deployment happens automatically

## CI Status

Check CI status in:
- GitHub Actions tab
- PR checks section
- Status badges in README

## Troubleshooting

### CI Fails - Linting Errors

```bash
npm run lint:fix
git add .
git commit -m "fix: linting errors"
git push
```

### CI Fails - Tests

```bash
# Run tests locally
npm run test:run

# Fix issues and commit
git add .
git commit -m "fix: test failures"
git push
```

### CI Fails - Build

```bash
# Try building locally
npm run build:prod

# Check for errors
# Fix and commit
```

### Environment Variable Issues

```bash
# Validate environment
npm run validate:env

# Check .env.local exists
ls -la .env.local

# Verify variables are set
cat .env.local
```

### Deployment Fails

1. Check secrets are set in GitHub
2. Verify Vercel/Netlify configuration
3. Check deployment logs in GitHub Actions
4. Review platform-specific logs

## Quick Fixes

### Clear Cache

```bash
npm run clean
npm install
```

### Reset Everything

```bash
npm run clean:all
npm install
```

### Update Dependencies

```bash
npm update
npm audit fix
```

### Test Like CI

```bash
export CI=true
npm ci
npm run validate
npm run build:prod
```

## Monitoring

### View CI Logs
1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow run
4. Click on job to see logs

### View Deployment
1. Check GitHub Actions output for URL
2. Go to Vercel/Netlify dashboard
3. Check deployment logs

### View Coverage
1. Go to Codecov dashboard
2. Check PR comments for coverage diff
3. Review coverage trends

## Best Practices

### Do:
- ✅ Run `npm run validate` before committing
- ✅ Write tests for new features
- ✅ Keep dependencies updated
- ✅ Use meaningful commit messages
- ✅ Wait for CI to pass before merging

### Don't:
- ❌ Skip tests
- ❌ Commit broken code
- ❌ Ignore CI failures
- ❌ Commit sensitive data (.env files)
- ❌ Force push to main

## Useful Links

- [Full Deployment Guide](.github/DEPLOYMENT.md)
- [CI/CD Status](.github/CI-CD-STATUS.md)
- [Issue Template](.github/ISSUE_TEMPLATE/ci-cd-issue.md)

## Getting Help

1. Check this guide
2. Review documentation in `.github/` folder
3. Search existing GitHub Issues
4. Create new issue with CI/CD template

---

**Quick Reference Card:**

```bash
# Essential commands
npm run dev              # Develop
npm run validate         # Check all
npm run build:prod       # Build
npm run test:coverage    # Test
npm run validate:env     # Env check

# Before commit
npm run validate && npm run build:prod

# Fix issues
npm run lint:fix         # Fix linting
npm run clean            # Clear cache
npm run reinstall        # Fresh start
```
