import React from 'react';

export const GlassInput = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
        {label}
      </label>
    )}
    <div className="relative flex items-center">
      {Icon && <Icon className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />}
      <input
        {...props}
        className={`w-full py-2.5 rounded-2xl bg-white/20 dark:bg-slate-900/30 border border-white/50 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-inner backdrop-blur-md transition-all text-sm ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
      />
    </div>
  </div>
);

export const GlassSelect = ({ label, options = [], ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
        {label}
      </label>
    )}
    <select
      {...props}
      className="w-full py-2.5 px-4 rounded-2xl bg-white/20 dark:bg-slate-900/30 border border-white/50 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-inner backdrop-blur-md transition-all text-sm cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const GlassTable = ({ columns = [], data = [] }) => (
  <div className="w-full overflow-x-auto rounded-3xl border border-white/60 dark:border-white/10 shadow-xl backdrop-blur-md">
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="border-b border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
          {columns.map((c, i) => (
            <th key={i} className="py-3.5 px-5 font-bold">{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10 dark:divide-white/5 bg-white/05 dark:bg-slate-950/10">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-orange-500/15 transition-colors duration-150">
            {columns.map((col, cIdx) => (
              <td key={cIdx} className="py-3.5 px-5 text-slate-800 dark:text-slate-200 font-medium">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CustomGlassTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-white/30 dark:border-white/20 shadow-2xl backdrop-blur-xl text-xs">
        <span className="font-mono font-bold text-slate-500 dark:text-slate-400 block mb-1">{label}</span>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400">
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
