import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Layers, Route, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PickingPage: React.FC = () => {
  const { pickingTasks, bottlenecks, optimizePickingRoute, reassignWorkersToZone } = useAppData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Picking Operations & Route Optimization</h2>
          <p className="text-xs text-slate-400">
            TSP aisle heuristic route optimization & picking zone bottleneck detection.
          </p>
        </div>
      </div>

      {/* Active Pick List & Optimizer Card */}
      {pickingTasks.map((task) => (
        <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white font-mono">{task.id}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  {task.zone}
                </span>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Order: <strong className="text-white font-mono">{task.orderId}</strong> | Assigned Picker: <strong className="text-slate-200">{task.pickerName}</strong>
              </p>
            </div>

            <button
              onClick={() => optimizePickingRoute(task.id)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-600/30"
            >
              <Route className="w-4 h-4" /> Optimize Route Sequence
            </button>
          </div>

          {/* Route Comparison Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Standard Sequence */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="text-slate-400 font-semibold flex items-center justify-between">
                <span>Standard Unoptimized Route Path:</span>
                <span className="text-red-400 font-mono font-bold">{task.unoptimizedSequence.length * 3.7} min</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap font-mono text-slate-300">
                {task.unoptimizedSequence.map((loc, i) => (
                  <React.Fragment key={i}>
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700">{loc}</span>
                    {i < task.unoptimizedSequence.length - 1 && <span className="text-slate-600">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* AI Optimized Sequence */}
            <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-xl space-y-2">
              <div className="text-cyan-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Optimized Path (TSP Heuristic):
                </span>
                <span className="text-emerald-400 font-mono font-bold">{task.optimizedTimeMin} min (39% Faster)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap font-mono text-emerald-300 font-bold">
                {task.routeSequence.map((loc, i) => (
                  <React.Fragment key={i}>
                    <span className="px-2.5 py-1 rounded bg-cyan-900/40 border border-cyan-500/30">{loc}</span>
                    {i < task.routeSequence.length - 1 && <span className="text-cyan-500">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Pick items list */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Aisle Location Pick List Items
            </h4>
            <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 text-xs">
              {task.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {it.location}
                    </span>
                    <span className="font-semibold text-slate-200">{it.productName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Qty: <strong className="text-white">{it.quantity}</strong></span>
                    <span className={it.picked ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                      {it.picked ? '✓ Picked' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Picking Bottleneck Heatmap & Reallocation Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Picking Zone Bottleneck Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bottlenecks.map((b) => (
            <div
              key={b.zone}
              className={`p-4 rounded-xl border space-y-3 ${
                b.averagePickTimeMin > b.warehouseAverageMin * 1.3
                  ? 'bg-red-950/20 border-red-800/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{b.zone}</span>
                <span className="text-xs text-slate-400">{b.assignedWorkers} Workers</span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Pick Time:</span>
                  <span className={b.averagePickTimeMin > 14 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {b.averagePickTimeMin} min
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Warehouse Avg:</span>
                  <span>{b.warehouseAverageMin} min</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                {b.recommendation}
              </p>

              {b.averagePickTimeMin > 14 && (
                <button
                  onClick={() => reassignWorkersToZone('Zone B', 2)}
                  className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-red-600/20"
                >
                  Reassign 2 Pickers to Zone B
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
