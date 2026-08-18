import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, AlertTriangle, TrendingUp, Filter } from 'lucide-react';

const ORDERS_PER_DAY_DATA = [
  { day: 'Mon', orders: 120, delayed: 2 },
  { day: 'Tue', orders: 145, delayed: 3 },
  { day: 'Wed', orders: 160, delayed: 1 },
  { day: 'Thu', orders: 185, delayed: 4 },
  { day: 'Fri', orders: 210, delayed: 2 },
  { day: 'Sat', orders: 90, delayed: 0 },
  { day: 'Sun', orders: 75, delayed: 0 },
];

const ZONE_PERFORMANCE_DATA = [
  { zone: 'Zone A', pickTime: 9.2, errorRate: 0.9 },
  { zone: 'Zone B (Congested)', pickTime: 18.4, errorRate: 4.8 },
  { zone: 'Zone C', pickTime: 12.0, errorRate: 1.5 },
  { zone: 'Zone D', pickTime: 10.5, errorRate: 1.1 },
];

const EXCEPTION_TYPES_DATA = [
  { name: 'Damaged Item', value: 35, color: '#ef4444' },
  { name: 'Quantity Mismatch', value: 25, color: '#f97316' },
  { name: 'Picking Delay', value: 20, color: '#eab308' },
  { name: 'Stock Shortage', value: 20, color: '#06b6d4' },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7 days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Operational Analytics & Bottleneck Intelligence</h2>
          <p className="text-xs text-slate-400">
            Real-time warehouse throughput, picking zone velocity, stockout frequency, and exception root causes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {['Today', '7 days', '30 days'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition ${
                timeRange === range
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Identified Bottleneck Spotlight */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Top Identified Bottleneck</div>
            <h3 className="text-base font-bold text-white mt-0.5">Picking Zone B Velocity Shortfall</h3>
            <p className="text-xs text-slate-300 mt-1">
              Impact: <strong className="text-red-400">32 delayed orders</strong> | Pick time: 18.4 min (65% above 11.1 min baseline). Recommendation: Reassign 2 pickers from Zone A.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Order Volume & Delays */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Order Volume & Fulfillment Delays</span>
            <span className="text-xs font-normal text-slate-400 font-mono">Past 7 Days</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDERS_PER_DAY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="orders" fill="#0284c7" name="Completed Orders" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="#ef4444" name="Delayed Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Zone Picking Speed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Zone Picking Time (Minutes)</span>
            <span className="text-xs font-normal text-slate-400 font-mono">Baseline: 11.1m</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_PERFORMANCE_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="zone" type="category" stroke="#64748b" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="pickTime" fill="#f97316" name="Avg Pick Time (min)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Exception Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white">Operational Exception Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EXCEPTION_TYPES_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {EXCEPTION_TYPES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
