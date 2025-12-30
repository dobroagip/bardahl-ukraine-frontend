
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { HelmetProvider } from 'react-helmet-async';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-bold uppercase tracking-widest animate-pulse">Bardahl Loading...</div>}>
          <App />
        </Suspense>
      </LanguageProvider>
    </HelmetProvider>
  </React.StrictMode>
);
