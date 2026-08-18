import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ArrowLeft, CheckCircle2, Clock, ShieldAlert, Cpu, Sparkles, UserCheck } from 'lucide-react';

interface OrderDetailPageProps {
  orderId: string;
  onBack: () => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orderId, onBack }) => {
  const { orders } = useAppData();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const timelineSteps = [
    'Created',
    'Priority Determined',
    'Inventory Checked',
    'Allocated',
    'Picking',
    'Packed',
    'Quality Check',
    'Ready for Dispatch',
  ];

  const getStepStatus = (stepIndex: number) => {
    // Determine current progress index based on order status
    const statusMap: Record<string, number> = {
      Created: 0,
      'Pending Allocation': 2,
      'Partially Allocated': 3,
      Allocated: 3,
      Picking: 4,
      Packed: 5,
      'Quality Check': 6,
      'Ready for Dispatch': 7,
      Dispatched: 8,
    };
    const currentIdx = statusMap[order.status] ?? 2;
    if (stepIndex < currentIdx) return 'completed';
    if (stepIndex === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white font-mono">{order.id}</h2>
              <PriorityBadge priority={order.priority} score={order.priorityScore} />
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customer: <strong className="text-slate-200">{order.customerName}</strong> ({order.customerTier} Tier)
            </p>
          </div>

          <div className="text-right text-xs">
            <div className="text-slate-400">Dispatch Deadline</div>
            <div className="text-amber-400 font-mono font-bold text-sm mt-0.5">
              {new Date(order.dispatchDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Visual Order Timeline Bar */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Smart Operations Fulfillment Timeline
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {timelineSteps.map((step, idx) => {
              const state = getStepStatus(idx);
              return (
                <div
                  key={step}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium transition ${
                    state === 'completed'
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400'
                      : state === 'current'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold animate-pulse'
                      : 'bg-slate-950/50 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-[10px] opacity-70">Step {idx + 1}</div>
                  <div className="truncate mt-0.5">{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Line Items & Priority Explainability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Line items */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-semibold text-white">Order Line Items</h3>
          <div className="divide-y divide-slate-800">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{item.productName}</div>
                  <div className="text-slate-400 font-mono">SKU: {item.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 font-medium">
                    Requested: <strong>{item.quantityRequested}</strong> | Allocated: <strong>{item.quantityAllocated}</strong>
                  </div>
                  <div className="text-cyan-400 font-mono font-semibold mt-0.5">
                    ${(item.unitPrice * item.quantityRequested).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-3 flex justify-between text-xs font-bold text-white">
            <span>Total Order Value:</span>
            <span className="text-cyan-400 font-mono text-sm">${order.totalValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Right: Explainable Priority Reasons */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">AI Priority Scoring Trace</h3>
          </div>
          <p className="text-xs text-slate-400">
            Priority score evaluated to <strong className="text-cyan-300">{order.priorityScore}/100</strong>.
          </p>

          <div className="space-y-2">
            {order.priorityReasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
