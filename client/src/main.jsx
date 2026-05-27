import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { InvoiceDraftProvider } from './context/InvoiceDraftContext'
import ErrorBoundary from './components/ErrorBoundary'

console.log('[DEBUG] main.jsx starting...');

const rootElement = document.getElementById('root');
console.log('[DEBUG] root element:', rootElement);

if (!rootElement) {
  console.error('[FATAL] Root element not found!');
  document.body.innerHTML = '<div style="color:red;padding:2rem;text-align:center;font-family:sans-serif;"><h2>Lỗi: Không tìm thấy root element</h2></div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <InvoiceDraftProvider>
            <App />
          </InvoiceDraftProvider>
        </ErrorBoundary>
      </React.StrictMode>,
    );
    console.log('[DEBUG] React render called successfully');
  } catch (err) {
    console.error('[FATAL] React mount failed:', err);
    rootElement.innerHTML = `<div style="color:red;padding:2rem;text-align:center;font-family:sans-serif;">
      <h2>Lỗi khởi động ứng dụng</h2>
      <pre style="background:#f3f4f6;padding:1rem;border-radius:0.5rem;text-align:left;overflow:auto;">${err.message}\n${err.stack}</pre>
    </div>`;
  }
}