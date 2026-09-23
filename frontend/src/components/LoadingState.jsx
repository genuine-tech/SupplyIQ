import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Computing telemetry data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
        </div>
      </div>
      <p className="text-sm font-mono font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
