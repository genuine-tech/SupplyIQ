import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../lib/ThemeContext';

/**
 * LandingBackground
 * 
 * Embeds the full 3D landing page scene (mountains, oceans, volumetric clouds)
 * as a background using an iframe. This ensures the complex Three.js scene runs
 * seamlessly behind the dashboard while syncing theme changes.
 */
export default function LandingBackground({ children, className = '' }) {
  const { isDark } = useTheme();
  const iframeRef = useRef(null);
  const [initialTheme] = React.useState(isDark ? 'dark' : 'light');

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'SET_THEME', theme: isDark ? 'dark' : 'light' }, '*');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
        
        iframeRef.current.contentWindow.postMessage({
          type: 'SYNC_SCROLL',
          progress: progress
        }, '*');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`landing-bg-container relative w-full h-screen overflow-hidden ${className}`}>
      
      {/* ── 1. Full 3D Scene Iframe ── */}
      <iframe 
        ref={iframeRef}
        src={`/landing.html?bgOnly=true&theme=${initialTheme}`} 
        className="fixed inset-0 w-full h-full border-none z-0 pointer-events-none"
        title="3D Background"
        aria-hidden="true"
      />

      {/* ── 2. Foreground Interactive Application Layer ── */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-auto overflow-hidden">
        {children}
      </div>
    </div>
  );
}
