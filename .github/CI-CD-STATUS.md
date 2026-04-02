# CI/CD Pipeline Status

This document provides an overview of the CI/CD pipeline setup and current status.

## Pipeline Overview

```
┌─────────────┐
│ Push/PR     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           CI Workflow                    │
│  ┌────────────────────────────────────┐ │
│  │  1. Checkout Code                  │ │
│  │  2. Setup Node.js (18.x, 20.x)     │ │
│  │  3. Install Dependencies           │ │
│  │  4. Lint Code                      │ │
│  │  5. Type Check                     │ │
│  │  6. Run Unit Tests + Coverage      │ │
│  │  7. Build Application              │ │
│  │  8. Upload Artifacts               │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  E2E Tests (Playwright)            │ │
│  │  - Install browsers                │ │
│  │  - Run E2E suite                   │ │
│  │  - Upload test reports             │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Deploy Workflow                  │
│  ┌────────────────────────────────────┐ │
│  │  Production (main branch)          │ │
│  │  - Run full validation             │ │
│  │  - Build optimized bundle          │ │
│  │  - Deploy to Vercel/Netlify        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Preview (PRs)                     │ │
│  │  - Build PR version                │ │
│  │  - Deploy preview environment      │ │
│  │  - Comment with preview URL        │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Workflow Files

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### Test Job
- **Matrix Strategy:** Node.js 18.x and 20.x
- **Steps:**
  1. Checkout code
  2. Setup Node.js with caching
  3. Install dependencies (`npm ci`)
  4. Run ESLint
  5. Run TypeScript type checking
  6. Run unit tests with coverage
  7. Upload coverage to Codecov (Node 20.x only)
  8. Build application
  9. Upload build artifacts (Node 20.x only)

#### E2E Job
- **Depends on:** Test job
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20.x
  3. Install dependencies
  4. Install Playwright browsers
  5. Run E2E tests
  6. Upload Playwright report

**Artifacts:**
- Build output (`dist/`)
- Playwright test reports
- Coverage reports

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch (production deployment)
- Pull requests to `main` branch (preview deployment)

**Jobs:**

#### Deploy Job
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20.x with caching
  3. Install dependencies (`npm ci`)
  4. Build application with validation (`npm run build:prod`)
  5. Deploy to Vercel/Netlify based on event type

**Deployment Targets:**
- **Production:** Triggered on push to `main`
- **Preview:** Triggered on pull requests

## Required GitHub Secrets

Configure these in: **Repository Settings → Secrets and variables → Actions**

### For CI (Required)
| Secret | Description | Example |
|--------|-------------|---------|
| `GEMINI_API_KEY` | Gemini AI API key for tests | `AIza...` |

### For CI (Optional)
| Secret | Description | Example |
|--------|-------------|---------|
| `CODECOV_TOKEN` | Codecov upload token | `abc123...` |

### For Deployment (Choose Platform)

#### Vercel (Default)
| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel auth token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel project ID | From `.vercel/project.json` |

#### Netlify (Alternative)
| Secret | Description | How to Get |
|--------|-------------|------------|
| `NETLIFY_AUTH_TOKEN` | Netlify auth token | https://app.netlify.com/user/applications |
| `NETLIFY_SITE_ID` | Netlify site ID | Site settings → General |

### Application Secrets
| Secret | Description | Required |
|--------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Optional (defaults to https://api.arbi.creai.dev) |
| `VITE_SENTRY_DSN` | Sentry error monitoring | Optional |

## Environment Variables

### Build-time Variables
These are embedded in the build at compile time:

```env
VITE_API_BASE_URL=https://api.arbi.creai.dev
VITE_GEMINI_API_KEY=your_key_here
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ENABLE_ANALYTICS=false
VITE_APP_VERSION=1.0.0
```

### Server-side Variables (CI only)
```env
GEMINI_API_KEY=your_key_here  # For build/test
NODE_ENV=production
```

## Pipeline Features

### ✅ Implemented

1. **Multi-version Testing**
   - Tests on Node.js 18.x and 20.x
   - Ensures compatibility

2. **Code Quality Checks**
   - ESLint for code quality
   - TypeScript for type safety
   - Prettier (if configured)

3. **Comprehensive Testing**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Coverage reporting

4. **Build Optimization**
   - Code splitting
   - Tree shaking
   - Minification
   - Asset optimization

5. **Artifact Management**
   - Build artifacts (7 days retention)
   - Test reports (30 days retention)
   - Coverage reports

6. **Smart Deployment**
   - Production on main branch
   - Preview deployments for PRs
   - Automatic rollback on failure

7. **Caching**
   - npm dependencies cached
   - Faster subsequent builds

### 🚧 Optional Enhancements

1. **Coverage Requirements**
   - Enforce minimum coverage thresholds
   - Block PRs below threshold

2. **Visual Regression Testing**
   - Percy or Chromatic integration
   - Screenshot comparison

3. **Performance Budgets**
   - Bundle size limits
   - Lighthouse CI integration

4. **Security Scanning**
   - npm audit in CI
   - Snyk or Dependabot

5. **Release Automation**
   - Semantic versioning
   - Changelog generation
   - GitHub releases

## Monitoring & Notifications

### Build Status
- View in GitHub Actions tab
- Status checks on PRs
- Email notifications (configurable)

### Coverage Reports
- Codecov dashboard
- Coverage trends over time
- PR comments with coverage diff

### Deployment Status
- Vercel/Netlify dashboard
- Deployment URLs in Actions output
- PR comments with preview links

## Troubleshooting

### Common Issues

#### 1. Build Fails in CI but Works Locally

**Possible Causes:**
- Environment variable differences
- Node version mismatch
- Cached dependencies

**Solutions:**
```bash
# Test with CI Node version locally
nvm use 20
npm ci  # Use clean install like CI
npm run build:prod
```

#### 2. Tests Pass Locally but Fail in CI

**Possible Causes:**
- Timezone differences
- Missing environment variables
- Race conditions in tests

**Solutions:**
- Check GitHub Actions logs
- Add environment variables to secrets
- Use explicit waits in tests

#### 3. Deployment Fails

**Possible Causes:**
- Missing secrets
- Invalid configuration
- Build errors

**Solutions:**
- Verify all secrets are set
- Check deployment platform logs
- Test build locally: `npm run build:prod`

#### 4. Slow CI Runs

**Optimizations:**
- Enable caching (already configured)
- Reduce test timeout
- Parallelize tests
- Use shallow git clone

### Debug Commands

```bash
# Simulate CI environment locally
export CI=true
npm ci
npm run validate
npm run build:prod

# Check for outdated dependencies
npm outdated

# Audit security vulnerabilities
npm audit

# Clean and rebuild
npm run clean
npm install
npm run build
```

## Performance Metrics

### Typical CI Run Times

| Job | Average Time | Notes |
|-----|--------------|-------|
| Test (Node 18) | 3-5 min | Includes install, lint, test, build |
| Test (Node 20) | 3-5 min | Same as above |
| E2E Tests | 2-4 min | Depends on test suite size |
| Deploy | 2-3 min | Depends on platform |

### Build Size

Target bundle sizes:
- Initial bundle: < 500 KB (gzipped)
- Vendor chunks: < 300 KB each
- Total: < 1 MB (gzipped)

## Best Practices

### For Contributors

1. **Before Pushing:**
   ```bash
   npm run validate     # Run all checks
   npm run test:e2e     # Run E2E tests
   ```

2. **Writing Tests:**
   - Add tests for new features
   - Maintain or improve coverage
   - Ensure tests are deterministic

3. **Pull Requests:**
   - Wait for CI to pass
   - Review coverage changes
   - Check preview deployment

### For Maintainers

1. **Managing Secrets:**
   - Rotate tokens regularly
   - Use minimal permissions
   - Document secret purposes

2. **Monitoring:**
   - Review failed builds promptly
   - Check coverage trends
   - Monitor bundle size

3. **Optimization:**
   - Keep dependencies updated
   - Review and optimize slow tests
   - Improve caching strategies

## Related Documentation

- [Deployment Guide](.github/DEPLOYMENT.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Issue Templates](.github/ISSUE_TEMPLATE/)

## Status Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Deploy/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
```

## Support

For CI/CD issues:
1. Check this document first
2. Review [Deployment Guide](.github/DEPLOYMENT.md)
3. Search existing GitHub Issues
4. Create new issue using [CI/CD template](.github/ISSUE_TEMPLATE/ci-cd-issue.md)

---

**Last Updated:** 2026-04-02
**Maintained By:** DevOps Team
