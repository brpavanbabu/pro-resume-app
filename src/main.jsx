import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Tailwind Config (Injected style for simplicity in single-file setup)
const style = document.createElement('style');
style.textContent = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  body { margin: 0; font-family: system-ui, sans-serif; background-color: #f1f5f9; }
  @media print {
    @page { margin: 0; size: auto; }
    body { background: white; }
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

