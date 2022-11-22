import React from 'react';
import ReactDOM from 'react-dom/client';
import { EthProvider } from "./contexts/EthContext";
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <EthProvider>
    <App />
  </EthProvider>
);
