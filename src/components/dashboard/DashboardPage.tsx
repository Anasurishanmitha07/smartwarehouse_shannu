import React from 'react';
import {
  ShoppingCart,
  Clock,
  AlertTriangle,
  Package,
  ShieldAlert,
  Truck,
  TrendingUp,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { ExplainableDecisionCard } from '../common/ExplainableDecisionCard';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    orders,
    products,
    conflicts,
    bottlenecks,
    exceptions,
    approveAllocation,
    optimizePickingRoute,
  } = useAppData();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'Pending Allocation' || o.status === 'Created'
  ).length;
  const criticalOrders = orders.filter((o) => o.priority === 'Critical').length;
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;
  const beingPickedCount = orders.filter((o) => o.status === 'Picking').length;
  const readyDispatchCount = orders.filter((o) => o.status === 'Ready for Dispatch').length;

  const activeConflict = conflicts.find((c) => c.status === 'Pending Review');
  const activeBottleneck = bottlenecks.find((b) => b.averagePickTimeMin > b.warehouseAverageMin * 1.3);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Executive Warehouse AI Operations Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated fulfillment monitoring, smart inventory allocation, and exception resolution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('allocation')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-red-600/30 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            Resolve Allocation Conflict ({conflicts.filter((c) => c.status === 'Pending Review').length})
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Active Orders</div>
            <div className="text-2xl font-bold text-white mt-1">{totalOrders}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.4% vs yesterday
            </div>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Critical SLA Risk Orders</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{criticalOrders}</div>
            <div className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
              Requires immediate allocation
            </div>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Low & Out-of-Stock SKUs</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {lowStockCount + outOfStockCount}
            </div>
            <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
              {outOfStockCount} Out of stock, {lowStockCount} Low stock
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Ready for Dispatch</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{readyDispatchCount}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
              100% Quality checked
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operational Health Metrics Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Operational Health Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center divide-x divide-slate-800">
          <div className="px-2">
            <div className="text-xs text-slate-400">Fulfillment Rate</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">96.2%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[96.2%]"></div>
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400">Avg Picking Time</div>
            <div className="text-lg font-bold text-amber-400 mt-1">11.8 min</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full w-[70%]"></div>
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400">Avg Packing Time</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">4.2 min</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%]"></div>
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400">Order Delay Rate</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">1.8%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-500 h-full w-[15%]"></div>
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400">Inventory Accuracy</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">99.4%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[99%]"></div>
            </div>
          </div>
          <div className="px-2">
            <div className="text-xs text-slate-400">Active Exceptions</div>
            <div className="text-lg font-bold text-red-400 mt-1">
              {exceptions.filter((e) => e.status === 'Open').length}
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-red-500 h-full w-[35%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Operations Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Operations Center</h3>
              <p className="text-xs text-slate-400">
                Automated exception detection, explanation, and resolution recommendations
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-semibold">
            3 Active Operational Alerts
          </span>
        </div>

        {/* Alert 1: Inventory Conflict (CRITICAL) */}
        {activeConflict && (
          <ExplainableDecisionCard
            problem="CRITICAL: 3 orders are at risk of missing dispatch deadlines due to Wireless Optical Mouse stock shortage (7 units available vs 15 requested)."
            dataConsidered="Order #1042 (Priority Score 94, Deadline 11:45 AM) vs Order #1047 (Priority Score 62, Deadline 04:00 PM)."
            decision="Prioritize Order #1042. Allocate 7 available units to Order #1042 and defer Order #1047."
            reasoning="Order #1042 has higher priority score and imminent dispatch deadline. Prevents $5,000 Enterprise customer SLA breach penalty."
            recommendedAction="Approve Allocation Decision to reserve stock and update order status."
            expectedImpact="Protects critical delivery SLA. Zero impact on Order #1047 target delivery window."
            onApprove={() => approveAllocation(activeConflict.id)}
            onOverride={() => onNavigate('allocation')}
            approvedText="Approve Allocation Decision"
            status={activeConflict.status}
          />
        )}

        {/* Alert 2: Zone B Bottleneck (WARNING) */}
        {activeBottleneck && (
          <ExplainableDecisionCard
            problem="BOTTLENECK DETECTED: Picking Zone B average picking time is 18.4 min (65% slower than warehouse baseline)."
            dataConsidered="Zone B picker speeds, aisle congestion metrics, 32 delayed orders."
            decision="Optimize aisle travel sequence and reassign 2 pickers from Zone A to Zone B."
            reasoning="Re-sequencing item locations reduces walking distance by 40% (18.5 min -> 11.2 min)."
            recommendedAction="Apply TSP Route Optimization & Worker Re-allocation."
            expectedImpact="Clears 32 delayed orders and lowers Zone B pick time to 11.2 min."
            onApprove={() => optimizePickingRoute('PICK-101')}
            onOverride={() => onNavigate('picking')}
            approvedText="Apply Route Optimization"
          />
        )}
      </div>
    </div>
  );
};
