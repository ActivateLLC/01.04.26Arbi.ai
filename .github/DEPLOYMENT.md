# Deployment Guide

This guide explains how to deploy the Arbi.ai application to production.

## Table of Contents

1. [Vercel Deployment](#vercel-deployment)
2. [Netlify Deployment](#netlify-deployment)
3. [Environment Variables](#environment-variables)
4. [CI/CD Configuration](#cicd-configuration)
5. [Troubleshooting](#troubleshooting)

## Vercel Deployment

### Prerequisites
- Vercel account: https://vercel.com/signup
- Vercel CLI (optional): `npm i -g vercel`

### Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Automated Deployment with GitHub

1. **Connect Repository:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project settings

2. **Get Required IDs:**
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Link your project
   vercel link
   
   # Get project and org IDs from .vercel/project.json
   cat .vercel/project.json
   ```

3. **Add GitHub Secrets:**
   Go to your repository Settings > Secrets and variables > Actions:
   
   - `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: From `.vercel/project.json` (orgId field)
   - `VERCEL_PROJECT_ID`: From `.vercel/project.json` (projectId field)

4. **Configure Environment Variables in Vercel:**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add:
     - `GEMINI_API_KEY` (your Gemini API key)
     - `VITE_API_BASE_URL` (your backend API URL)
     - `VITE_SENTRY_DSN` (optional, for error monitoring)

### Vercel Configuration

Create `vercel.json` in project root (optional):

```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Netlify Deployment

### Prerequisites
- Netlify account: https://netlify.com/signup
- Netlify CLI (optional): `npm i -g netlify-cli`

### Manual Deployment

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy:**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Automated Deployment with GitHub

1. **Connect Repository:**
   - Go to https://app.netlify.com/start
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build:prod`
     - Publish directory: `dist`

2. **Get Required IDs:**
   - `NETLIFY_AUTH_TOKEN`: Go to https://app.netlify.com/user/applications/personal
   - `NETLIFY_SITE_ID`: Found in Site settings > General > Site information

3. **Add GitHub Secrets:**
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`

4. **Update Deploy Workflow:**
   Edit `.github/workflows/deploy.yml` and uncomment the Netlify section, comment out Vercel section.

### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.arbi.creai.dev` |
| `GEMINI_API_KEY` | Gemini AI API key | `AIza...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SENTRY_DSN` | Sentry error monitoring DSN | `https://...@sentry.io/...` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `VITE_APP_VERSION` | App version | `1.0.0` |

### Setting Environment Variables

**Vercel:**
```bash
vercel env add GEMINI_API_KEY production
vercel env add VITE_API_BASE_URL production
```

**Netlify:**
```bash
netlify env:set GEMINI_API_KEY "your_key_here"
netlify env:set VITE_API_BASE_URL "https://api.arbi.creai.dev"
```

## CI/CD Configuration

### GitHub Actions Workflows

1. **CI Workflow** (`.github/workflows/ci.yml`):
   - Runs on push and PR
   - Tests on multiple Node versions
   - Runs linting, type checking, tests
   - Uploads coverage

2. **Deploy Workflow** (`.github/workflows/deploy.yml`):
   - Deploys to production on main branch
   - Creates preview deployments for PRs

### Required GitHub Secrets

Add these in: Repository Settings > Secrets and variables > Actions

**For CI:**
- `CODECOV_TOKEN` (optional)
- `GEMINI_API_KEY`

**For Deployment:**
- Choose either Vercel OR Netlify secrets (see sections above)

### Testing the Pipeline

1. **Create a test branch:**
   ```bash
   git checkout -b test/ci-pipeline
   ```

2. **Make a small change:**
   ```bash
   echo "# Test" >> test.md
   git add test.md
   git commit -m "test: verify CI pipeline"
   ```

3. **Push and create PR:**
   ```bash
   git push origin test/ci-pipeline
   # Create PR on GitHub
   ```

4. **Verify:**
   - Check Actions tab for CI workflow
   - Verify all jobs pass
   - Check for preview deployment

## Build Optimization

The production build is optimized with:

- Code splitting (vendor chunks)
- Tree shaking
- Minification (Terser)
- CSS code splitting
- Asset optimization
- Source map generation (disabled in prod)
- Console removal in production

Build output analysis:
```bash
npm run build:prod
```

## Troubleshooting

### Build Fails in CI

1. **Check Node version:**
   Ensure CI uses Node 18+ (configured in workflows)

2. **Check environment variables:**
   Verify all required vars are set in GitHub Secrets

3. **Check logs:**
   Review the GitHub Actions logs for specific errors

### Deployment Fails

1. **Vercel:**
   - Verify token and IDs are correct
   - Check Vercel dashboard for errors
   - Ensure build command works locally

2. **Netlify:**
   - Verify auth token and site ID
   - Check Netlify deploy logs
   - Test build locally: `npm run build:prod`

### Environment Variable Issues

1. **Variable not available in app:**
   - Ensure it has `VITE_` prefix
   - Rebuild after adding variables
   - Clear cache: `rm -rf node_modules/.vite`

2. **Build-time vs Runtime:**
   - Vite env vars are inlined at build time
   - Changes require rebuild
   - Use import.meta.env, not process.env

### Performance Issues

1. **Slow builds:**
   - Use caching in CI (already configured)
   - Check dependency tree: `npm ls --depth=0`
   - Review bundle size: `npm run build`

2. **Large bundle:**
   - Review vite.config.ts chunk splitting
   - Check for duplicate dependencies
   - Use dynamic imports for heavy components

## Security Considerations

1. **API Keys:**
   - Never commit `.env` files
   - Rotate keys regularly
   - Move sensitive keys to backend

2. **Headers:**
   - Security headers configured in deployment configs
   - HTTPS enforced on both platforms

3. **Dependencies:**
   - Regular updates: `npm audit`
   - Review before installing
   - Use lock files

## Monitoring

1. **Vercel Analytics:**
   - Automatically available in dashboard
   - Track Web Vitals

2. **Sentry (Optional):**
   - Install: `npm install @sentry/react`
   - Configure in `sentry.config.ts`
   - Add DSN to environment variables

3. **Uptime Monitoring:**
   - Use services like UptimeRobot
   - Monitor API endpoints
   - Set up alerts

## Support

For issues or questions:
- Check GitHub Issues
- Review deployment logs
- Consult platform documentation:
  - Vercel: https://vercel.com/docs
  - Netlify: https://docs.netlify.com
