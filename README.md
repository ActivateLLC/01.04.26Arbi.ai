<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Arbi.ai - Automated Arbitrage Platform

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Deploy/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An AI-powered arbitrage detection and analysis platform built with React, TypeScript, and Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1fkQkeomiNTGutGOdjPWTsAo55EmCUv24

## Features

- Real-time arbitrage opportunity detection
- AI-powered market analysis using Gemini
- Interactive charts and visualizations
- Comprehensive test coverage
- Automated CI/CD pipeline
- Production-ready deployment

## Run Locally

**Prerequisites:** Node.js 18+ and npm

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   VITE_API_BASE_URL=https://api.arbi.creai.dev
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:prod` | Build with validation and tests |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run validate` | Run all checks (lint, type-check, test) |

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### CI Workflow
- Runs on every push and pull request
- Tests on Node.js 18.x and 20.x
- Executes linting, type checking, and unit tests
- Runs E2E tests with Playwright
- Uploads coverage to Codecov
- Builds the application

### Deploy Workflow
- Deploys to production on push to `main` branch
- Creates preview deployments for pull requests
- Supports Vercel (default) and Netlify

### Required GitHub Secrets

For deployment, configure these secrets in your repository settings:

**For Vercel:**
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

**For Netlify (alternative):**
- `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
- `NETLIFY_SITE_ID`: Your Netlify site ID

**For Codecov (optional):**
- `CODECOV_TOKEN`: Your Codecov token

**Application Secrets:**
- `GEMINI_API_KEY`: Your Gemini API key
- `VITE_API_BASE_URL`: Backend API URL (optional, defaults to https://api.arbi.creai.dev)
- `VITE_SENTRY_DSN`: Sentry DSN for error monitoring (optional)

## Environment Variables

See [`.env.example`](.env.example) for all available environment variables.

**Important Security Note:** The `GEMINI_API_KEY` should be moved to a backend service in production to avoid exposing it in the client bundle.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **AI Integration:** Google Gemini AI
- **Charts:** Recharts
- **Testing:** Vitest, Testing Library, Playwright
- **Styling:** CSS Modules
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel/Netlify

## Error Monitoring (Optional)

To enable Sentry error monitoring:

1. Install Sentry:
   ```bash
   npm install @sentry/react
   ```

2. Uncomment the Sentry initialization in `sentry.config.ts`

3. Add your Sentry DSN to `.env.local`:
   ```env
   VITE_SENTRY_DSN=your_sentry_dsn_here
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
