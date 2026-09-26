import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/pact.css';
import './styles/site.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Could not find #root to mount to');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
