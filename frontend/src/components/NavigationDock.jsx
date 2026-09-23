import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
  Boxes, 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Truck, 
  BarChart3, 
  BrainCircuit, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

const defaultNavItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, badge: null, end: true },
  { path: '/dashboard/forecast', label: 'Demand Forecast', icon: TrendingUp, badge: null },
  { path: '/dashboard/inventory', label: 'Inventory Risk', icon: Package, badge: 'Live' },
  { path: '/dashboard/delays', label: 'Delay Risk', icon: Truck, badge: 'Risk' },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { path: '/dashboard/models', label: 'Baseline & ML Benchmarks', icon: BrainCircuit, badge: null },
];

export const NavigationDock = ({ navItems = defaultNavItems }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="fixed lg:static inset-y-0 left-0 z-50 flex flex-col justify-between items-center p-3 sm:p-4 my-auto pointer-events-auto">
      <div className="nav-island-container flex flex-col items-center p-2.5 gap-3 sm:gap-4">
        
        {/* Brand Logo Sphere */}
        <Link
          to="/dashboard"
          title="SupplyChainIQ — Autonomous Supply Chain Intelligence"
          className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(234,88,12,0.5)] border border-white/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <Boxes className="w-5 h-5" />
        </Link>

        <div className="w-6 h-px bg-slate-300/80 dark:bg-slate-700/60 my-0.5" />

        {/* Navigation Items */}
        <div className="flex flex-col gap-2 items-center">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const content = (
              <>
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {/* Floating Glass Tooltip */}
                <div className="absolute left-14 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs whitespace-nowrap opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl z-50 flex items-center gap-2">
                  <span className="font-bold">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                      {item.badge}
                    </span>
                  )}
                </div>
              </>
            );

            if (item.isExternal) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className="nav-island-item group"
                  title={item.label}
                >
                  {content}
                </a>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end || false}
                className={({ isActive }) => `nav-island-item group ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                {content}
              </NavLink>
            );
          })}
        </div>

        <div className="w-6 h-px bg-slate-300/80 dark:bg-slate-700/60 my-0.5" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
          className="relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer overflow-hidden flex-shrink-0"
          style={isDark ? {
            background: 'rgba(30,41,59,0.85)',
            borderColor: 'rgba(255,255,255,0.18)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 1px 1px 1px rgba(255,255,255,0.2)'
          } : {
            background: 'rgba(255,255,255,0.85)',
            borderColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 12px rgba(15,23,42,0.08), inset 1.5px 1.5px 1px rgba(255,255,255,1)'
          }}
        >
          {isDark ? <Moon className="w-4 h-4 text-slate-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

      </div>
    </aside>
  );
};

export default NavigationDock;
