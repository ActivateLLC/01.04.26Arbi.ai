# 🌊 SWARM ACTIVATION PROMPT - Arbi.ai Frontend Completion

## Mission: Complete Production-Ready E-Commerce Arbitrage Frontend

You are part of an autonomous agent swarm tasked with completing the **Arbi.ai** frontend application to production-ready standards. This is a high-value SaaS product that automates e-commerce arbitrage using AI.

---

## 📋 Your Instructions

### 1. READ THE CONTEXT FIRST
**MANDATORY:** Read `.claude-flow/workflows/arbi-frontend-context.md` before starting ANY work.

This file contains:
- Complete project overview
- Current state analysis
- What's missing/incomplete
- Priority tasks
- Success criteria

### 2. COORDINATE WITH THE SWARM
- You are **NOT working alone** - coordinate with other specialized agents
- Use `.claude-flow/sessions/` for sharing progress
- Check `.claude-flow/metrics/` for performance data
- Review `.claude-flow/logs/` for what's been attempted

### 3. FOLLOW THE WORKFLOW
Execute phases from `.claude-flow/workflows/complete-frontend.yaml` in order:
1. ✅ Analysis & Planning
2. 🔧 Core Features Completion
3. 🎨 UI/UX Enhancement
4. 🗄️ Data & State Management
5. ✅ Testing & Quality
6. ⚡ Performance & Optimization
7. 📚 Documentation & DevOps
8. 🔒 Security & Analytics

---

## 🎯 CRITICAL PRIORITIES (Do These FIRST)

### Phase 1: Foundation (Week 1)
1. **Error Boundaries** - Wrap App.tsx and major components
2. **Loading States** - Add skeletons to all async operations
3. **Global State** - Implement Zustand for state management
4. **React Query** - Replace manual fetch() calls
5. **Testing Setup** - Configure Vitest + Testing Library

### Phase 2: Core Features (Week 1-2)
1. **Toast Notifications** - User feedback system
2. **Form Validation** - ControlPanel inputs
3. **Error Handling** - Retry logic, user-friendly messages
4. **Accessibility** - ARIA labels, keyboard navigation
5. **Mobile Optimization** - Touch gestures, responsive fixes

### Phase 3: Quality & Performance (Week 2-3)
1. **Unit Tests** - Services and utilities (80%+ coverage)
2. **Component Tests** - All major components
3. **E2E Tests** - Critical flows (simulation, auto-list)
4. **Code Splitting** - Lazy load routes and heavy components
5. **Bundle Optimization** - Target < 500KB gzipped

### Phase 4: Polish & Deploy (Week 3-4)
1. **Documentation** - JSDoc, README, Storybook
2. **CI/CD Pipeline** - GitHub Actions
3. **Environment Config** - .env.example, validation
4. **Security Audit** - Fix vulnerabilities
5. **Analytics** - Track user behavior

---

## 🤖 AGENT SPECIALIZATIONS

### If you are a **System Design Agent**:
- Analyze entire codebase structure
- Create architecture diagrams
- Identify anti-patterns
- Document technical debt
- Propose refactoring strategy

### If you are a **Frontend Developer Agent**:
- Complete UI components
- Add loading/error states
- Implement accessibility
- Optimize performance
- Write component tests

### If you are a **Backend Integration Agent**:
- Complete service layer (arbiService, geminiService)
- Add error handling and retries
- Implement request caching
- Add TypeScript types
- Write integration tests

### If you are a **Testing Agent**:
- Set up test infrastructure (Vitest, Testing Library, Playwright)
- Write unit tests for services
- Write component tests
- Write E2E tests for critical flows
- Achieve 80%+ code coverage

### If you are a **DevOps Agent**:
- Create GitHub Actions workflows
- Set up environment variables
- Configure deployment pipeline
- Add monitoring and logging
- Optimize build process

### If you are a **Security Agent**:
- Move Gemini API key to backend proxy
- Add input validation
- Implement CSP headers
- Run security audit
- Fix vulnerabilities

### If you are a **Documentation Agent**:
- Write JSDoc for all functions
- Create comprehensive README
- Set up Storybook
- Document API integration
- Write troubleshooting guide

### If you are a **Performance Agent**:
- Analyze bundle size
- Implement code splitting
- Add React.memo where needed
- Optimize chart rendering
- Add performance monitoring

---

## 📐 TECHNICAL STANDARDS

### Code Quality
- ✅ TypeScript strict mode enabled
- ✅ No `any` types (use proper interfaces)
- ✅ ESLint + Prettier configured
- ✅ Husky pre-commit hooks
- ✅ All imports sorted
- ✅ Max file length: 300 lines

### Component Structure
```typescript
// 1. Imports (grouped and sorted)
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './Button';
import type { User } from '../types';

// 2. Types/Interfaces
interface Props {
  userId: string;
  onUpdate: (user: User) => void;
}

// 3. Component
export const UserProfile: React.FC<Props> = ({ userId, onUpdate }) => {
  // Hooks first
  const { data, isLoading, error } = useQuery(...);
  const [localState, setLocalState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleSubmit = () => {};

  // Render guards
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  // Main render
  return <div>...</div>;
};
```

### Testing Requirements
```typescript
// Unit Test (services/utils)
describe('arbiService', () => {
  it('should fetch opportunities with retry on failure', async () => {
    // Test with mock API responses
  });
});

// Component Test
describe('OpportunityCard', () => {
  it('should display product details correctly', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);
    expect(screen.getByText(/product title/i)).toBeInTheDocument();
  });
});

// E2E Test (Playwright)
test('user can auto-list an opportunity', async ({ page }) => {
  await page.goto('/opportunities');
  await page.click('[data-testid="auto-list-btn"]');
  await expect(page.locator('.success-toast')).toBeVisible();
});
```

### State Management Pattern
```typescript
// Zustand Store Example
import create from 'zustand';

interface AppState {
  status: SystemStatus;
  setStatus: (status: SystemStatus) => void;
  totalProfit: number;
  incrementProfit: (amount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  status: SystemStatus.IDLE,
  setStatus: (status) => set({ status }),
  totalProfit: 0,
  incrementProfit: (amount) => set((state) => ({ 
    totalProfit: state.totalProfit + amount 
  })),
}));
```

### Data Fetching Pattern
```typescript
// React Query Hook
import { useQuery, useMutation } from '@tanstack/react-query';

export const useOpportunities = () => {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: () => getArbitrageOpportunities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useAutoList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: autoListOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries(['opportunities']);
      toast.success('Product listed successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to list: ${error.message}`);
    },
  });
};
```

---

## ✅ DEFINITION OF DONE

A task is **NOT complete** until:
1. ✅ Code is written and tested
2. ✅ Tests pass (unit + component + E2E where applicable)
3. ✅ TypeScript compiles with no errors (strict mode)
4. ✅ ESLint shows no warnings
5. ✅ Build succeeds and bundle size is acceptable
6. ✅ Documentation is updated
7. ✅ Changes are committed with meaningful message
8. ✅ PR is created (if applicable)

---

## 🚨 ANTI-PATTERNS TO AVOID

### ❌ DON'T DO THIS:
```typescript
// Using any type
const data: any = await fetch();

// Ignoring errors
try {
  await api.call();
} catch (e) {
  // Silent failure - BAD!
}

// No loading state
return <div>{data.map(...)}</div>; // Crashes if data is undefined

// Prop drilling hell
<Parent>
  <Child1 user={user} settings={settings}>
    <Child2 user={user} settings={settings}>
      <Child3 user={user} settings={settings} />
    </Child2>
  </Child1>
</Parent>
```

### ✅ DO THIS:
```typescript
// Proper typing
interface ApiResponse {
  data: Opportunity[];
  meta: { total: number };
}

// Graceful error handling
try {
  await api.call();
} catch (error) {
  logger.error('API call failed', error);
  toast.error('Something went wrong. Please try again.');
  throw error; // Re-throw if needed upstream
}

// With loading state
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorState error={error} />;
return <div>{data.map(...)}</div>;

// Use context/state management
const { user, settings } = useAppStore();
```

---

## 📊 SUCCESS METRICS

Track your progress in `.claude-flow/metrics/frontend-completion.json`:

```json
{
  "test_coverage": 85,
  "bundle_size_kb": 420,
  "lighthouse_score": 94,
  "typescript_errors": 0,
  "eslint_warnings": 0,
  "components_with_tests": 18,
  "total_components": 20,
  "apis_with_error_handling": 8,
  "total_api_calls": 8,
  "accessibility_score": 92,
  "performance_score": 90
}
```

**Target Goals:**
- Test Coverage: **> 80%**
- Bundle Size: **< 500KB gzipped**
- Lighthouse: **> 90**
- TypeScript Errors: **0**
- ESLint Warnings: **0**
- Accessibility: **WCAG AA compliant**

---

## 🔄 WORKFLOW EXECUTION

### Step 1: Initialize Your Work
```bash
# Update swarm metrics
echo '{"agent": "frontend-dev", "status": "started", "phase": "core-features"}' \
  >> .claude-flow/sessions/current-work.json

# Create your session file
echo "Starting core features completion - $(date)" \
  > .claude-flow/sessions/agent-$(whoami)-session.md
```

### Step 2: Execute Your Tasks
- Work on tasks from your specialization
- Follow the technical standards above
- Write tests as you go
- Document your changes

### Step 3: Report Progress
```bash
# Update metrics after each major task
node .claude/helpers/metrics-db.mjs update frontend-completion \
  --test-coverage 75 \
  --components-completed 5

# Log your work
echo "Completed: Error boundaries for App.tsx and major components" \
  >> .claude-flow/logs/frontend-completion.log
```

### Step 4: Coordinate
- Check `.claude-flow/sessions/` for other agents' work
- Avoid duplicate work
- Build on others' progress
- Communicate blockers

---

## 🎬 EXECUTION COMMAND

To start the swarm, run:

```bash
npx claude-flow swarm coordinate \
  --workflow=.claude-flow/workflows/complete-frontend.yaml \
  --context=.claude-flow/workflows/arbi-frontend-context.md \
  --max-agents=12 \
  --topology=hierarchical \
  --output=.claude-flow/sessions/frontend-completion-$(date +%Y%m%d).md
```

Or use the Agent tool in Claude Code to spawn specialized agents with this prompt.

---

## 📚 RESOURCES

### Documentation
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)

### Project Files
- Context: `.claude-flow/workflows/arbi-frontend-context.md`
- Workflow: `.claude-flow/workflows/complete-frontend.yaml`
- Config: `CLAUDE.md`
- Agents: `.claude/agents/`
- Sessions: `.claude-flow/sessions/`

---

## 🚀 LET'S BUILD!

You are building a **production SaaS product** that will be used by real users to make money through automated arbitrage. This is not a toy project.

**Quality matters. Testing matters. UX matters. Performance matters.**

Good luck, agents! 🤖✨

---

**Last Updated:** 2026-04-02  
**Swarm Version:** Ruflo V3.5.48  
**Repository:** ActivateLLC/01.04.26Arbi.ai  
**Branch:** claude/run-the-a-1CbA1
