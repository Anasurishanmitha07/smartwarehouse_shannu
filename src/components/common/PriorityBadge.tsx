import React from 'react';
import { OrderPriority } from '../../types';

interface PriorityBadgeProps {
  priority: OrderPriority;
  score?: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, score }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/15 text-red-400 border-red-500/30 font-bold animate-pulse';
      case 'High':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30 font-semibold';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {priority.toUpperCase()} {score !== undefined && `(${score})`}
    </span>
  );
};
