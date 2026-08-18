import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

interface ExplainableDecisionCardProps {
  problem: string;
  dataConsidered: string;
  decision: string;
  reasoning: string;
  recommendedAction: string;
  expectedImpact: string;
  onApprove?: () => void;
  onOverride?: () => void;
  approvedText?: string;
  status?: string;
}

export const ExplainableDecisionCard: React.FC<ExplainableDecisionCardProps> = ({
  problem,
  dataConsidered,
  decision,
  reasoning,
  recommendedAction,
  expectedImpact,
  onApprove,
  onOverride,
  approvedText = 'Approve Decision',
  status,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl transition-all hover:border-cyan-500/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Explainable AI Decision Trace
              {status && (
                <span
                  className={`text-xs font-normal px-2 py-0.5 rounded ${
                    status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {status}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">Rule Engine + ML Optimization Model</p>
          </div>
        </div>
      </div>

      {/* Grid of 6 Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Problem */}
        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" />
            1. PROBLEM DETECTED
          </div>
          <p className="text-slate-300">{problem}</p>
        </div>

        {/* 2. Data Considered */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
            2. DATA CONSIDERED
          </div>
          <p className="text-slate-300">{dataConsidered}</p>
        </div>

        {/* 3. Decision */}
        <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            3. AI DECISION
          </div>
          <p className="text-slate-200 font-medium">{decision}</p>
        </div>

        {/* 4. Reason */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
            4. EXPLAINABLE REASON
          </div>
          <p className="text-slate-300">{reasoning}</p>
        </div>

        {/* 5. Recommended Action */}
        <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <ArrowRight className="w-4 h-4" />
            5. RECOMMENDED ACTION
          </div>
          <p className="text-slate-200">{recommendedAction}</p>
        </div>

        {/* 6. Expected Impact */}
        <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            6. EXPECTED IMPACT
          </div>
          <p className="text-slate-300">{expectedImpact}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {status !== 'Approved' && (onApprove || onOverride) && (
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
          {onOverride && (
            <button
              onClick={onOverride}
              className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Manual Override
            </button>
          )}
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-4 py-1.5 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 transition shadow-lg shadow-cyan-600/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {approvedText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
