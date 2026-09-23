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
          {/* 3D Interactive Landing Page as default root */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

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

          {/* Fallback routes for direct sub-paths */}
          <Route path="/overview" element={<Navigate to="/dashboard" replace />} />
          <Route path="/forecast" element={<Navigate to="/dashboard/forecast" replace />} />
          <Route path="/inventory" element={<Navigate to="/dashboard/inventory" replace />} />
          <Route path="/delays" element={<Navigate to="/dashboard/delays" replace />} />
          <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
          <Route path="/models" element={<Navigate to="/dashboard/models" replace />} />
          <Route path="/model-performance" element={<Navigate to="/dashboard/models" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
