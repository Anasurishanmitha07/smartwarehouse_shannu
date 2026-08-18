import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { ExplainableDecisionCard } from '../common/ExplainableDecisionCard';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { GitPullRequest, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AllocationCenterPage: React.FC = () => {
  const { conflicts, approveAllocation, overrideAllocation } = useAppData();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Inventory Allocation Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated conflict resolution engine for competing order inventory demand.
            </p>
          </div>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-6">
        {conflicts.map((conflict) => {
          const isApproved = conflict.status === 'Approved';

          return (
            <div
              key={conflict.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
            >
              {/* Conflict Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      {conflict.id}
                    </span>
                    <h3 className="text-base font-bold text-white">{conflict.productName}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Available Stock Pool: <strong className="text-amber-400">{conflict.totalAvailable} units</strong> | Total Demanded: <strong className="text-red-400">15 units</strong>
                  </p>
                </div>

                <StatusBadge status={conflict.status} />
              </div>

              {/* Contention Visualizer Grid: Competing Orders */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Competing Demand Orders
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conflict.demandingOrders.map((ord, idx) => (
                    <div
                      key={ord.orderId}
                      className={`p-4 rounded-xl border space-y-3 ${
                        idx === 0
                          ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                          : 'bg-slate-950/60 border-slate-800 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-xs">{ord.orderId}</span>
                        <PriorityBadge priority={ord.priority} score={ord.priorityScore} />
                      </div>
                      <div className="text-xs text-slate-300">
                        <div>Customer: <strong>{ord.customerName}</strong></div>
                        <div className="text-slate-400">Deadline: {ord.dispatchDeadline}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Requested Qty:</span>
                        <span className="font-bold text-amber-400">{ord.requestedQty} units</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold pt-1">
                        <span className="text-slate-400">AI Recommended Allocation:</span>
                        <span className={idx === 0 ? 'text-emerald-400 text-sm' : 'text-slate-500'}>
                          {conflict.recommendedDecision.orderAllocations[ord.orderId] ?? 0} units
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainable Decision Card */}
              <ExplainableDecisionCard
                problem={`Only ${conflict.totalAvailable} units available for two competing orders demanding 15 units total.`}
                dataConsidered="Order priority scores (94 vs 62), SLA dispatch deadlines, and customer tier agreements."
                decision="Prioritize Order #1042 with 7 units allocation; 0 units to Order #1047."
                reasoning={conflict.recommendedDecision.explanation}
                recommendedAction="Approve AI Allocation & update inventory reservations."
                expectedImpact={conflict.recommendedDecision.impact}
                onApprove={() => approveAllocation(conflict.id)}
                onOverride={() => overrideAllocation(conflict.id, { 'ORD-1042': 4, 'ORD-1047': 3 })}
                approvedText="Approve Allocation Decision"
                status={conflict.status}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
