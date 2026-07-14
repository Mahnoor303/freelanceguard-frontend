import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App.jsx';
import './index.css';

// ===== Redirect if URL doesn't start with basename =====
const basename = '/freelanceguard-frontend';
if (!window.location.pathname.startsWith(basename)) {
  window.location.replace(basename + window.location.pathname + window.location.search + window.location.hash);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={basename}>
      <HashRouter>
        <App />
      </HashRouter>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);