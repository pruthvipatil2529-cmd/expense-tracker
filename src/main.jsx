// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TransactionProvider } from './context/TransactionContext.jsx'; // Import the new provider
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <TransactionProvider> {/* Wrap the App in the provider */}
      <App />
    </TransactionProvider>
    </AuthProvider>
  </React.StrictMode>,
);