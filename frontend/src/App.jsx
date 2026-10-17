import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Forecast from './pages/Forecast';
import Inventory from './pages/Inventory';
import DelayRisk from './pages/DelayRisk';
import Analytics from './pages/Analytics';
import ModelPerformance from './pages/ModelPerformance';
import Landing from './pages/Landing';
import { ThemeProvider } from './lib/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Main Control Center Dashboard under root / */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="delays" element={<DelayRisk />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="models" element={<ModelPerformance />} />
            <Route path="model-performance" element={<ModelPerformance />} />
          </Route>

          {/* Control Center Dashboard under /dashboard */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="delays" element={<DelayRisk />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="models" element={<ModelPerformance />} />
            <Route path="model-performance" element={<ModelPerformance />} />
          </Route>

          {/* 3D Interactive Landing Page available at /landing */}
          <Route path="/landing" element={<Landing />} />

          {/* Fallback routes for direct sub-paths */}
          <Route path="/overview" element={<Navigate to="/" replace />} />
          <Route path="/forecast" element={<Navigate to="/forecast" replace />} />
          <Route path="/inventory" element={<Navigate to="/inventory" replace />} />
          <Route path="/delays" element={<Navigate to="/delays" replace />} />
          <Route path="/analytics" element={<Navigate to="/analytics" replace />} />
          <Route path="/models" element={<Navigate to="/models" replace />} />
          <Route path="/model-performance" element={<Navigate to="/models" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
