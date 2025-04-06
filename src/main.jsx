/**
 * main.jsx
 * -----------------------------
 * Entry point of the Film Fusion React application.
 *
 * Responsibilities:
 * - Imports global styles and Bulma CSS framework
 * - Initializes the React app by rendering <App /> into the DOM
 * - Wraps the app in <React.StrictMode> to enable additional checks during development
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global and external styles
import './styles.css';
import 'bulma/css/bulma.min.css';

// Mount the root of the app to the HTML element with id="root"
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
