import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { PackageCheck, CheckCircle2, Box, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PackingPage: React.FC = () => {
  const { orders } = useAppData();
  const packingOrders = orders.filter(
    (o) => o.status === 'Packed' || o.status === 'Picking' || o.status === 'Quality Check'
  );

  const [packedIds, setPackedIds] = useState<string[]>(['ORD-1035']);

  const handlePack = (id: string) => {
    setPackedIds([...packedIds, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Packing Operations Station</h2>
          <p className="text-xs text-slate-400">
            Order item validation, packaging selection, and dispatch barcode verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packingOrders.map((o) => {
          const isDone = packedIds.includes(o.id);
          return (
            <div key={o.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="font-mono font-bold text-white text-sm">{o.id}</div>
                  <div className="text-xs text-slate-400">{o.customerName}</div>
                </div>
                <StatusBadge status={isDone ? 'Packed' : o.status} />
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold">Packed Line Items:</div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-slate-300">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.productName}</span>
                      <span className="font-bold text-white">x{it.quantityRequested}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-slate-400">Recommended Box: <strong className="text-cyan-300">Size M Anti-Static</strong></span>
                {!isDone ? (
                  <button
                    onClick={() => handlePack(o.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                  >
                    <PackageCheck className="w-4 h-4" /> Confirm Order Packed
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Quality Inspection
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
