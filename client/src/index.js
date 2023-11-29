import React from 'react';
import App from './components/App';
import './index.css';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './components/AuthContext'; // Import the AuthProvider

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
