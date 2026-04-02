/**
 * App Store - Global application state management
 * Manages system status, simulation parameters, logs, and chart data
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SystemStatus, LogEntry, ChartDataPoint, PipelineStage } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Navigation
  activeTab: 'simulation' | 'opportunities' | 'marketplace';
  setActiveTab: (tab: 'simulation' | 'opportunities' | 'marketplace') => void;

  // System Status
  status: SystemStatus;
  setStatus: (status: SystemStatus) => void;
  toggleStatus: () => void;

  // Simulation Parameters
  dailySpend: number;
  setDailySpend: (spend: number) => void;
  riskTolerance: number;
  setRiskTolerance: (tolerance: number) => void;

  // Performance Metrics
  totalProfit: number;
  setTotalProfit: (profit: number) => void;
  incrementTotalProfit: (increment: number) => void;
  roi: number;
  setRoi: (roi: number) => void;

  // Logs
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  addLogs: (logs: LogEntry[]) => void;
  clearLogs: () => void;

  // Pipeline State
  activeStage: PipelineStage | null;
  setActiveStage: (stage: PipelineStage | null) => void;

  // Chart Data
  chartData: ChartDataPoint[];
  setChartData: (data: ChartDataPoint[]) => void;
  addChartDataPoint: (point: ChartDataPoint) => void;
  initializeChartData: () => void;

  // Utility Actions
  resetSimulation: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Navigation
      activeTab: 'simulation',
      setActiveTab: (tab) => set({ activeTab: tab }, false, 'setActiveTab'),

      // System Status
      status: SystemStatus.IDLE,
      setStatus: (status) => set({ status }, false, 'setStatus'),
      toggleStatus: () => {
        const currentStatus = get().status;
        const newStatus = currentStatus === SystemStatus.ACTIVE ? SystemStatus.IDLE : SystemStatus.ACTIVE;

        // Add appropriate log entry
        const log: Omit<LogEntry, 'id' | 'timestamp'> = {
          category: 'SYSTEM',
          message: newStatus === SystemStatus.ACTIVE
            ? 'Authentication successful. Neural engine spooling up...'
            : 'Sequence aborted by user.'
        };

        set(
          {
            status: newStatus,
            activeStage: newStatus === SystemStatus.IDLE ? null : get().activeStage
          },
          false,
          'toggleStatus'
        );

        // Add log after status change
        get().addLog(log);
      },

      // Simulation Parameters
      dailySpend: 500,
      setDailySpend: (spend) => set({ dailySpend: spend }, false, 'setDailySpend'),
      riskTolerance: 35,
      setRiskTolerance: (tolerance) => set({ riskTolerance: tolerance }, false, 'setRiskTolerance'),

      // Performance Metrics
      totalProfit: 0,
      setTotalProfit: (profit) => set({ totalProfit: profit }, false, 'setTotalProfit'),
      incrementTotalProfit: (increment) =>
        set((state) => ({ totalProfit: state.totalProfit + increment }), false, 'incrementTotalProfit'),
      roi: 0,
      setRoi: (roi) => set({ roi }, false, 'setRoi'),

      // Logs
      logs: [
        {
          id: uuidv4(),
          timestamp: new Date().toLocaleTimeString(),
          category: 'SYSTEM' as const,
          message: 'ArbiOS v4.2.0 initialized.'
        },
        {
          id: uuidv4(),
          timestamp: new Date().toLocaleTimeString(),
          category: 'SYSTEM' as const,
          message: 'Waiting for user input...'
        },
      ],
      addLog: (log) =>
        set(
          (state) => ({
            logs: [
              ...state.logs,
              {
                ...log,
                id: uuidv4(),
                timestamp: new Date().toLocaleTimeString()
              }
            ].slice(-50) // Keep last 50 logs
          }),
          false,
          'addLog'
        ),
      addLogs: (newLogs) =>
        set(
          (state) => ({
            logs: [...state.logs, ...newLogs].slice(-50)
          }),
          false,
          'addLogs'
        ),
      clearLogs: () =>
        set(
          {
            logs: [
              {
                id: uuidv4(),
                timestamp: new Date().toLocaleTimeString(),
                category: 'SYSTEM' as const,
                message: 'Logs cleared.'
              }
            ]
          },
          false,
          'clearLogs'
        ),

      // Pipeline State
      activeStage: null,
      setActiveStage: (stage) => set({ activeStage: stage }, false, 'setActiveStage'),

      // Chart Data
      chartData: [],
      setChartData: (data) => set({ chartData: data }, false, 'setChartData'),
      addChartDataPoint: (point) =>
        set(
          (state) => ({
            chartData: [...state.chartData.slice(1), point]
          }),
          false,
          'addChartDataPoint'
        ),
      initializeChartData: () => {
        const initialData = Array.from({ length: 10 }).map((_, i) => ({
          time: new Date(Date.now() - (10 - i) * 60000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          revenue: 0,
          spend: 0,
          profit: 0
        }));
        set({ chartData: initialData }, false, 'initializeChartData');
      },

      // Utility Actions
      resetSimulation: () =>
        set(
          {
            status: SystemStatus.IDLE,
            totalProfit: 0,
            roi: 0,
            activeStage: null,
            logs: [
              {
                id: uuidv4(),
                timestamp: new Date().toLocaleTimeString(),
                category: 'SYSTEM' as const,
                message: 'Simulation reset.'
              }
            ]
          },
          false,
          'resetSimulation'
        ),
    }),
    { name: 'AppStore' }
  )
);

// Custom hook for convenience with common selectors
export const useAppState = () => {
  const store = useAppStore();
  return {
    // Navigation
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,

    // Status & Controls
    status: store.status,
    isActive: store.status === SystemStatus.ACTIVE,
    toggleStatus: store.toggleStatus,

    // Simulation Params
    dailySpend: store.dailySpend,
    setDailySpend: store.setDailySpend,
    riskTolerance: store.riskTolerance,
    setRiskTolerance: store.setRiskTolerance,

    // Metrics
    totalProfit: store.totalProfit,
    roi: store.roi,

    // Pipeline
    activeStage: store.activeStage,

    // Logs
    logs: store.logs,

    // Chart
    chartData: store.chartData,
  };
};
