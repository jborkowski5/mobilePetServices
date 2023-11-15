// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { AuthProvider } from './components/AuthContext'; // Import the AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
