import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import 'bulma/css/bulma.min.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);