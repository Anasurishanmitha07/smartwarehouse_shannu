import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Product, ProductStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SmartReorderModal } from './SmartReorderModal';
import { Search, Filter, RefreshCw, Sparkles, AlertCircle, Edit3, Trash2 } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { products, addProduct } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProductForReorder, setSelectedProductForReorder] = useState<Product | null>(null);

  // New product input modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductCat, setNewProductCat] = useState('Peripherals');
  const [newProductQty, setNewProductQty] = useState(50);
  const [newProductPrice, setNewProductPrice] = useState(49.99);
  const [newProductLocation, setNewProductLocation] = useState('A-20-1');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const statuses = ['All', 'Healthy', 'Low Stock', 'Critical', 'Out of Stock', 'Damaged'];

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductSku.trim()) return;

    const created: Product = {
      id: `PROD-${Date.now().toString().slice(-4)}`,
      sku: newProductSku.toUpperCase(),
      name: newProductName,
      category: newProductCat,
      warehouse: 'Main DC - Boston',
      location: newProductLocation,
      totalQuantity: Number(newProductQty),
      reservedQuantity: 0,
      availableQuantity: Number(newProductQty),
      damagedQuantity: 0,
      reorderLevel: 15,
      safetyStock: 10,
      supplier: 'Custom User Supplier',
      leadTimeDays: 5,
      averageDailyDemand: 8,
      unitPrice: Number(newProductPrice),
      status: Number(newProductQty) > 15 ? 'Healthy' : 'Low Stock',
    };

    addProduct(created);
    setShowAddModal(false);
    setNewProductName('');
    setNewProductSku('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Smart Inventory Management</h2>
          <p className="text-xs text-slate-400">
            Real-time stock tracking with persistent database & local storage entry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-600/30"
          >
            + Add New SKU / Product
          </button>
          <span className="text-xs text-slate-400 font-medium">
            Active SKUs: <strong className="text-white">{products.length}</strong>
          </span>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add New Inventory Product Input</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Ergonomic Trackball"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. TRK-ERG-01"
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={newProductCat}
                    onChange={(e) => setNewProductCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 focus:outline-none mt-1"
                  >
                    <option value="Peripherals">Peripherals</option>
                    <option value="Displays">Displays</option>
                    <option value="Audio">Audio</option>
                    <option value="Components">Components</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Initial Qty</label>
                  <input
                    type="number"
                    value={newProductQty}
                    onChange={(e) => setNewProductQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Bin Location</label>
                  <input
                    type="text"
                    value={newProductLocation}
                    onChange={(e) => setNewProductLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-400 focus:outline-none mt-1 font-mono"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition shadow-lg shadow-cyan-600/30"
                >
                  Save Product to Storage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-center">Total</th>
                <th className="p-3.5 text-center">Reserved</th>
                <th className="p-3.5 text-center">Available</th>
                <th className="p-3.5 text-center">Reorder Level</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const calculatedAvailable = p.totalQuantity - p.reservedQuantity - p.damagedQuantity;
                const isReorderNeeded = calculatedAvailable <= p.reorderLevel;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.sku} | ${p.unitPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{p.category}</td>
                    <td className="p-3.5 font-mono text-cyan-400">{p.location}</td>
                    <td className="p-3.5 text-center font-semibold">{p.totalQuantity}</td>
                    <td className="p-3.5 text-center text-amber-400 font-semibold">{p.reservedQuantity}</td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          calculatedAvailable <= 5
                            ? 'bg-red-500/20 text-red-400'
                            : calculatedAvailable <= p.reorderLevel
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {calculatedAvailable}
                      </span>
                    </td>
                    <td className="p-3.5 text-center text-slate-400">{p.reorderLevel}</td>
                    <td className="p-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isReorderNeeded ? (
                          <button
                            onClick={() => setSelectedProductForReorder(p)}
                            className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition"
                          >
                            <Sparkles className="w-3 h-3" /> Reorder
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic mr-1">Optimal</span>
                        )}
                        <button
                          onClick={() => {
                            const newQtyStr = prompt(`Edit Stock Quantity for ${p.name}:`, String(p.totalQuantity));
                            if (newQtyStr !== null) {
                              const nq = parseInt(newQtyStr, 10);
                              if (!isNaN(nq)) {
                                updateProduct(p.id, {
                                  totalQuantity: nq,
                                  availableQuantity: Math.max(0, nq - p.reservedQuantity - p.damagedQuantity),
                                  status: nq <= 0 ? 'Out of Stock' : nq <= p.reorderLevel ? 'Low Stock' : 'Healthy',
                                });
                              }
                            }
                          }}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md transition"
                          title="Edit Stock Qty"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete product SKU ${p.sku} (${p.name})?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 bg-slate-800 hover:bg-red-950 text-red-400 rounded-md transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal trigger */}
      {selectedProductForReorder && (
        <SmartReorderModal
          product={selectedProductForReorder}
          onClose={() => setSelectedProductForReorder(null)}
        />
      )}
    </div>
  );
};
