import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

// Purge rogue extension containers on initial mount
const purgeExtensionContainers = () => {
  document.querySelectorAll('.extension-embed-container, [id^="extension-root"]').forEach((el) => {
    // Keep it non-destructive or hide it
    el.style.setProperty('display', 'none', 'important');
  });
};
purgeExtensionContainers();

// Mount to #supplychain-app so third-party extensions hardcoded to hijack #root on localhost:3000 cannot destroy our DOM tree
const container = document.getElementById('supplychain-app') || document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
