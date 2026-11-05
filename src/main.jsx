import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/latin-300.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import './style.css';
import App from './App.jsx';

document.documentElement.classList.add('js', 'loading');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
