import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { ExplainableDecisionCard } from '../common/ExplainableDecisionCard';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ExceptionsPage: React.FC = () => {
  const { exceptions, resolveException } = useAppData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Exception Management Center</h2>
          <p className="text-xs text-slate-400">
            End-to-end exception resolution workflow: Exception → Analyze → Decision → Resolution → Close.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {exceptions.map((ex) => (
          <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-400 text-xs px-2.5 py-0.5 rounded bg-red-500/20 border border-red-500/30">
                    {ex.id}
                  </span>
                  <h3 className="text-base font-bold text-white">{ex.type}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Order: <strong className="text-white font-mono">{ex.orderId}</strong> | Detected At: {ex.detectedTime}
                </p>
              </div>

              <StatusBadge status={ex.status} />
            </div>

            {/* Workflow Step Indicator */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
              <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300">
                1. Exception Detected
              </div>
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-300">
                2. AI Root Cause Analysis
              </div>
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300">
                3. Decision Generated
              </div>
              <div
                className={`p-2 rounded-lg border ${
                  ex.status === 'Resolved'
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                4. Resolution Executed
              </div>
            </div>

            <ExplainableDecisionCard
              problem={ex.problemDescription}
              dataConsidered={ex.dataConsidered}
              decision={ex.aiDecision}
              reasoning={ex.reasoning}
              recommendedAction={ex.suggestedAction}
              expectedImpact={ex.expectedImpact}
              onApprove={() => resolveException(ex.id)}
              approvedText="Resolve & Close Exception"
              status={ex.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
