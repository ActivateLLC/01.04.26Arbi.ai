import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { ChartDataPoint } from '../types';

interface RevenueChartProps {
  data: ChartDataPoint[];
  error?: Error | null;
}

export const RevenueChart: React.FC<RevenueChartProps> = React.memo(({ data, error }) => {
  // Error state
  if (error) {
    return (
      <div className="w-full h-full min-h-[200px] flex items-center justify-center" role="alert" aria-live="polite">
        <div className="text-center">
          <AlertTriangle size={32} className="text-red-400 mb-2 mx-auto" aria-hidden="true" />
          <p className="text-sm text-red-400">Failed to load chart</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[200px] flex items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-slate-500">No data available</p>
      </div>
    );
  }

  // Calculate summary for screen readers
  const latestData = data[data.length - 1];
  const chartSummary = latestData
    ? `Revenue chart showing latest profit of $${latestData.profit.toFixed(2)} and spend of $${latestData.spend.toFixed(2)} at ${latestData.time}`
    : 'Revenue chart with no data';

  return (
    <div className="w-full h-full min-h-[200px]">
      {/* Screen reader accessible description */}
      <div className="sr-only" role="img" aria-label={chartSummary}>
        {chartSummary}
      </div>
      <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{fontSize: 10, fill: '#64748b'}}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{fontSize: 10, fill: '#64748b'}}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
            labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#ef4444"
            strokeWidth={1}
            fillOpacity={1}
            fill="url(#colorSpend)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});