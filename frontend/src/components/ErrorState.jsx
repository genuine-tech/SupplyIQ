import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="glass-luxury-card flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto my-8">
      <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
        Telemetry Connection Notice
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">
        {typeof error === 'string' ? error : 'Failed to retrieve telemetry data from the backend.'}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="group btn-glass-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
          Reconnect Server
        </button>
      )}
    </div>
  );
};

export default ErrorState;
