import React from 'react';

const BADGE_VARIANTS = {
  critical: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  high: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30',
  medium: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-400 border-yellow-500/30',
  low: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-500/30',
  optimal: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-500/30',
  neutral: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30'
};

export const RiskBadge = ({ level = 'neutral', text, pulse = true }) => {
  const normalizedLevel = String(level || 'neutral').toLowerCase();
  const variant = BADGE_VARIANTS[normalizedLevel] || BADGE_VARIANTS.neutral;
  const isPulsing = pulse && (normalizedLevel === 'critical' || normalizedLevel === 'high');

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${variant}`}>
      {isPulsing && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {text || String(level).toUpperCase()}
    </span>
  );
};

export default RiskBadge;
