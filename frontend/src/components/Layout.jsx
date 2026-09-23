import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import KineticGrid from './ui/KineticGrid';
import { NavigationDock } from './NavigationDock';
import { useTheme } from '../lib/ThemeContext';
import { 
  Sparkles, 
  Activity, 
  Clock, 
  Cpu, 
  Wifi, 
  ShieldCheck,
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Truck, 
  BarChart3, 
  BrainCircuit,
  Radio,
  Globe
} from 'lucide-react';

const routeMeta = {
  '/': { 
    title: 'Supply Chain Delay & Inventory Risk Forecaster', 
    shortTitle: 'Overview',
    icon: LayoutDashboard, 
    tag: 'Executive Overview' 
  },
  '/dashboard': { 
    title: 'Supply Chain Delay & Inventory Risk Forecaster', 
    shortTitle: 'Overview',
    icon: LayoutDashboard, 
    tag: 'Executive Overview' 
  },
  '/dashboard/forecast': { 
    title: 'Time-Series Demand Forecaster', 
    shortTitle: 'Forecast',
    icon: TrendingUp, 
    tag: 'Predictive Regression' 
  },
  '/forecast': { 
    title: 'Time-Series Demand Forecaster', 
    shortTitle: 'Forecast',
    icon: TrendingUp, 
    tag: 'Predictive Regression' 
  },
  '/dashboard/inventory': { 
    title: 'Inventory Risk & Stockout Forecaster', 
    shortTitle: 'Inventory',
    icon: Package, 
    tag: '15 SKUs Monitored' 
  },
  '/inventory': { 
    title: 'Inventory Risk & Stockout Forecaster', 
    shortTitle: 'Inventory',
    icon: Package, 
    tag: '15 SKUs Monitored' 
  },
  '/dashboard/delays': { 
    title: 'Supply Chain Delay & Carrier Risk', 
    shortTitle: 'Delay Risk',
    icon: Truck, 
    tag: 'Lead-Time Variance' 
  },
  '/delays': { 
    title: 'Supply Chain Delay & Carrier Risk', 
    shortTitle: 'Delay Risk',
    icon: Truck, 
    tag: 'Lead-Time Variance' 
  },
  '/dashboard/analytics': { 
    title: 'Network Trends & Distribution', 
    shortTitle: 'Analytics',
    icon: BarChart3, 
    tag: '24-Mo History' 
  },
  '/analytics': { 
    title: 'Network Trends & Distribution', 
    shortTitle: 'Analytics',
    icon: BarChart3, 
    tag: '24-Mo History' 
  },
  '/dashboard/models': { 
    title: 'Model Benchmarking & Heuristic Comparison', 
    shortTitle: 'Benchmarks',
    icon: BrainCircuit, 
    tag: 'ML Benchmarks' 
  },
  '/dashboard/model-performance': { 
    title: 'Model Benchmarking & Heuristic Comparison', 
    shortTitle: 'Benchmarks',
    icon: BrainCircuit, 
    tag: 'ML Benchmarks' 
  },
  '/models': { 
    title: 'Model Benchmarking & Heuristic Comparison', 
    shortTitle: 'Benchmarks',
    icon: BrainCircuit, 
    tag: 'ML Benchmarks' 
  }
};

export const Layout = ({ children }) => {
  const { isDark } = useTheme();
  const location = useLocation();
  const meta = routeMeta[location.pathname] || routeMeta['/'];
  const PageIcon = meta.icon;

  const [timeStr, setTimeStr] = useState(() => 
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={isDark ? 'dark' : ''}>
      <KineticGrid globalColor={isDark ? 'dark' : 'light'} className="h-screen overflow-hidden">
        <div className="flex h-screen overflow-hidden font-sans antialiased text-slate-900 dark:text-slate-100 relative">

          {/* ── Fixed Cosmic Gradient Ambient Orbs (Shine through tinted glass) ── */}
          <div className="fixed -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-orange-500/28 dark:bg-orange-600/15 blur-3xl pointer-events-none" />
          <div className="fixed top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-purple-500/26 dark:purple-600/15 blur-3xl pointer-events-none" />
          <div className="fixed -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-amber-500/26 dark:bg-amber-600/15 blur-3xl pointer-events-none" />
          <div className="fixed top-1/2 left-10 w-96 h-96 rounded-full bg-cyan-500/22 dark:bg-cyan-600/10 blur-3xl pointer-events-none" />

          {/* ── Floating Quantum Navigation Island ── */}
          <NavigationDock />

          {/* ── Main Viewport Area ── */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
            
            {/* ── Floating Rounded Capsule Header Bar ── */}
            <header className="pt-3 sm:pt-4 px-3 sm:px-8 pb-1 z-30 flex-shrink-0">
              <div className="header-capsule-container max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
                
                {/* Left: Brand Sphere & Active Page Breadcrumb */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Glowing Animated Icon Pod */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-white/40 flex-shrink-0">
                    <PageIcon className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {meta.title}
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      {meta.tag}
                    </span>
                  </div>
                </div>

                {/* Right: Live Telemetry Status Pills */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  
                  {/* Live Clock Pill */}
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 dark:bg-slate-900/60 border border-white/50 dark:border-white/15 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>{timeStr}</span>
                  </div>

                  {/* Production Model Pill */}
                  <div 
                    title="Pre-trained Champion Model (GradientBoostingRegressor) holdout test score (95.48% R²) loaded from ml/models/demand_model.joblib"
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold backdrop-blur-md shadow-xs cursor-help"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="hidden sm:inline">ML Production:</span>
                    <span className="text-[11px]">95.5% R²</span>
                  </div>

                  {/* 3D Landing Showcase Link */}
                  <a
                    href="/landing.html"
                    title="Return to 3D Landing Page"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/35 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold backdrop-blur-md transition-all shadow-xs cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">3D Landing</span>
                  </a>

                </div>

              </div>
            </header>

            {/* ── Scrollable Page Content ── */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
              <div className="max-w-7xl mx-auto pb-16">
                {children || <Outlet />}
              </div>
            </main>
          </div>

        </div>
      </KineticGrid>
    </div>
  );
};

export default Layout;
