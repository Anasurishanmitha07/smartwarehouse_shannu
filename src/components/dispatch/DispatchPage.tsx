import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Truck, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const DispatchPage: React.FC = () => {
  const { orders } = useAppData();
  const dispatchReadyOrders = orders.filter(
    (o) => o.status === 'Ready for Dispatch' || o.status === 'Packed' || o.status === 'Dispatched'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Dispatch Control Center</h2>
          <p className="text-xs text-slate-400">
            Carrier assignment, manifest generation, and SLA deadline countdown tracking.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Carrier</th>
                <th className="p-3.5">Dispatch Deadline</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dispatchReadyOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-mono font-bold text-white">{o.id}</td>
                  <td className="p-3.5">{o.customerName}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-cyan-300">FedEx Express Priority</span>
                  </td>
                  <td className="p-3.5 font-mono text-amber-300">
                    {new Date(o.dispatchDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition">
                      <Truck className="w-3.5 h-3.5" /> Dispatch Package
                    </button>
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
