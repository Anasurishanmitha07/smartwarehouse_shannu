import React from 'react';
import { Product } from '../../types';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

interface SmartReorderModalProps {
  product: Product;
  onClose: () => void;
}

export const SmartReorderModal: React.FC<SmartReorderModalProps> = ({ product, onClose }) => {
  const { createPurchaseOrder } = useAppData();

  const dailyDemand = product.averageDailyDemand;
  const leadTime = product.leadTimeDays;
  const safetyStock = product.safetyStock;

  const leadTimeRequirement = dailyDemand * leadTime;
  const totalRequirement = leadTimeRequirement + safetyStock;
  const recommendedQty = Math.max(50, totalRequirement - product.availableQuantity);

  const handleOrder = () => {
    createPurchaseOrder('REORD-001');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Smart Reorder Engine Calculation</h3>
              <p className="text-xs text-slate-400">Explainable replenishment recommendation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details Header */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <div className="font-bold text-white">{product.name}</div>
            <div className="text-slate-400">SKU: {product.sku} | Location: {product.location}</div>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-semibold rounded-md">
            REORDER RECOMMENDED
          </span>
        </div>

        {/* Formula breakdown */}
        <div className="space-y-2 text-xs">
          <div className="text-slate-300 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Automated Requirement Formula:
          </div>
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>Current Stock:</span>
              <span className="text-amber-400 font-bold">{product.availableQuantity} units</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Daily Demand ({dailyDemand} units/day × {leadTime} days lead time):</span>
              <span>{leadTimeRequirement} units</span>
            </div>
            <div className="flex justify-between">
              <span>Safety Stock Buffer:</span>
              <span>{safetyStock} units</span>
            </div>
            <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-cyan-300">
              <span>Recommended Reorder Quantity:</span>
              <span className="text-emerald-400 text-sm">{recommendedQty} units</span>
            </div>
          </div>
        </div>

        {/* Decision & Action */}
        <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-xl text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-cyan-400">Rationale:</div>
          <p>
            Placing an order of {recommendedQty} units ensures zero stockout during supplier lead time ({leadTime} days) while maintaining {safetyStock} units of safety buffer.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Ignore Recommendation
          </button>
          <button
            onClick={handleOrder}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            Create Purchase Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};
