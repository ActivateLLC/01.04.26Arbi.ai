import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SystemStatus, LogEntry, ChartDataPoint, PipelineStage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // System state
  status: SystemStatus;
  activeTab: 'simulation' | 'opportunities' | 'marketplace';

  // Configuration
  dailySpend: number;
  riskTolerance: number;

  // Metrics
  totalProfit: number;
  roi: number;

  // Logs and visualization
  logs: LogEntry[];
  activeStage: PipelineStage | null;
  chartData: ChartDataPoint[];

  // Actions
  setStatus: (status: SystemStatus) => void;
  setActiveTab: (tab: 'simulation' | 'opportunities' | 'marketplace') => void;
  setDailySpend: (spend: number) => void;
  setRiskTolerance: (tolerance: number) => void;
  setTotalProfit: (profit: number) => void;
  updateTotalProfit: (increment: number) => void;
  setRoi: (roi: number) => void;
  updateRoi: (increment: number) => void;
  addLog: (log: LogEntry) => void;
  addLogs: (logs: LogEntry[]) => void;
  setActiveStage: (stage: PipelineStage | null) => void;
  updateChartData: (data: ChartDataPoint) => void;
  setChartData: (data: ChartDataPoint[]) => void;
  toggleStatus: () => void;
  resetSimulation: () => void;
}

const initialChartData = Array.from({ length: 10 }).map((_, i) => ({
  time: new Date(Date.now() - (10 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  revenue: 0,
  spend: 0,
  profit: 0
}));

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      status: SystemStatus.IDLE,
      activeTab: 'simulation',
      dailySpend: 500,
      riskTolerance: 35,
      totalProfit: 0,
      roi: 0,
      logs: [
        { id: uuidv4(), timestamp: new Date().toLocaleTimeString(), category: 'SYSTEM', message: 'ArbiOS v4.2.0 initialized.' },
        { id: uuidv4(), timestamp: new Date().toLocaleTimeString(), category: 'SYSTEM', message: 'Waiting for user input...' },
      ],
      activeStage: null,
      chartData: initialChartData,

      // Actions
      setStatus: (status) => set({ status }, false, 'setStatus'),

      setActiveTab: (tab) => set({ activeTab: tab }, false, 'setActiveTab'),

      setDailySpend: (spend) => set({ dailySpend: spend }, false, 'setDailySpend'),

      setRiskTolerance: (tolerance) => set({ riskTolerance: tolerance }, false, 'setRiskTolerance'),

      setTotalProfit: (profit) => set({ totalProfit: profit }, false, 'setTotalProfit'),

      updateTotalProfit: (increment) =>
        set((state) => ({ totalProfit: state.totalProfit + increment }), false, 'updateTotalProfit'),

      setRoi: (roi) => set({ roi }, false, 'setRoi'),

      updateRoi: (increment) =>
        set((state) => ({ roi: Math.min(320, state.roi + increment) }), false, 'updateRoi'),

      addLog: (log) =>
        set((state) => ({ logs: [...state.logs, log].slice(-50) }), false, 'addLog'),

      addLogs: (newLogs) =>
        set((state) => ({ logs: [...state.logs, ...newLogs].slice(-50) }), false, 'addLogs'),

      setActiveStage: (stage) => set({ activeStage: stage }, false, 'setActiveStage'),

      updateChartData: (newPoint) =>
        set((state) => ({
          chartData: [...state.chartData.slice(1), newPoint]
        }), false, 'updateChartData'),

      setChartData: (data) => set({ chartData: data }, false, 'setChartData'),

      toggleStatus: () => {
        const currentStatus = get().status;
        const newStatus = currentStatus === SystemStatus.ACTIVE ? SystemStatus.IDLE : SystemStatus.ACTIVE;

        if (newStatus === SystemStatus.IDLE) {
          // Stopping simulation
          set({
            status: newStatus,
            activeStage: null,
            logs: [...get().logs, {
              id: uuidv4(),
              timestamp: new Date().toLocaleTimeString(),
              category: 'SYSTEM',
              message: 'Sequence aborted by user.'
            }].slice(-50)
          }, false, 'toggleStatus:stop');
        } else {
          // Starting simulation
          set({
            status: newStatus,
            logs: [...get().logs, {
              id: uuidv4(),
              timestamp: new Date().toLocaleTimeString(),
              category: 'SYSTEM',
              message: 'Authentication successful. Neural engine spooling up...'
            }].slice(-50)
          }, false, 'toggleStatus:start');
        }
      },

      resetSimulation: () =>
        set({
          status: SystemStatus.IDLE,
          totalProfit: 0,
          roi: 0,
          activeStage: null,
          chartData: initialChartData,
          logs: [
            { id: uuidv4(), timestamp: new Date().toLocaleTimeString(), category: 'SYSTEM', message: 'ArbiOS v4.2.0 initialized.' },
            { id: uuidv4(), timestamp: new Date().toLocaleTimeString(), category: 'SYSTEM', message: 'Waiting for user input...' },
          ]
        }, false, 'resetSimulation'),
    }),
    { name: 'AppStore' }
  )
);

// Custom hook for easier access to app state
export const useAppState = () => {
  const status = useAppStore((state) => state.status);
  const activeTab = useAppStore((state) => state.activeTab);
  const dailySpend = useAppStore((state) => state.dailySpend);
  const riskTolerance = useAppStore((state) => state.riskTolerance);
  const totalProfit = useAppStore((state) => state.totalProfit);
  const roi = useAppStore((state) => state.roi);
  const logs = useAppStore((state) => state.logs);
  const activeStage = useAppStore((state) => state.activeStage);
  const chartData = useAppStore((state) => state.chartData);

  const setStatus = useAppStore((state) => state.setStatus);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setDailySpend = useAppStore((state) => state.setDailySpend);
  const setRiskTolerance = useAppStore((state) => state.setRiskTolerance);
  const toggleStatus = useAppStore((state) => state.toggleStatus);
  const updateTotalProfit = useAppStore((state) => state.updateTotalProfit);
  const updateRoi = useAppStore((state) => state.updateRoi);
  const addLog = useAppStore((state) => state.addLog);
  const addLogs = useAppStore((state) => state.addLogs);
  const setActiveStage = useAppStore((state) => state.setActiveStage);
  const updateChartData = useAppStore((state) => state.updateChartData);
  const resetSimulation = useAppStore((state) => state.resetSimulation);

  return {
    status,
    activeTab,
    dailySpend,
    riskTolerance,
    totalProfit,
    roi,
    logs,
    activeStage,
    chartData,
    setStatus,
    setActiveTab,
    setDailySpend,
    setRiskTolerance,
    toggleStatus,
    updateTotalProfit,
    updateRoi,
    addLog,
    addLogs,
    setActiveStage,
    updateChartData,
    resetSimulation,
  };
};
