import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { NotificacoesProvider } from './context/NotificacoesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificacoesProvider>
          <App />
        </NotificacoesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);