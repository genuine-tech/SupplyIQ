import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useApi } from '../hooks/useApi';
import { getAnalytics } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { CustomGlassTooltip } from '../components/ui/GlassControls';
import { BarChart3, PieChart as PieIcon, TrendingUp, Layers } from 'lucide-react';

const GLASS_PALETTE = ['#EA580C', '#D97706', '#8B5CF6', '#06B6D4', '#10B981'];

const Analytics = () => {
  const { data, loading, error, execute } = useApi(getAnalytics);

  if (loading) return <LoadingState message="Synthesizing multi-echelon network analytics..." />;
  if (error) return <ErrorState error={error} onRetry={execute} />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* ── Glass Header Section ── */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Macro Network Telemetry
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Supply Chain Analytics & Trends
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Aggregated historical trends across 15 SKU product lines, supplier lead-time distributions, and network fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Telemetry Scope</span>
            <span className="text-xl font-mono font-black text-orange-600 dark:text-orange-400">24 Months</span>
          </div>
        </div>
      </div>

      {/* ── Row 1: Monthly Demand Trend & Inventory Trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-luxury-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Monthly Aggregate Demand (24 Months)</h3>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-5">Total product units consumed across all warehouse nodes</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.demand_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" minTickGap={25} />
                <YAxis tick={{fontSize: 10, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
                <Tooltip content={<CustomGlassTooltip />} />
                <Area type="monotone" dataKey="demand" stroke="#EA580C" strokeWidth={2.5} fill="url(#areaDemand)" name="Monthly Demand" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-luxury-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Monthly Average Inventory Level</h3>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-5">Average on-hand units maintained across distribution nodes</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.inventory_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" minTickGap={25} />
                <YAxis tick={{fontSize: 10, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
                <Tooltip content={<CustomGlassTooltip />} />
                <Area type="monotone" dataKey="inventory_level" stroke="#D97706" strokeWidth={2.5} fill="url(#areaInv)" name="Avg Inventory" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 2: Category Split & Supplier Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-luxury-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <PieIcon className="w-4 h-4 text-purple-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Product Category Demand Distribution</h3>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-5">Volume breakdown across commodity lines</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="total_demand"
                  nameKey="category"
                >
                  {data.category_distribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GLASS_PALETTE[index % GLASS_PALETTE.length]} stroke="rgba(255,255,255,0.2)" />
                  ))}
                </Pie>
                <Tooltip content={<CustomGlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-luxury-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Supplier Lead Time vs On-Time Reliability</h3>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-5">Expected SLA lead time (days) vs compliance rate per carrier</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.supplier_performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="supplier_id" tick={{fontSize: 11, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
                <YAxis tick={{fontSize: 11, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
                <Tooltip content={<CustomGlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="avg_lead_time" fill="#EA580C" radius={[6, 6, 0, 0]} name="Avg Lead Time (Days)" />
                <Bar dataKey="on_time_rate" fill="#06B6D4" radius={[6, 6, 0, 0]} name="On-Time Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 3: Delivery Delay Distribution Histogram ── */}
      <div className="glass-luxury-card p-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Delivery Delay Days Distribution</h3>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-5">Frequency histogram of late shipment duration across all historical records</p>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.delay_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="range" tick={{fontSize: 11, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
              <YAxis tick={{fontSize: 11, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
              <Tooltip content={<CustomGlassTooltip />} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Shipment Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
