import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App.jsx';
import './index.css';   // 👈 THIS IS THE MISSING IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>   {/* no basename for local dev */}
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);