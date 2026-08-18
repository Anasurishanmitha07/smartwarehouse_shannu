import React, { useState } from 'react';
import {
  Bell,
  Bot,
  UserCheck,
  Search,
  Shield,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAssistant }) => {
  const { userRole, setUserRole, notifications, markNotificationRead } = useAppData();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            Smart Warehouse <span className="text-cyan-400">Operations System</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AI Decision Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400">Smart Operations & Order Fulfillment Platform</p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search orders, SKUs, zones..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-medium text-cyan-300 border-none focus:outline-none cursor-pointer"
          >
            <option value="Warehouse Manager" className="bg-slate-900 text-white">
              Warehouse Manager
            </option>
            <option value="Warehouse Operator" className="bg-slate-900 text-white">
              Warehouse Operator
            </option>
            <option value="Admin" className="bg-slate-900 text-white">
              Admin
            </option>
          </select>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onToggleAssistant}
          className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-cyan-600/20"
        >
          <Bot className="w-4 h-4" />
          WareSmart Assistant
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 relative transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" /> System Notifications
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs ${n.read ? 'bg-slate-900/40' : 'bg-cyan-950/20'}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-400 mt-1">{n.message}</p>
                    {!n.read && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="mt-2 text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
