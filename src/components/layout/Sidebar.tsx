import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  GitPullRequest,
  CheckSquare,
  PackageCheck,
  ShieldAlert,
  BarChart3,
  Bot,
  History,
  Settings,
  Truck,
  Layers,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { conflicts, exceptions } = useAppData();

  const openConflicts = conflicts.filter((c) => c.status === 'Pending Review').length;
  const openExceptions = exceptions.filter((e) => e.status === 'Open').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    {
      id: 'allocation',
      label: 'Allocation Center',
      icon: GitPullRequest,
      badge: openConflicts > 0 ? openConflicts : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    { id: 'picking', label: 'Picking Route', icon: Layers },
    { id: 'packing', label: 'Packing Station', icon: PackageCheck },
    { id: 'qc', label: 'Quality Check', icon: CheckSquare },
    { id: 'dispatch', label: 'Dispatch Control', icon: Truck },
    {
      id: 'exceptions',
      label: 'Exception Center',
      icon: ShieldAlert,
      badge: openExceptions > 0 ? openExceptions : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    { id: 'analytics', label: 'Operational Analytics', icon: BarChart3 },
    { id: 'assistant', label: 'WareSmart Assistant', icon: Bot },
    { id: 'audit', label: 'Audit Ledger', icon: History },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] overflow-y-auto">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Main Navigation
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/5 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>Engine Status:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Decision Engine:</span>
          <span className="text-cyan-400 font-mono">v3.4 ML-Rule</span>
        </div>
      </div>
    </aside>
  );
};
