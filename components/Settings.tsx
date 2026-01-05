import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, X, RefreshCw, AlertCircle, Server, Database, Zap } from 'lucide-react';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  endpoint: string;
  lastChecked?: string;
}

interface ArbitrageSettings {
  minProfitMargin: number;
  maxProductPrice: number;
  riskTolerance: number;
  autoListEnabled: boolean;
}

export const Settings: React.FC = () => {
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<ArbitrageSettings>({
    minProfitMargin: 20,
    maxProductPrice: 500,
    riskTolerance: 35,
    autoListEnabled: false,
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    checkAllHealth();
    loadSettings();
  }, []);

  const checkAllHealth = async () => {
    setLoading(true);

    const endpoints = [
      { service: 'API Server', endpoint: '/health' },
      { service: 'Marketplace', endpoint: '/api/marketplace/health' },
      { service: 'Arbitrage Engine', endpoint: '/api/arbitrage/health' },
      { service: 'Payment System', endpoint: '/api/payment/health' },
      { service: 'AI Engine', endpoint: '/api/ai/health' },
      { service: 'Web Automation', endpoint: '/api/web/health' },
      { service: 'Voice Interface', endpoint: '/api/voice/health' },
    ];

    const results: HealthStatus[] = [];

    for (const { service, endpoint } of endpoints) {
      try {
        const response = await fetch(endpoint);
        results.push({
          service,
          endpoint,
          status: response.ok ? 'healthy' : 'degraded',
          lastChecked: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        results.push({
          service,
          endpoint,
          status: 'down',
          lastChecked: new Date().toLocaleTimeString(),
        });
      }
    }

    setHealthStatuses(results);
    setLoading(false);
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/arbitrage/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          minProfitMargin: data.minMargin || 20,
          maxProductPrice: data.maxPrice || 500,
          riskTolerance: data.riskTolerance || 35,
          autoListEnabled: data.autoListEnabled || false,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/arbitrage/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minMargin: settings.minProfitMargin,
          maxPrice: settings.maxProductPrice,
          riskTolerance: settings.riskTolerance,
          autoListEnabled: settings.autoListEnabled,
        }),
      });

      if (response.ok) {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('An error occurred');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Check size={20} className="text-emerald-400" />;
      case 'degraded':
        return <AlertCircle size={20} className="text-yellow-400" />;
      case 'down':
        return <X size={20} className="text-red-400" />;
      default:
        return <AlertCircle size={20} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'degraded':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'down':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your system configuration</p>
        </div>

        <button
          onClick={checkAllHealth}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all flex items-center gap-2 border border-emerald-500/20"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Check Health
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-xl ${
          saveMessage.includes('success')
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* System Health */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Server size={20} />
          System Health
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {healthStatuses.map((health) => (
            <div
              key={health.service}
              className={`p-4 rounded-xl border ${getStatusColor(health.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{health.service}</span>
                {getStatusIcon(health.status)}
              </div>
              <div className="text-xs text-slate-400">{health.endpoint}</div>
              {health.lastChecked && (
                <div className="text-xs text-slate-500 mt-1">
                  Checked: {health.lastChecked}
                </div>
              )}
            </div>
          ))}
        </div>

        {healthStatuses.length === 0 && !loading && (
          <div className="text-center py-12">
            <Database size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Click "Check Health" to run diagnostics</p>
          </div>
        )}
      </div>

      {/* Arbitrage Settings */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <SettingsIcon size={20} />
          Arbitrage Configuration
        </h3>

        <div className="space-y-6">
          {/* Min Profit Margin */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Minimum Profit Margin: {settings.minProfitMargin}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.minProfitMargin}
              onChange={(e) => setSettings({ ...settings, minProfitMargin: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Max Product Price */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Maximum Product Price: ${settings.maxProductPrice}
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={settings.maxProductPrice}
              onChange={(e) => setSettings({ ...settings, maxProductPrice: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>$100</span>
              <span>$1000</span>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Risk Tolerance: {settings.riskTolerance}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.riskTolerance}
              onChange={(e) => setSettings({ ...settings, riskTolerance: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Auto-List Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div>
              <div className="text-white font-medium">Auto-List Opportunities</div>
              <div className="text-sm text-slate-400">Automatically list profitable products</div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoListEnabled: !settings.autoListEnabled })}
              className={`relative w-12 h-6 rounded-full transition-all ${
                settings.autoListEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.autoListEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Zap size={20} />
          API Configuration
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div>
              <div className="text-white font-medium">Google Ads API</div>
              <div className="text-xs text-slate-400">Campaign management</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div>
              <div className="text-white font-medium">Stripe Payments</div>
              <div className="text-xs text-slate-400">Payment processing</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div>
              <div className="text-white font-medium">Cloudinary</div>
              <div className="text-xs text-slate-400">Image management</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div>
              <div className="text-white font-medium">Gemini AI</div>
              <div className="text-xs text-slate-400">AI-powered insights</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm border border-yellow-500/20">
              Check Config
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
