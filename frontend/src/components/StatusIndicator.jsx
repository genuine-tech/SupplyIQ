import React from 'react';

const StatusIndicator = ({ status, text }) => {
  const isHealthy = status === 'healthy' || status === 'ok' || status === 'operational';
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/60 border border-white/60 dark:border-slate-700/60 shadow-sm backdrop-blur-md">
      <span className="relative flex h-2.5 w-2.5">
        {isHealthy && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </span>
      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
        {text || status}
      </span>
    </div>
  );
};

export default StatusIndicator;
