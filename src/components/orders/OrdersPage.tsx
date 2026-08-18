import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Order, OrderPriority, OrderStatus } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Search, Filter, Clock, Eye, AlertCircle, ArrowUpRight } from 'lucide-react';

interface OrdersPageProps {
  onSelectOrder: (orderId: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onSelectOrder }) => {
  const { orders, addOrder, products } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // New order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerTier, setCustomerTier] = useState<'Enterprise' | 'VIP' | 'Standard'>('Enterprise');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'PROD-001');
  const [orderQty, setOrderQty] = useState(5);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    const itemTotal = prod.unitPrice * orderQty;

    // AI Priority Scoring logic for newly input order
    const isEnterprise = customerTier === 'Enterprise';
    const isVip = customerTier === 'VIP';
    const deadlineScore = 40; // Default urgent deadline input
    const tierScore = isEnterprise ? 25 : isVip ? 15 : 5;
    const valueScore = Math.min(15, Math.floor(itemTotal / 50));
    const ageScore = 10;
    const readinessScore = prod.availableQuantity >= orderQty ? 10 : 0;
    const priorityScore = Math.min(100, deadlineScore + tierScore + valueScore + ageScore + readinessScore);

    const priorityCat = priorityScore >= 90 ? 'Critical' : priorityScore >= 70 ? 'High' : priorityScore >= 40 ? 'Medium' : 'Low';

    const newOrd: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerTier,
      items: [
        {
          productId: prod.id,
          sku: prod.sku,
          productName: prod.name,
          quantityRequested: Number(orderQty),
          quantityAllocated: Math.min(prod.availableQuantity, Number(orderQty)),
          unitPrice: prod.unitPrice,
        },
      ],
      totalValue: itemTotal,
      createdTime: new Date().toISOString(),
      dispatchDeadline: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
      priority: priorityCat,
      priorityScore,
      priorityReasons: [
        `Dispatch deadline in 2 hours (Urgency Score: +${deadlineScore})`,
        `${customerTier} Customer Tier SLA Agreement (+${tierScore})`,
        `Order total value $${itemTotal.toFixed(2)} (+${valueScore})`,
      ],
      priorityBreakdown: {
        deadlineUrgencyScore: deadlineScore,
        slaRiskScore: tierScore,
        customerTierScore: tierScore,
        inventoryReadinessScore: readinessScore,
        orderAgeScore: ageScore,
      },
      status: prod.availableQuantity >= orderQty ? 'Allocated' : 'Pending Allocation',
      riskLevel: priorityScore >= 90 ? 'High Risk' : 'On Track',
      allocatedZone: 'Zone A',
    };

    addOrder(newOrd);
    setShowOrderModal(false);
    setCustomerName('');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'All' || o.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Smart Order Management & Prioritization</h2>
          <p className="text-xs text-slate-400">
            Explainable AI priority scoring engine. User/admin order inputs are stored persistently.
          </p>
        </div>
        <button
          onClick={() => setShowOrderModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-600/30"
        >
          + Create New Order
        </button>
      </div>

      {/* Create Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Input New Fulfillment Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Customer Name / Enterprise Account</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Global Logistics"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Customer SLA Tier</label>
                  <select
                    value={customerTier}
                    onChange={(e) => setCustomerTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 focus:outline-none mt-1"
                  >
                    <option value="Enterprise">Enterprise (+25 SLA)</option>
                    <option value="VIP">VIP (+15 SLA)</option>
                    <option value="Standard">Standard (+5 SLA)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Select Product Item</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none mt-1"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.availableQuantity} avail)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-medium">Quantity Requested</label>
                <input
                  type="number"
                  min="1"
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 mt-1"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition shadow-lg shadow-cyan-600/30"
                >
                  Save Order & Run AI Priority Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">Priority: All</option>
            <option value="Critical">Critical (90-100)</option>
            <option value="High">High (70-89)</option>
            <option value="Medium">Medium (40-69)</option>
            <option value="Low">Low (0-39)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Pending Allocation">Pending Allocation</option>
            <option value="Allocated">Allocated</option>
            <option value="Picking">Picking</option>
            <option value="Packed">Packed</option>
            <option value="Quality Check">Quality Check</option>
            <option value="Ready for Dispatch">Ready for Dispatch</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Order ID & Customer</th>
                <th className="p-3.5">Items & Value</th>
                <th className="p-3.5 text-center">AI Priority Score</th>
                <th className="p-3.5">Dispatch Deadline</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">SLA Risk</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white font-mono flex items-center gap-2">
                      {o.id}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {o.customerTier}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-0.5">{o.customerName}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-200">
                      {o.items.map((it) => `${it.productName} (${it.quantityRequested})`).join(', ')}
                    </div>
                    <div className="text-slate-500 font-semibold text-[11px] mt-0.5">
                      Total: ${o.totalValue.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <PriorityBadge priority={o.priority} score={o.priorityScore} />
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(o.dispatchDeadline).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`font-semibold text-xs ${
                        o.riskLevel === 'High Risk'
                          ? 'text-red-400 animate-pulse'
                          : o.riskLevel === 'Medium Risk'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {o.riskLevel}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onSelectOrder(o.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
