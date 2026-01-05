import React, { useState } from 'react';
import { Bell, TrendingUp, AlertTriangle, Info, CheckCircle, X, Package, DollarSign } from 'lucide-react';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'order' | 'opportunity' | 'payout' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'success',
      category: 'order',
      title: 'New Order Received',
      message: 'Nintendo Switch OLED sold for $379.99',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      category: 'opportunity',
      title: 'New Opportunity Found',
      message: 'High-margin product detected: PlayStation 5 Digital (28% margin)',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      category: 'system',
      title: 'Low Stock Alert',
      message: 'Supplier 1 for "Gaming Headset" is out of stock. Switched to backup supplier.',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: '4',
      type: 'success',
      category: 'payout',
      title: 'Payout Completed',
      message: '$1,250.00 transferred to your bank account',
      timestamp: '3 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'info',
      category: 'opportunity',
      title: '5 New Opportunities',
      message: 'Found 5 new profitable products in the last hour',
      timestamp: '5 hours ago',
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'order':
        return <Package size={20} />;
      case 'opportunity':
        return <TrendingUp size={20} />;
      case 'payout':
        return <DollarSign size={20} />;
      case 'system':
        return <Info size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'info':
        return <Info size={16} className="text-blue-400" />;
      case 'error':
        return <X size={16} className="text-red-400" />;
      default:
        return <Bell size={16} className="text-slate-400" />;
    }
  };

  const filteredAlerts = filter === 'unread'
    ? alerts.filter(alert => !alert.read)
    : alerts;

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all border border-emerald-500/20"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'unread'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <Bell size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No notifications</p>
            <p className="text-slate-500 text-sm mt-2">You're all caught up!</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-slate-900/50 backdrop-blur-md border rounded-2xl p-4 transition-all hover:border-white/20 ${
                alert.read ? 'border-white/5 opacity-60' : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${getTypeColor(alert.type)}`}>
                  {getIcon(alert.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-white font-semibold">{alert.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getTypeIcon(alert.type)}
                      {!alert.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-2">{alert.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{alert.timestamp}</span>

                    <div className="flex gap-2">
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Notification Settings</h3>

        <div className="space-y-3">
          <NotificationToggle
            label="New Orders"
            description="Get notified when someone purchases a product"
            enabled={true}
          />
          <NotificationToggle
            label="New Opportunities"
            description="Alert me when high-margin products are found"
            enabled={true}
          />
          <NotificationToggle
            label="Payout Updates"
            description="Notifications about payout status changes"
            enabled={true}
          />
          <NotificationToggle
            label="System Alerts"
            description="Important system updates and warnings"
            enabled={true}
          />
          <NotificationToggle
            label="Low Stock Warnings"
            description="Alert when suppliers run out of stock"
            enabled={false}
          />
        </div>
      </div>
    </div>
  );
};

// Notification Toggle Component
const NotificationToggle: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
}> = ({ label, description, enabled }) => {
  const [isEnabled, setIsEnabled] = React.useState(enabled);

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
      <div>
        <div className="text-white font-medium">{label}</div>
        <div className="text-sm text-slate-400">{description}</div>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-12 h-6 rounded-full transition-all ${
          isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            isEnabled ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
};
