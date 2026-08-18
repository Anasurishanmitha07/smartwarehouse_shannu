import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'product' | 'order' | 'exception' | 'conflict';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'Healthy':
      case 'Allocated':
      case 'Dispatched':
      case 'Completed':
      case 'Resolved':
      case 'Approved':
      case 'Picked':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

      case 'Low Stock':
      case 'Picking':
      case 'Packing':
      case 'Analyzing':
      case 'Partially Allocated':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

      case 'Critical':
      case 'Out of Stock':
      case 'Damaged':
      case 'Delayed':
      case 'Missing Item':
      case 'Damaged Item':
      case 'Quantity Mismatch':
        return 'bg-red-500/10 text-red-400 border-red-500/20';

      case 'Pending Allocation':
      case 'Pending Review':
      case 'Created':
      case 'Quality Check':
      case 'Ready for Dispatch':
      case 'Open':
      case 'Pending':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getColors()}`}
    >
      {status}
    </span>
  );
};
