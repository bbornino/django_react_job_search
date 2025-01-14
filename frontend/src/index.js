import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider authType="cookie" authName="_auth" 
                cookieDomain={window.location.hostname} cookieSecure={false}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </AuthProvider>
);
