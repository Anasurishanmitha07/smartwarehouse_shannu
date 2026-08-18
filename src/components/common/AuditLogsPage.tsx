import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { History, Shield, CheckCircle2 } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useAppData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">System Decision Audit Ledger</h2>
          <p className="text-xs text-slate-400">
            Immutable log of all AI automated actions and human manager overrides.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Audit ID & Time</th>
                <th className="p-3.5">Event</th>
                <th className="p-3.5">Order</th>
                <th className="p-3.5">Decision & Explanation</th>
                <th className="p-3.5">Performed By</th>
                <th className="p-3.5">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-cyan-400">{log.id}</div>
                    <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                  </td>
                  <td className="p-3.5 font-sans font-semibold text-white">{log.event}</td>
                  <td className="p-3.5 text-amber-400">{log.orderId || 'N/A'}</td>
                  <td className="p-3.5 font-sans">
                    <div className="text-slate-200 font-semibold">{log.decision}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{log.reason}</div>
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] border border-cyan-500/20">
                      {log.performedBy}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-emerald-400 font-semibold">
                    {log.approvedBy || 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
