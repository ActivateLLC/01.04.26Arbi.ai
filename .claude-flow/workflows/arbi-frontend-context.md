# Arbi.ai Frontend - Project Context for Agent Swarm

## Project Overview

**Arbi.ai** is a fully automated e-commerce arbitrage platform. This is the **FRONTEND ONLY** repository.

### What It Does
- Finds products at low prices on retailer sites (Walmart, Target, etc.)
- Auto-creates SEO marketplace listings
- Generates video ads from product images
- Runs paid ad campaigns on TikTok, Meta, YouTube
- Optimizes for 300% ROAS in real-time
- Auto-fulfills orders (dropshipping model)

### Tech Stack
- React 19 + TypeScript
- Vite 6.2 for build/dev
- Tailwind CSS (inline)
- Recharts for charts
- Google Gemini API for AI log generation
- Lucide React for icons

### Backend API
- Hosted at: `https://api.arbi.creai.dev`
- Proxied via Vite config (`/api/*` routes)
- Handles: marketplace listings, arbitrage opportunities, campaigns, scraping

## Current State Analysis

### ✅ What's Complete
1. **App Structure**
   - Main App.tsx with 3 tabs (Simulation, Opportunities, Marketplace)
   - Responsive sidebar navigation
   - Mobile-friendly header

2. **Components (7 total)**
   - ✅ ControlPanel - start/stop, daily spend, risk tolerance sliders
   - ✅ PipelineVisualizer - 6-stage AI pipeline visualization
   - ✅ TerminalLog - scrolling logs with categories
   - ✅ RevenueChart - Recharts area chart
   - ✅ Dashboard - stats overview (placeholder)
   - ✅ MarketplaceStats - live marketplace data
   - ✅ Opportunities - browse arbitrage opportunities, auto-list

3. **Services (2)**
   - ✅ geminiService.ts - generates AI logs via Gemini API
   - ✅ arbiService.ts - marketplace API integration

4. **Types**
   - Complete TypeScript interfaces for all data models

### 🚧 What's Missing/Incomplete

#### 1. Error Handling & Loading States
- ❌ No error boundaries
- ❌ Loading skeletons missing on most components
- ❌ API error states not user-friendly
- ❌ No retry logic for failed requests
- ❌ No timeout handling

#### 2. State Management
- ❌ All state is local (useState)
- ❌ No global state management (Context/Zustand)
- ❌ No caching for API responses
- ❌ Props drilling in several places
- ❌ No optimistic updates

#### 3. Testing
- ❌ Zero tests written
- ❌ No test framework configured
- ❌ No E2E tests
- ❌ No component tests

#### 4. Performance
- ❌ No code splitting
- ❌ No lazy loading
- ❌ Large components not memoized
- ❌ Charts re-render unnecessarily
- ❌ No virtual scrolling for opportunity lists

#### 5. UX Enhancements
- ❌ No toast notifications
- ❌ No loading spinners
- ❌ No empty states
- ❌ No confirmation dialogs for destructive actions
- ❌ No keyboard shortcuts
- ❌ No accessibility (ARIA labels, focus management)

#### 6. Data Fetching
- ❌ Manual fetch() calls everywhere
- ❌ No React Query or SWR
- ❌ No request deduplication
- ❌ No background refetching

#### 7. Mobile Experience
- ❌ Charts not touch-optimized
- ❌ Sidebar doesn't work on mobile
- ❌ No PWA manifest
- ❌ No offline support

#### 8. Security
- ❌ Gemini API key exposed in frontend (process.env)
- ❌ No input sanitization
- ❌ No CSRF protection
- ❌ No rate limiting on client side

#### 9. DevOps
- ❌ No CI/CD pipeline
- ❌ No deployment config
- ❌ No environment variable management (.env)
- ❌ No build optimization

#### 10. Documentation
- ❌ No component documentation
- ❌ No JSDoc comments
- ❌ No Storybook
- ❌ README is minimal

## Priority Tasks

### 🔴 CRITICAL (Do First)
1. **Add error boundaries** to prevent white screen crashes
2. **Set up testing framework** (Vitest + Testing Library)
3. **Fix Gemini API key security** (move to backend proxy)
4. **Add proper loading states** to all async operations
5. **Implement global state management** (Zustand recommended)

### 🟡 HIGH (Do Next)
1. **Add React Query** for data fetching
2. **Create toast notification system**
3. **Add form validation** for ControlPanel inputs
4. **Optimize bundle size** with code splitting
5. **Add accessibility** (keyboard nav, ARIA)

### 🟢 MEDIUM (Nice to Have)
1. **Add Storybook** for component library
2. **Implement dark/light theme toggle**
3. **Add PWA support** (manifest, service worker)
4. **Create E2E tests** with Playwright
5. **Add analytics tracking**

### 🔵 LOW (Future)
1. **Add animations** with Framer Motion
2. **Implement i18n** for multiple languages
3. **Add keyboard shortcuts**
4. **Create admin panel**

## Agent Guidelines

### File Organization
- ✅ Already has good structure (components/, services/, types.ts)
- ❌ Need to add: `utils/`, `hooks/`, `contexts/`, `__tests__/`

### Code Style
- Use functional components with hooks
- TypeScript strict mode
- Tailwind inline classes (no CSS files)
- Keep components under 300 lines
- Extract custom hooks for reusable logic

### Testing Strategy
- Unit tests for services and utilities
- Component tests for UI components
- E2E tests for critical flows (auto-list, simulation)
- Aim for 80%+ coverage

### Performance Targets
- Bundle size < 500KB gzipped
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse score > 90

## API Endpoints (for reference)

```
GET  /api/marketplace              - Fetch all listings
POST /api/marketplace/list         - Create new listing
POST /api/scrape-rainforest/:id    - Scrape product images
GET  /api/arbitrage/opportunities  - Fetch opportunities
POST /api/arbitrage/evaluate       - Evaluate opportunity
POST /api/campaigns/launch/:id     - Launch ad campaign
```

## Environment Variables Needed

```bash
VITE_API_BASE_URL=https://api.arbi.creai.dev
VITE_GEMINI_API_KEY=<move this to backend>
VITE_ANALYTICS_ID=<optional>
```

## Success Criteria

When frontend is complete:
- ✅ All components have loading/error states
- ✅ Test coverage > 80%
- ✅ Zero TypeScript errors in strict mode
- ✅ Bundle size < 500KB
- ✅ Lighthouse score > 90
- ✅ Accessible (WCAG AA)
- ✅ CI/CD pipeline working
- ✅ Documentation complete

## Notes for Agents

- **Backend is separate** - don't create server code here
- **API is already built** - focus on frontend integration
- **Design is already done** - maintain the futuristic dark theme
- **This is production code** - write production-quality, not prototype code
- **User wants it complete** - don't skip "nice to have" features
