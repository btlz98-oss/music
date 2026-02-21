import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    try {
      const registration = await navigator.serviceWorker.register(swUrl);
      await registration.update();

      let isRefreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isRefreshing) return;
        isRefreshing = true;
        window.location.reload();
      });
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}
