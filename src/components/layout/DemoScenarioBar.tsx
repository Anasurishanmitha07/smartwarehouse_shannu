import React from 'react';
import { Play, Sparkles, AlertTriangle, ShieldCheck, Route, MessageSquare } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const DemoScenarioBar: React.FC = () => {
  const { triggerDemoScenario } = useAppData();

  return (
    <div className="bg-slate-900 border-b border-cyan-500/20 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-cyan-400 font-semibold">
        <Sparkles className="w-4 h-4 animate-pulse text-cyan-300" />
        <span>HACKATHON DEMO SCENARIOS:</span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={() => triggerDemoScenario(1)}
          className="px-3 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 rounded-lg flex items-center gap-1.5 transition font-medium"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          1. Inventory Conflict
        </button>

        <button
          onClick={() => triggerDemoScenario(2)}
          className="px-3 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-300 rounded-lg flex items-center gap-1.5 transition font-medium"
        >
          <Play className="w-3.5 h-3.5" />
          2. Smart Reorder
        </button>

        <button
          onClick={() => triggerDemoScenario(3)}
          className="px-3 py-1 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 rounded-lg flex items-center gap-1.5 transition font-medium"
        >
          <Route className="w-3.5 h-3.5" />
          3. Zone B Bottleneck
        </button>

        <button
          onClick={() => triggerDemoScenario(4)}
          className="px-3 py-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-purple-300 rounded-lg flex items-center gap-1.5 transition font-medium"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          4. QC Exception
        </button>

        <a
          href="#assistant"
          className="px-3 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-300 rounded-lg flex items-center gap-1.5 transition font-medium"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          5. Ask AI Assistant
        </a>
      </div>
    </div>
  );
};
