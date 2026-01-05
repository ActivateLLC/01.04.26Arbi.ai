import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, CreditCard, Download, Settings as SettingsIcon } from 'lucide-react';

interface PayoutHistory {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  bankAccount: string;
}

interface WalletStats {
  availableBalance: number;
  totalEarnings: number;
  pendingPayouts: number;
  lifetimeEarnings: number;
}

export const Wallet: React.FC = () => {
  const [stats, setStats] = useState<WalletStats>({
    availableBalance: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    lifetimeEarnings: 0,
  });
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('****1234');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Fetch payout history
      const historyResponse = await fetch('/api/payout/history');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setPayoutHistory(historyData.payouts || []);
      }

      // Calculate stats from marketplace orders
      const ordersResponse = await fetch('/api/marketplace/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const totalRevenue = ordersData.totalRevenue || 0;
        const totalProfit = ordersData.totalProfit || 0;
        const userCut = totalProfit * 0.75; // User gets 75%

        setStats({
          availableBalance: userCut,
          totalEarnings: userCut,
          pendingPayouts: 0,
          lifetimeEarnings: userCut,
        });
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Please enter a valid payout amount');
      return;
    }

    try {
      const response = await fetch('/api/payout/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(payoutAmount),
          bankAccount: bankAccount,
        }),
      });

      if (response.ok) {
        alert('Payout request submitted successfully!');
        setPayoutAmount('');
        fetchWalletData();
      } else {
        alert('Failed to process payout request');
      }
    } catch (error) {
      console.error('Payout error:', error);
      alert('An error occurred while processing payout');
    }
  };

  const toggleAutoPayout = async () => {
    try {
      const response = await fetch('/api/payout/auto-enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !autoPayoutEnabled }),
      });

      if (response.ok) {
        setAutoPayoutEnabled(!autoPayoutEnabled);
      }
    } catch (error) {
      console.error('Auto-payout toggle error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-slate-400">Manage your earnings and payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign size={24} />}
          label="Available Balance"
          value={`$${stats.availableBalance.toFixed(2)}`}
          color="emerald"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          color="blue"
        />
        <StatCard
          icon={<ArrowUpRight size={24} />}
          label="Pending Payouts"
          value={`$${stats.pendingPayouts.toFixed(2)}`}
          color="yellow"
        />
        <StatCard
          icon={<CreditCard size={24} />}
          label="Lifetime Earnings"
          value={`$${stats.lifetimeEarnings.toFixed(2)}`}
          color="purple"
        />
      </div>

      {/* Payout Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Request Payout */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Download size={20} />
            Request Payout
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Available: ${stats.availableBalance.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Bank Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handlePayout}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all"
            >
              Request Payout
            </button>
          </div>
        </div>

        {/* Auto Payout Settings */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <SettingsIcon size={20} />
            Payout Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div>
                <div className="text-white font-medium">Auto-Payout</div>
                <div className="text-sm text-slate-400">Automatically withdraw earnings</div>
              </div>
              <button
                onClick={toggleAutoPayout}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  autoPayoutEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoPayoutEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-sm text-blue-400">
                💡 Enable auto-payout to automatically transfer your earnings weekly
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Payout Frequency</span>
                <span className="text-white">Weekly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Minimum Payout</span>
                <span className="text-white">$50.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processing Time</span>
                <span className="text-white">2-3 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Payout History</h3>

        {payoutHistory.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No payout history yet</p>
            <p className="text-slate-500 text-sm mt-2">Your payout requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payoutHistory.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <ArrowUpRight size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">${payout.amount.toFixed(2)}</div>
                    <div className="text-sm text-slate-400">{payout.bankAccount}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(payout.status)}`}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </div>
                  <div className="text-xs text-slate-500">{payout.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'emerald' | 'blue' | 'yellow' | 'purple';
}> = ({ icon, label, value, color }) => {
  const colorMap = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    yellow: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-4 border`}>
        {icon}
      </div>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
    </div>
  );
};
