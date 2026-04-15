import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a26', color: '#fff', border: '1px solid #2e2e48', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#e8b930', secondary: '#0a0a0f' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
