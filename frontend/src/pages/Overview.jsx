import React from 'react';
import { useApi } from '../hooks/useApi';
import { getSummary, checkHealth, getAnalytics } from '../services/api';
import KPICard from '../components/KPICard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import StatusIndicator from '../components/StatusIndicator';
import { CustomGlassTooltip } from '../components/ui/GlassControls';
import { 
  Target, 
  AlertTriangle, 
  PackageCheck, 
  AlertOctagon, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Database, 
  CheckCircle2,
  Award,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Overview = () => {
  const { data: summary, loading: summaryLoading, error: summaryError, execute: reloadSummary } = useApi(getSummary);
  const { data: health, loading: healthLoading } = useApi(checkHealth);
  const { data: analytics } = useApi(getAnalytics);

  if (summaryLoading) return <LoadingState message="Connecting to Quantum Telemetry Matrix..." />;
  if (summaryError) return <ErrorState error={summaryError} onRetry={reloadSummary} />;
  if (!summary) return null;

  const weeklyTrend = analytics?.weekly_trends || [];

  return (
    <div className="space-y-8">
      {/* ── Glass Hero Section ── */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-mono font-bold tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5" />
              Enterprise Logistics Intelligence
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold">
              15 SKUs Monitored
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
              Real-Time Telemetry &amp; Regression
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Supply Chain Delay &amp; <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Inventory Risk Forecaster</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
            End-to-end machine learning system implementing <strong>Time-Series Demand Regression</strong> and <strong>Heuristic Baseline Comparison</strong> alongside real-time vendor lead-time delay scoring and stockout risk prevention.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-white/15 dark:bg-slate-900/25 border border-white/30 dark:border-slate-800/40 shadow-inner backdrop-blur-md">
          <StatusIndicator status={health?.status === 'operational' ? 'healthy' : 'warning'} text="ML Engine Live" />
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 border-l border-slate-300/40 dark:border-slate-700/40 pl-4 hidden sm:block">
            Model: <span className="font-bold text-orange-600 dark:text-orange-400">{summary.best_model || 'Gradient Boosting'}</span>
          </div>
        </div>
      </div>

      {/* ── Tinted Luxury KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Forecast Accuracy (R²)" 
          value={`${summary.forecast_accuracy}%`} 
          icon={Target}
          trend="+95.5%"
          trendValue={`MAE: ${summary.forecast_mae} units`}
          subtitle={`Gradient Boosting Regressor`}
          tone="success"
        />
        <KPICard 
          title="Network Delay Risk" 
          value={`${summary.avg_delay_risk}%`} 
          icon={AlertTriangle}
          trend={summary.avg_delay_risk > 30 ? '+Risk' : '-3.2%'}
          trendValue="Supplier delay rate"
          subtitle="Real-time exposure score"
          tone={summary.avg_delay_risk < 25 ? 'success' : 'warning'}
        />
        <KPICard 
          title="Inventory Health" 
          value={`${summary.inventory_health_pct}%`} 
          icon={PackageCheck}
          trend="+Healthy"
          trendValue={`${summary.total_skus} Active SKUs`}
          subtitle="Above safety threshold"
          tone="success"
        />
        <KPICard 
          title="At-Risk SKUs" 
          value={`${summary.at_risk_sku_count}`} 
          icon={AlertOctagon}
          trend={summary.at_risk_sku_count > 0 ? `${summary.at_risk_sku_count} Urgent` : 'Optimal'}
          trendValue={`${summary.total_skus - summary.at_risk_sku_count} Stable`}
          subtitle="Imminent stockout warning"
          tone={summary.at_risk_sku_count > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* ── Charts & Telemetry Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Network Demand Trend Chart */}
        <div className="lg:col-span-2 glass-luxury-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Weekly Network Demand Trend
              </h3>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                Historical aggregate throughput across all active distribution hubs
              </p>
            </div>
            <Link 
              to="/dashboard/analytics" 
              className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1.5"
            >
              Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="date" tick={{fontSize: 11, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" minTickGap={25} />
                <YAxis tick={{fontSize: 11, fill: '#94A3B8'}} stroke="rgba(148, 163, 184, 0.2)" />
                <Tooltip content={<CustomGlassTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#EA580C" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#demandGrad)" 
                  name="Volume" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Health & Quick Action Glass Pod */}
        <div className="space-y-6">
          <div className="glass-luxury-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-500" />
              Machine Learning Core
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Model Deployment</span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Production
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Training Samples</span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-orange-500" />
                  {summary.total_records?.toLocaleString() || '10,995'} records
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Date Range</span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{summary.date_range}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Target Metric</span>
                <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">Order_Demand (Units)</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/80">
              <Link 
                to="/dashboard/forecast" 
                className="btn-glass-primary w-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" /> Run Demand Forecast
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
