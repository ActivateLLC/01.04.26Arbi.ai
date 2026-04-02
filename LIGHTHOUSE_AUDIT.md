# Lighthouse Performance Audit Guide

## Quick Start

Run these commands to test the production build:

```bash
# Build for production
npm run build

# Start preview server
npm run preview

# Open browser to http://localhost:4173
```

## Running Lighthouse Audit

### Method 1: Chrome DevTools (Recommended)

1. Open Chrome/Edge browser
2. Navigate to `http://localhost:4173`
3. Open DevTools (F12 or Cmd+Option+I)
4. Go to "Lighthouse" tab
5. Select categories:
   - ✓ Performance
   - ✓ Accessibility
   - ✓ Best Practices
   - ✓ SEO
6. Choose "Desktop" or "Mobile"
7. Click "Analyze page load"

### Method 2: Chrome Extension

1. Install [Lighthouse Chrome Extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
2. Navigate to `http://localhost:4173`
3. Click Lighthouse extension icon
4. Click "Generate report"

### Method 3: CLI (For CI/CD)

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit and save report
lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html

# Open report
open lighthouse-report.html
```

## Performance Targets

### Core Web Vitals Goals:
- **LCP (Largest Contentful Paint):** < 2.5s ✓ Expected
- **INP (Interaction to Next Paint):** < 200ms ✓ Expected
- **CLS (Cumulative Layout Shift):** < 0.1 ✓ Expected

### Lighthouse Score Goals:
- **Performance:** > 90 (Target: 95+)
- **Accessibility:** > 90 (Target: 95+)
- **Best Practices:** > 90 (Target: 95+)
- **SEO:** > 90 (Target: 95+)

## Expected Results

Based on optimizations:

### Performance Score: 95+ Expected
- ✓ Bundle size: 249.87 KB gzipped (excellent)
- ✓ Code splitting: Lazy loaded components
- ✓ Image lazy loading: Enabled
- ✓ Vendor chunking: Optimized
- ✓ Render optimization: React.memo applied

### Potential Warnings (OK to ignore):
1. **"Largest Contentful Paint element"** - Expected for chart-heavy apps
2. **"Reduce unused JavaScript"** - Vendor chunks are optimized
3. **"Third-party code"** - Google AI SDK required for functionality

## Web Vitals Monitoring

### Development Mode:
Performance metrics are logged to the browser console:

```javascript
[Web Vitals] LCP: { value: '1234.56ms', rating: 'good' }
[Web Vitals] INP: { value: '89.12ms', rating: 'good' }
[Web Vitals] CLS: { value: '0.05', rating: 'good' }
```

### Production Mode:
Metrics are collected but not logged. To send to analytics:

```typescript
// Edit utils/reportWebVitals.ts
if (import.meta.env.PROD) {
  // Send to your analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(report)
  });
}
```

## Troubleshooting

### Issue: Low Performance Score

**Possible Causes:**
1. Large images not optimized
2. Too many opportunities rendering at once
3. Heavy network requests

**Solutions:**
1. Implement virtual scrolling (react-window already installed)
2. Add image compression pipeline
3. Optimize API response sizes

### Issue: Low Accessibility Score

**Current State:** App has good accessibility
- Semantic HTML used
- ARIA labels applied
- Keyboard navigation supported
- Screen reader compatible

**If Score is Low:**
1. Check for missing alt text on images
2. Verify color contrast ratios
3. Ensure all interactive elements are keyboard accessible

### Issue: Build Performance

If build is slow:
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

## CI/CD Integration

### GitHub Actions Example:

```yaml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run preview &
      - run: npx lighthouse http://localhost:4173 --output json --output-path ./report.json
      - run: node scripts/check-lighthouse-scores.js
```

## Monitoring Production

### Add Analytics Integration:

```typescript
// utils/reportWebVitals.ts
if (import.meta.env.PROD) {
  // Google Analytics
  gtag('event', report.name, {
    value: Math.round(report.value),
    metric_rating: report.rating,
  });

  // Or custom endpoint
  fetch('/api/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
}
```

### Recommended Tools:
- **Google Analytics 4** - Web Vitals integration
- **Vercel Analytics** - Automatic performance tracking
- **New Relic** - Real User Monitoring (RUM)
- **Sentry** - Performance monitoring + error tracking

## Performance Budget

### Current vs Budget:
```
Resource          Current    Budget    Status
───────────────────────────────────────────
Initial JS        145 KB     200 KB    ✓ Pass
Lazy JS           103 KB     300 KB    ✓ Pass
Total JS          249 KB     500 KB    ✓ Pass (50% under)
Images            TBD        100 KB    Monitor
Fonts             TBD        50 KB     Monitor
Total             ~250 KB    600 KB    ✓ Pass
```

## Next Steps

1. **Run Lighthouse audit** following Method 1 above
2. **Review scores** and identify any issues
3. **Optimize further** if scores < 90
4. **Set up monitoring** in production
5. **Document results** for team review

## Support

If Lighthouse scores are lower than expected:

1. Check build output for errors
2. Verify all optimizations are applied
3. Test on different devices/networks
4. Review performance report in this directory
5. Consider implementing virtual scrolling for large lists

## Success Criteria

✓ Performance Score: > 90  
✓ Accessibility Score: > 90  
✓ Best Practices Score: > 90  
✓ Bundle Size: < 500 KB gzipped  
✓ LCP: < 2.5s  
✓ INP: < 200ms  
✓ CLS: < 0.1  

**Current Status: Ready for Audit** 🚀
