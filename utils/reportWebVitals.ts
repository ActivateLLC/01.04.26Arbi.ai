import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

type MetricName = 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';

interface WebVitalsReport {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

const reportMetric = (metric: Metric) => {
  const report: WebVitalsReport = {
    name: metric.name as MetricName,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${report.name}:`, {
      value: `${report.value.toFixed(2)}ms`,
      rating: report.rating,
    });
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    // You can send to analytics service here
    // Example: sendToAnalytics(report);
  }
};

export const reportWebVitals = () => {
  // Core Web Vitals
  onCLS(reportMetric); // Cumulative Layout Shift
  onFID(reportMetric); // First Input Delay (deprecated, but still measured)
  onFCP(reportMetric); // First Contentful Paint
  onLCP(reportMetric); // Largest Contentful Paint
  onTTFB(reportMetric); // Time to First Byte
  onINP(reportMetric); // Interaction to Next Paint (replaces FID)
};
