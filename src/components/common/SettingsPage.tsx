import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Settings, ShieldCheck, Database, RefreshCw, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { userRole, setUserRole, resetToDemoData } = useAppData();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white">System Settings & Input Storage</h2>
        <p className="text-xs text-slate-400">Configure decision engine thresholds and manage persistent data storage.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Role Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Active Role Capabilities Matrix
          </h3>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Current Role:</span>
              <span className="font-bold text-cyan-400">{userRole}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 bg-slate-900 rounded-lg">
                <div className="font-bold text-white">Manager</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Full Override & Approve</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <div className="font-bold text-white">Operator</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Picking & QC Only</div>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <div className="font-bold text-white">Admin</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">Full System Config</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Persistence Control */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> Persistent Storage Status
          </h3>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-emerald-400">✓ Browser Local Storage Engine Active</div>
              <div className="text-slate-400 mt-0.5">
                All custom products, new orders, allocation approvals, exceptions, and audit logs are saved automatically.
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all custom inputs and restore original demo dataset?')) {
                  resetToDemoData();
                }
              }}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 rounded-xl font-semibold transition shrink-0"
            >
              Reset to Demo Defaults
            </button>
          </div>
        </div>

        {/* AI Thresholds */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white">AI Decision Engine Threshold Sensitivity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400">Critical Priority Cutoff Score</div>
              <div className="text-lg font-bold text-red-400 mt-1">90 / 100</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400">Picking Bottleneck Tolerance</div>
              <div className="text-lg font-bold text-amber-400 mt-1">+30% above baseline</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
