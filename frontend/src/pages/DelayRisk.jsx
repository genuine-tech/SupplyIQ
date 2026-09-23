import React from 'react';
import { useApi } from '../hooks/useApi';
import { getDelayRisk } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import RiskBadge from '../components/RiskBadge';
import { Truck, MapPin, Clock, AlertTriangle, ShieldCheck, Navigation } from 'lucide-react';

const DelayRisk = () => {
  const { data, loading, error, execute } = useApi(getDelayRisk);

  if (loading) return <LoadingState message="Profiling supplier delay vectors and lead time telemetry..." />;
  if (error) return <ErrorState error={error} onRetry={execute} />;
  if (!data?.suppliers) return null;

  return (
    <div className="space-y-8">
      {/* ── Glass Header Section ── */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            Carrier & Vendor Telemetry
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Supplier & Transportation Delay Risk
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Composite vendor index derived from historical variance between promised SLA lead times and actual arrival timestamps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-white/60 dark:border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">Active Vendors</span>
            <span className="text-xl font-mono font-black text-orange-600 dark:text-orange-400">{data.suppliers.length}</span>
          </div>
        </div>
      </div>

      {/* ── Supplier Risk Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.suppliers.map((supplier) => (
          <div 
            key={supplier.supplier_id} 
            className="glass-luxury-card p-6 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient accent stripe */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              supplier.risk_level === 'CRITICAL' ? 'bg-red-500' : 
              supplier.risk_level === 'HIGH' ? 'bg-amber-500' : 
              supplier.risk_level === 'MEDIUM' ? 'bg-yellow-400' : 'bg-emerald-500'
            }`} />
            
            <div>
              <div className="flex justify-between items-start mb-5 pl-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{supplier.supplier_name}</h3>
                    <span className="text-[10px] font-mono bg-white/15 dark:bg-slate-900/25 px-2 py-0.5 rounded-full border border-white/30 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 font-bold">
                      {supplier.supplier_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1 font-medium">
                    <MapPin className="w-3 h-3 mr-1 text-orange-500" />
                    {supplier.region} Region Hub
                  </p>
                </div>
                <RiskBadge level={supplier.risk_level} />
              </div>

              {/* Delay Risk Score Highlight */}
              <div className="p-3.5 rounded-2xl bg-white/15 dark:bg-slate-900/25 border border-white/30 dark:border-slate-800/40 flex items-center justify-between mb-5 backdrop-blur-md">
                <div className="flex items-center text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  <div>
                    <span>Exposure Score</span>
                    <span className="block text-[10px] font-normal text-slate-500">Heuristic composite</span>
                  </div>
                </div>
                <span className="text-xl font-mono font-black text-orange-600 dark:text-orange-400">
                  {supplier.risk_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </span>
              </div>

              {/* Metric Pods Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/12 dark:bg-slate-900/20 border border-white/25 dark:border-white/5 backdrop-blur-xs">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-orange-500"/> SLA Lead Time
                  </p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{supplier.avg_lead_time} days</p>
                </div>

                <div className="p-3 rounded-xl bg-white/12 dark:bg-slate-900/20 border border-white/25 dark:border-white/5 backdrop-blur-xs">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                    <Truck className="w-3 h-3 mr-1 text-amber-500"/> Actual Delivery
                  </p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{supplier.avg_actual_delivery} days</p>
                </div>

                <div className="p-3 rounded-xl bg-white/12 dark:bg-slate-900/20 border border-white/25 dark:border-white/5 backdrop-blur-xs">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">Delay Rate</p>
                  <p className="font-mono font-bold text-orange-600 dark:text-orange-400">{supplier.delay_rate}%</p>
                </div>

                <div className="p-3 rounded-xl bg-white/12 dark:bg-slate-900/20 border border-white/25 dark:border-white/5 backdrop-blur-xs">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">On-Time Reliability</p>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{supplier.reliability}%</p>
                </div>

                <div className="p-3 rounded-xl bg-white/12 dark:bg-slate-900/20 border border-white/25 dark:border-white/5 backdrop-blur-xs">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">Transit Variance</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">+{supplier.avg_delay} days</p>
                </div>

                <div className="p-3 rounded-xl bg-white/12 dark:bg-slate-900/20 border border-white/25 dark:border-white/5 backdrop-blur-xs">
                  <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">Route Congestion</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{supplier.avg_route_risk}%</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Fulfillment: <strong className="text-slate-900 dark:text-slate-200">{supplier.avg_fulfillment}%</strong></span>
              <span className="italic">{supplier.region === 'Domestic' ? 'Surface Transit' : 'Intermodal Corridor'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DelayRisk;
