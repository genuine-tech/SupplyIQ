import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  subtitle,
  icon: Icon,
  tone = 'orange'
}) => {
  const displayTrend = trendValue || trend;
  const isPositive = displayTrend && (String(displayTrend).startsWith('+') || trend === 'up' || tone === 'success');
  const isNegative = displayTrend && (String(displayTrend).startsWith('-') || trend === 'down' || tone === 'warning');

  return (
    <div className="glass-luxury-card p-6 flex flex-col justify-between cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        {/* Tinted Icon Pod */}
        <div className="p-3 rounded-2xl bg-orange-500/15 dark:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 backdrop-blur-md">
          {Icon && <Icon className="w-5 h-5" />}
        </div>

        {/* Live Status Pill */}
        {displayTrend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
            isPositive
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
              : isNegative
              ? 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
              : 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30'
          }`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
            </span>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : isNegative ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            <span>{displayTrend}</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-orange-600 dark:text-orange-400">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">{unit}</span>}
        </div>
        {(subtitle || (trendValue && trendValue !== displayTrend)) && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
            {subtitle || trendValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default KPICard;
