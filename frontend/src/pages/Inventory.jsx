import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { getInventoryRisk } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import RiskBadge from '../components/RiskBadge';
import { ArrowUpDown, AlertCircle, CheckCircle2, Filter, Search, Package, ShieldAlert } from 'lucide-react';

const Inventory = () => {
  const { data, loading, error, execute } = useApi(getInventoryRisk, [], true);
  const [sortField, setSortField] = useState('risk_level');
  const [sortDir, setSortDir] = useState('desc');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <LoadingState message="Translating ML demand into inventory risk matrix..." />;
  if (error) return <ErrorState error={error} onRetry={execute} />;
  if (!data?.assessments) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filteredData = data.assessments.filter(item => {
    const matchesRisk = filterRisk === 'ALL' || item.risk_level === filterRisk;
    const matchesSearch = searchTerm === '' || 
      item.sku_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (sortField === 'risk_level') {
      const riskScore = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      valA = riskScore[valA] || 0;
      valB = riskScore[valB] || 0;
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ field, label }) => (
    <th 
      className="px-5 py-3.5 text-left text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-orange-500 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
      </div>
    </th>
  );

  return (
    <div className="space-y-8">
      {/* ── Glass Header Section ── */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Stockout Prevention Core
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Inventory Shortage & Risk Engine
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Projects forward lead-time consumption against on-hand supply to isolate critical stockouts before warehouse depletion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/15 dark:bg-slate-900/25 border border-white/30 dark:border-slate-800/40 text-center backdrop-blur-md">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Assessed SKUs</span>
            <span className="text-xl font-mono font-black text-orange-600 dark:text-orange-400">{data.assessments.length}</span>
          </div>
        </div>
      </div>

      {/* ── Controls: Search & Risk Filter ── */}
      <div className="glass-luxury-card p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search SKU, product or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/20 dark:bg-slate-900/30 border border-white/40 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-inner backdrop-blur-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase">
            <Filter className="w-3.5 h-3.5 text-orange-500" /> Filter:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                filterRisk === level 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30' 
                  : 'bg-white/15 dark:bg-slate-900/25 text-slate-600 dark:text-slate-400 border-white/30 dark:border-slate-800/40 hover:text-orange-500'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* ── Glass Data Table ── */}
      <div className="w-full overflow-x-auto rounded-3xl border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/20 dark:border-white/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md">
              <SortHeader field="sku_id" label="SKU / Category" />
              <SortHeader field="current_inventory" label="Current Stock" />
              <SortHeader field="lead_time_demand" label="Lead-Time Run" />
              <SortHeader field="projected_inventory" label="Projected Stock" />
              <SortHeader field="coverage_days" label="Coverage" />
              <SortHeader field="risk_level" label="Risk Tier" />
              <th className="px-5 py-3.5 text-left text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Prescriptive Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 dark:divide-white/5 bg-white/05 dark:bg-slate-950/10">
            {sortedData.map((item) => (
              <tr key={item.sku_id} className="hover:bg-orange-500/10 transition-colors duration-150">
                <td className="px-5 py-4">
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">{item.sku_id}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{item.product_name} • <span className="italic">{item.category}</span></div>
                </td>
                <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                  {item.current_inventory.toLocaleString()} <span className="text-[10px] text-slate-500">units</span>
                </td>
                <td className="px-5 py-4 font-mono text-slate-700 dark:text-slate-300">
                  {item.lead_time_demand} units
                  <span className="block text-[10px] text-slate-500">LT: {item.avg_lead_time} days</span>
                </td>
                <td className={`px-5 py-4 font-mono font-bold ${
                  item.projected_inventory < 0 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {item.projected_inventory} units
                </td>
                <td className="px-5 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {item.coverage_days} days
                </td>
                <td className="px-5 py-4">
                  <RiskBadge level={item.risk_level} />
                </td>
                <td className="px-5 py-4 max-w-sm">
                  <div className="flex items-start gap-2">
                    {item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {item.recommended_action}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
