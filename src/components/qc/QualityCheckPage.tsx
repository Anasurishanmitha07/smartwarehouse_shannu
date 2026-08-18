import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CheckSquare, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const QualityCheckPage: React.FC = () => {
  const { orders, exceptions } = useAppData();
  const qcOrders = orders.filter((o) => o.status === 'Quality Check' || o.status === 'Packed');

  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({
    'ORD-1031': {
      correctProduct: true,
      correctQuantity: false, // Triggers Quantity Mismatch EX-1042!
      packagingCondition: true,
      itemCondition: true,
      labelVerified: true,
    },
  });

  const toggleCheck = (orderId: string, itemKey: string) => {
    setChecklist((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {
          correctProduct: true,
          correctQuantity: true,
          packagingCondition: true,
          itemCondition: true,
          labelVerified: true,
        }),
        [itemKey]: !prev[orderId]?.[itemKey],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Quality Inspection Station & Auto-Exception Trigger</h2>
        <p className="text-xs text-slate-400">
          5-point automated QC verification protocol with instant exception dispatch logic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {qcOrders.map((o) => {
          const checks = checklist[o.id] || {
            correctProduct: true,
            correctQuantity: true,
            packagingCondition: true,
            itemCondition: true,
            labelVerified: true,
          };

          const hasFailure = Object.values(checks).some((v) => v === false);

          return (
            <div
              key={o.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 ${
                hasFailure ? 'border-red-500/40 shadow-red-500/5' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="font-mono font-bold text-white text-sm">{o.id}</div>
                  <div className="text-xs text-slate-400">{o.customerName}</div>
                </div>
                <StatusBadge status={hasFailure ? 'Failed QC' : o.status} />
              </div>

              {/* 5-Point Checklist */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  5-Point QC Validation Protocol
                </div>

                {[
                  { key: 'correctProduct', label: '✓ Correct Product SKU' },
                  { key: 'correctQuantity', label: '✓ Correct Quantity' },
                  { key: 'packagingCondition', label: '✓ Packaging Condition Intact' },
                  { key: 'itemCondition', label: '✓ Item Cosmetic Condition Clean' },
                  { key: 'labelVerified', label: '✓ Dispatch Barcode Label Verified' },
                ].map((chk) => {
                  const isChecked = checks[chk.key as keyof typeof checks];
                  return (
                    <button
                      key={chk.key}
                      onClick={() => toggleCheck(o.id, chk.key)}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
                          : 'bg-red-950/30 border-red-800/60 text-red-300 font-semibold'
                      }`}
                    >
                      <span>{chk.label}</span>
                      <span className="font-bold text-xs">{isChecked ? 'PASS' : 'FAIL'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Auto Exception Banner if failed */}
              {hasFailure && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4" /> AUTO EXCEPTION GENERATED: EX-1042
                  </div>
                  <p className="text-slate-300">
                    Quantity mismatch detected: Expected 10 units, Found 9 units. AI engine has automatically dispatched a runner to Zone C Bin C-14.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
