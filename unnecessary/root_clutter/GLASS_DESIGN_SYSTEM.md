1111122# 💎 The Quantum Liquid Glassmorphism & Mouse-Reactive Background Design System
> **Complete Technical Specification & Code Blueprint**
> Replicate the exact visual effects, tinted glassmorphism, atmospheric gradient orbs, and interactive mouse-reactive canvas grid for any modern web application.

---

## 1. 📋 Master AI Copy-Paste Prompt

Copy and paste the prompt below into any AI (Claude, ChatGPT, Gemini, Cursor) to transform any frontend into this exact visual style:

```markdown
You are a Principal Frontend Architect and World-Class UI/UX Designer.
Transform my application's frontend to adopt the exact "Quantum Liquid Glassmorphism & Interactive Ambient Canvas" design system described below.

### 🌟 1. Core Visual Identity & Concept
- **Aesthetic**: Liquid Tinted Crystal Glass + Cyber-Physical Telemetry.
- **Glass Optics**: Cards are NOT milky white or flat opaque boxes. They act as translucent optical lenses with low blur (3px–5px) so the colorful ambient orbs and animated kinetic grid lines clearly show through the tinted glass.
- **Specular 3D Lighting**: Every card and button features directional specular edge refraction using CSS inset box-shadows simulating a top-left light source.
- **Interactive Kinetic Canvas**: A full-screen interactive HTML5 canvas grid where horizontal/vertical lines and junction corner dots dynamically warp and bend toward the cursor with spring physics and ripple shockwaves on click.
- **Dual-Theme Support**: Flawless visual balance in both Dark Mode and Light Mode with a single theme toggle.

---

### 🎨 2. The Color & Lighting Hierarchy

#### A. Multi-Layered Ambient Gradient Background
1. Base Background:
   - Dark Mode: `#040711` (Deep obsidian).
   - Light Mode: `#F1F5F9` (Warm slate foundation).
2. Fixed Atmospheric Ambient Orbs (Fixed positions, blur-3xl, pointer-events: none):
   - Orb 1 (Top-Left): Orange/Terracotta (`bg-orange-500/28` in light, `bg-orange-600/15` in dark, 36rem x 36rem).
   - Orb 2 (Top-Right): Purple (`bg-purple-500/26` in light, `bg-purple-600/15` in dark, 36rem x 36rem).
   - Orb 3 (Bottom-Center): Amber Gold (`bg-amber-500/26` in light, `bg-amber-600/15` in dark, 36rem x 36rem).
   - Orb 4 (Center-Left): Cyan (`bg-cyan-500/22` in light, `bg-cyan-600/10` in dark, 24rem x 24rem).

#### B. The Tinted Glass Formula
1. Outer Glass Panels (`.glass-panel`):
   - Dark Mode: `background: rgba(15, 23, 42, 0.18); backdrop-filter: blur(3px); border: 1px solid rgba(255, 255, 255, 0.20); box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.6), inset 1px 1px 1px 0 rgba(255, 255, 255, 0.25);`
   - Light Mode: `background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(3px) saturate(170%); border: 1px solid rgba(255, 255, 255, 0.85); box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.08), inset 1.5px 1.5px 1px #FFFFFF;`
2. Luxury Tinted Metric Cards (`.glass-luxury-card`):
   - Dark Mode: `background: rgba(15, 23, 42, 0.72); backdrop-filter: blur(8px) saturate(190%); border: 1px solid rgba(255, 255, 255, 0.16); box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.5), inset 1.5px 1.5px 1px rgba(255, 255, 255, 0.25);`
   - Light Mode: `background: rgba(255, 255, 255, 0.26); backdrop-filter: blur(4px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.90); box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.06), inset 1.5px 1.5px 1px #FFFFFF;`
3. Action Buttons (`.btn-glass-primary`):
   - Gradient: `linear-gradient(135deg, #EA580C 0%, #D97706 100%)`
   - Specular Top Highlight: `inset 2px 2px 1.5px 0 rgba(255, 255, 255, 0.8)`
   - Glowing Aura: `box-shadow: 0 6px 16px rgba(234, 88, 12, 0.35), 0 0 20px rgba(234, 88, 12, 0.25)`
   - Hover Physics: Spring scale `transform: translateY(-3px) scale(1.04); transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 2.2);`

#### C. Mouse-Reactive Kinetic Grid Rules
- Rendered on a fixed full-screen `<canvas>` with HiDPI scaling (`devicePixelRatio`).
- Grid cells are 55px x 55px.
- When NOT hovering:
  - Light Mode: Clean, soft slate lines (`rgba(71, 85, 105, 0.28)`, 1.0px width) and junction dots (`rgba(71, 85, 105, 0.45)`, 1.8px radius) at corners. No extra unaligned dots.
  - Dark Mode: Subtle slate lines (`rgba(148, 163, 184, 0.10)`, 0.8px width) and junction dots (`rgba(210, 195, 180, 0.40)`).
- When hovering:
  - Grid lines warp smoothly toward cursor within a 260px influence radius.
  - Lines and junction dots dynamically illuminate in radiant warm terracotta (`rgba(234, 88, 12, 0.95)` to `1.0`) with radial glowing halos.
- Clicking sends out dynamic concentric ripple displacement shockwaves.

Please implement this exact visual design system for my application, providing the complete CSS tokens, canvas component, and layout shell.
```

---

## 2. ⚛️ Component 1: The Interactive Mouse-Reactive Canvas Grid (`KineticGrid.jsx`)

Save this file as `src/components/ui/KineticGrid.jsx`:

```jsx
import React, { useEffect, useRef, useCallback } from "react";

const CELL_SIZE = 55;
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const LERP_SPEED = 0.08;
const LINE_BASE = { r: 148, g: 163, b: 184, a: 0.10 };

function lerpN(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(base, active, t) {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

export default function KineticGrid({
  children,
  className = "",
  globalColor = "dark",
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const targetMouseRef = useRef({ x: -9999, y: -9999 });
  const ripplesRef = useRef([]);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  // ── Calculate Warped Coordinate with Bell Falloff ──
  const getWarpedPoint = useCallback(
    (gx, gy, col, row, mouse, ripples, cols, rows) => {
      const colPin = Math.min(col / 1.5, (cols - 1 - col) / 1.5, 1);
      const rowPin = Math.min(row / 1.5, (rows - 1 - row) / 1.5, 1);
      const pinFactor = colPin * colPin * rowPin * rowPin;

      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      // Ripple displacement shockwaves
      let rx = 0, ry = 0;
      for (const r of ripples) {
        const rdx = gx - r.x;
        const rdy = gy - r.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const waveWidth = 55;
        const diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          const strength = (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
          const angle = Math.atan2(rdy, rdx);
          const sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      // Cursor warp with smooth bell curve
      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        const t = dist / INFLUENCE_RADIUS;
        const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        const warpAmt = eased * MAX_WARP * pinFactor;
        const angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry,
          },
          proximity,
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity };
    },
    [],
  );

  // ── Render Frame ──
  const draw = useCallback(
    (now) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w: W, h: H } = sizeRef.current;
      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;

      const theme = {
        light: {
          bg: "transparent",
          lineBase: { r: 71, g: 85, b: 105, a: 0.28 },
          lineActive: { r: 234, g: 88, b: 12, a: 0.95 },
          nodeBase: { r: 71, g: 85, b: 105, a: 0.45 },
          nodeActive: { r: 234, g: 88, b: 12, a: 1.0 },
          dotTexture: null,
          dotRadius: 0,
          baseLineWidth: 1.0,
          activeLineWidth: 2.2,
          baseNodeRadius: 1.8,
          activeNodeRadius: 4.5,
          glow: "234,88,12",
          ripple: "217,119,6",
        },
        dark: {
          bg: "transparent",
          lineBase: { r: 148, g: 163, b: 184, a: 0.10 },
          lineActive: { r: 234, g: 88, b: 12, a: 0.50 },
          nodeBase: { r: 210, g: 195, b: 180, a: 0.40 },
          nodeActive: { r: 234, g: 88, b: 12, a: 0.70 },
          dotTexture: "rgba(194, 65, 12, 0.06)",
          dotRadius: 0.7,
          baseLineWidth: 0.8,
          activeLineWidth: 1.6,
          baseNodeRadius: 1.4,
          activeNodeRadius: 2.8,
          glow: "234,88,12",
          ripple: "217,119,6",
        },
      }[globalColor === "light" ? "light" : "dark"];

      // HiDPI Scaling
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Ripple Updates
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      // Build grid mesh
      const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);

      const pts = [];
      const prox = [];

      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col++) {
          const { pt, proximity } = getWarpedPoint(
            col * cellW, row * cellH, col, row, mouse, ripples, cols, rows
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      // Draw Grid Segments
      const drawSeg = (p1, p2, pr1, pr2) => {
        const avg = (pr1 + pr2) / 2;
        const t = avg * avg * (3 - 2 * avg);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(theme.lineBase || LINE_BASE, theme.lineActive, t);
        ctx.lineWidth = lerpN(theme.baseLineWidth || 1.0, theme.activeLineWidth || 2.2, t);
        ctx.stroke();
      };

      ctx.lineCap = "butt";
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols - 1; col++)
          drawSeg(pts[row][col], pts[row][col + 1], prox[row][col], prox[row][col + 1]);

      for (let col = 0; col < cols; col++)
        for (let row = 0; row < rows - 1; row++)
          drawSeg(pts[row][col], pts[row + 1][col], prox[row][col], prox[row + 1][col]);

      // Draw Junction Dots (Only at grid corners)
      const bNodeR = theme.baseNodeRadius || 1.8;
      const aNodeR = theme.activeNodeRadius || 4.5;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = pts[row][col];
          const pr = prox[row][col];
          const t = pr * pr * (3 - 2 * pr);
          const r = lerpN(bNodeR, aNodeR, t);

          if (t > 0.3) {
            const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
            const grd = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR);
            grd.addColorStop(0, `rgba(${theme.glow},${(t * 0.3).toFixed(3)})`);
            grd.addColorStop(1, `rgba(${theme.glow},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(theme.nodeBase, theme.nodeActive, t);
          ctx.fill();
        }
      }

      // Draw Click Ripple Rings
      for (const r of ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${theme.ripple},${(r.opacity * 0.35).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [getWarpedPoint, globalColor],
  );

  // ── Animation Loop ──
  const animate = useCallback(
    (now) => {
      const m = mouseRef.current;
      const t = targetMouseRef.current;
      m.x = lerpN(m.x, t.x, LERP_SPEED);
      m.y = lerpN(m.y, t.y, LERP_SPEED);
      draw(now);
      rafRef.current = requestAnimationFrame(animate);
    },
    [draw],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      sizeRef.current = { w, h };
      if (mouseRef.current.x === -9999) {
        mouseRef.current = { x: -9999, y: -9999 };
        targetMouseRef.current = { x: -9999, y: -9999 };
      }
    };

    setSize();
    window.addEventListener("resize", setSize);

    const onMouseMove = (e) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-transparent ${className}`}>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
```

---

## 3. 🌌 Component 2: Layout with Glowing Ambient Orbs (`Layout.jsx`)

Save this file as `src/components/Layout.jsx`:

```jsx
import React from 'react';
import KineticGrid from './ui/KineticGrid';

export const Layout = ({ children, isDark = true }) => {
  return (
    <div className={isDark ? 'dark' : ''}>
      <KineticGrid globalColor={isDark ? 'dark' : 'light'} className="h-screen overflow-hidden">
        <div className="flex h-screen overflow-hidden font-sans antialiased text-slate-900 dark:text-slate-100 relative">
          
          {/* ── Fixed Cosmic Gradient Ambient Orbs (Shine through tinted glass) ── */}
          <div className="fixed -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-orange-500/28 dark:bg-orange-600/15 blur-3xl pointer-events-none" />
          <div className="fixed top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-purple-500/26 dark:bg-purple-600/15 blur-3xl pointer-events-none" />
          <div className="fixed -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-amber-500/26 dark:bg-amber-600/15 blur-3xl pointer-events-none" />
          <div className="fixed top-1/2 left-10 w-96 h-96 rounded-full bg-cyan-500/22 dark:bg-cyan-600/10 blur-3xl pointer-events-none" />

          {/* ── Page Content (Inside Scrollable Main) ── */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative z-10">
            {children}
          </main>
        </div>
      </KineticGrid>
    </div>
  );
};
```

---

## 4. 🎨 Complete Global Stylesheet (`index.css`)

Copy this into your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #040711;
    background-attachment: fixed;
    color: #F8FAFC;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
}

/* ══════════════════════════════════════════════════════════════════
   DARK MODE TINTED GLASS ARCHITECTURE
══════════════════════════════════════════════════════════════════ */
/* Large Outer Container Panel */
.glass-panel {
  background: rgba(15, 23, 42, 0.18) !important;
  backdrop-filter: blur(3px) !important;
  -webkit-backdrop-filter: blur(3px) !important;
  border: 1px solid rgba(255, 255, 255, 0.20) !important;
  box-shadow: 
    0 24px 50px -12px rgba(0, 0, 0, 0.6),
    0 4px 16px 0 rgba(0, 0, 0, 0.2),
    inset 1px 1px 1px 0 rgba(255, 255, 255, 0.25),
    inset -1px -1px 1px 1px rgba(0, 0, 0, 0.4) !important;
  border-radius: 26px;
  position: relative;
  color: #F8FAFC;
}

/* Luxury Metric & Content Card */
.glass-luxury-card {
  background: rgba(15, 23, 42, 0.72) !important;
  backdrop-filter: blur(8px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(8px) saturate(190%) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  box-shadow: 
    0 16px 36px -8px rgba(0, 0, 0, 0.5),
    0 2px 8px 0 rgba(0, 0, 0, 0.2),
    inset 1.5px 1.5px 1px 0 rgba(255, 255, 255, 0.25),
    inset -1px -1px 1px 1px rgba(0, 0, 0, 0.3) !important;
  border-radius: 1.5rem;
  color: #F8FAFC;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 2.2);
}

.glass-luxury-card:hover {
  border-color: rgba(234, 88, 12, 0.5) !important;
  box-shadow: 
    0 24px 48px -10px rgba(0, 0, 0, 0.7),
    0 0 25px rgba(234, 88, 12, 0.25),
    inset 1.5px 1.5px 1.5px 0 rgba(255, 255, 255, 0.4) !important;
  transform: translateY(-4px) scale(1.02);
}

/* Liquid Glass Buttons */
.btn-glass-primary {
  background: linear-gradient(135deg, #EA580C 0%, #D97706 100%) !important;
  color: #FFFFFF !important;
  font-weight: 700;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 6px 6px rgba(0, 0, 0, 0.2), 
    0 0 20px rgba(234, 88, 12, 0.35),
    inset 2px 2px 1px 0 rgba(255, 255, 255, 0.7),
    inset -1px -1px 1px 1px rgba(255, 255, 255, 0.3) !important;
  transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 2.2);
  backdrop-filter: blur(16px) saturate(190%);
}

.btn-glass-primary:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 
    0 10px 24px -2px rgba(234, 88, 12, 0.6),
    0 0 28px rgba(234, 88, 12, 0.5),
    inset 2px 2px 2px 0 rgba(255, 255, 255, 0.95) !important;
}

/* ══════════════════════════════════════════════════════════════════
   LIGHT MODE TINTED CRYSTAL ARCHITECTURE
══════════════════════════════════════════════════════════════════ */
[data-theme="light"] body {
  background-color: #F1F5F9 !important;
  background-image:
    radial-gradient(at 5% 5%,    rgba(234, 88,  12, 0.22) 0px, transparent 50%),
    radial-gradient(at 95% 5%,   rgba(124, 58, 237, 0.18) 0px, transparent 50%),
    radial-gradient(at 50% 50%,  rgba(217, 119,  6, 0.15) 0px, transparent 50%),
    radial-gradient(at 95% 95%,  rgba(234, 88,  12, 0.20) 0px, transparent 50%),
    radial-gradient(at 5% 95%,   rgba(14, 165, 233, 0.18) 0px, transparent 50%) !important;
  background-attachment: fixed !important;
  color: #0F172A !important;
}

[data-theme="light"] h1, [data-theme="light"] h2, [data-theme="light"] h3,
[data-theme="light"] h4, [data-theme="light"] h5, [data-theme="light"] h6 {
  color: #0F172A !important;
}

[data-theme="light"] .glass-panel {
  background: rgba(255, 255, 255, 0.18) !important;
  backdrop-filter: blur(3px) saturate(170%) !important;
  -webkit-backdrop-filter: blur(3px) saturate(170%) !important;
  border: 1px solid rgba(255, 255, 255, 0.85) !important;
  box-shadow:
    0 20px 45px -10px rgba(15, 23, 42, 0.08),
    0 4px 16px 0 rgba(15, 23, 42, 0.03),
    inset 1.5px 1.5px 1px 0 rgba(255, 255, 255, 1.0) !important;
  color: #0F172A !important;
}

[data-theme="light"] .glass-luxury-card {
  background: rgba(255, 255, 255, 0.26) !important;
  backdrop-filter: blur(4px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(4px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.90) !important;
  box-shadow:
    0 16px 36px -8px rgba(15, 23, 42, 0.06),
    0 4px 12px 0 rgba(15, 23, 42, 0.02),
    inset 1.5px 1.5px 1px 0 rgba(255, 255, 255, 1.0) !important;
  color: #0F172A !important;
}

[data-theme="light"] .glass-luxury-card:hover {
  background: rgba(255, 255, 255, 0.45) !important;
  border-color: rgba(234, 88, 12, 0.60) !important;
  box-shadow:
    0 24px 48px -10px rgba(234, 88, 12, 0.20),
    inset 1.5px 1.5px 1.5px 0 rgba(255, 255, 255, 1.0) !important;
  transform: translateY(-4px) scale(1.02);
}
```

---

## 5. 💎 Component 3: The Tinted Luxury KPI Card (`KPICard.jsx`)

Save this file as `src/components/KPICard.jsx`:

```jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  unit,
  trend,
  subtitle,
  icon: Icon,
  color = 'orange'
}) => {
  const isPositive = trend && trend.startsWith('+');
  const isNegative = trend && trend.startsWith('-');

  return (
    <div className="glass-luxury-card p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        {/* Tinted Icon Pod */}
        <div className="p-3 rounded-2xl bg-orange-100/90 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400">
          {Icon && <Icon className="w-5 h-5" />}
        </div>

        {/* Live Status Pill */}
        {trend && (
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
            <span>{trend}</span>
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
        {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};
```

---

## 6. 🌓 Engine: Dual Theme Provider & Controller (`ThemeContext.jsx`)

Save this file as `src/lib/ThemeContext.jsx`:

```jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    return saved ? saved === 'dark' : true;
  });

  const applyTheme = useCallback((dark) => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('app-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

## 7. 🏝️ Component: Floating Quantum Navigation Island & Dock

```jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Boxes, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

export const NavigationDock = ({ navItems = [] }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="fixed lg:static inset-y-0 left-0 z-50 flex flex-col justify-between items-center p-3 sm:p-4 my-auto">
      <div className="nav-island-container flex flex-col items-center p-2.5 gap-4">
        
        {/* Brand Logo Sphere */}
        <NavLink
          to="/"
          className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-[0_6px_20px_rgba(234,88,12,0.5)] border border-white/30 hover:scale-110 active:scale-95 transition-all"
        >
          <Boxes className="w-5 h-5" />
        </NavLink>

        <div className="w-6 h-px bg-slate-300/80 dark:bg-slate-700/60 my-0.5" />

        {/* Navigation Items */}
        <div className="flex flex-col gap-2 items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-island-item group ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {/* Floating Glass Tooltip */}
                <div className="absolute left-14 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs whitespace-nowrap opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl z-50 flex items-center gap-2">
                  <span className="font-bold">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                      {item.badge}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>

        <div className="w-6 h-px bg-slate-300/80 dark:bg-slate-700/60 my-0.5" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
```

---

## 8. 🎛️ Form Controls: Glass Inputs & Dropdowns

```jsx
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
        className={`w-full py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-300/80 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-inner backdrop-blur-md transition-all text-sm ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
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
      className="w-full py-2.5 px-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-300/80 dark:border-slate-700/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-inner backdrop-blur-md transition-all text-sm cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
```

---

## 9. 🚦 Component: Semantic Badges & Live Status Indicators (`RiskBadge.jsx`)

```jsx
import React from 'react';

const BADGE_VARIANTS = {
  critical: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  high: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/30',
  medium: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-400 border-yellow-500/30',
  optimal: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-500/30',
  neutral: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30'
};

export const RiskBadge = ({ level = 'neutral', text, pulse = false }) => {
  const variant = BADGE_VARIANTS[level.toLowerCase()] || BADGE_VARIANTS.neutral;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${variant}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {text || level.toUpperCase()}
    </span>
  );
};
```

---

## 10. 📊 Component: Glass Data Table (`GlassTable.jsx`)

```jsx
import React from 'react';

export const GlassTable = ({ columns = [], data = [] }) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-white/60 dark:border-white/10 shadow-lg">
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
          {columns.map((c, i) => (
            <th key={i} className="py-3.5 px-5 font-bold">{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 bg-white/20 dark:bg-slate-950/20 backdrop-blur-xs">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-orange-500/10 transition-colors duration-150">
            {columns.map((col, cIdx) => (
              <td key={cIdx} className="py-3 px-5 text-slate-800 dark:text-slate-200 font-medium">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

---

## 11. 📈 Charts: Recharts Glass Tooltip & Radiant Gradients

```jsx
import React from 'react';

export const CustomGlassTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-white/30 dark:border-white/20 shadow-2xl backdrop-blur-xl text-xs">
        <span className="font-mono font-bold text-slate-500 dark:text-slate-400 block mb-1">{label}</span>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400">
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{entry.name}: {entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
```

---

## 12. ⚙️ Tailwind Configuration (`tailwind.config.js`)

Save this file as `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
```

---

## 13. 📦 Package Dependencies (`package.json`)

Install these dependencies for React:

```bash
npm install lucide-react framer-motion recharts clsx tailwind-merge
```

