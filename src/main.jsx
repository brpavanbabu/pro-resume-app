import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Tailwind Config
const style = document.createElement('style');
style.textContent = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  body { margin: 0; font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
  
  /* Typography Classes */
  .font-modern { font-family: 'Inter', sans-serif; }
  .font-classic { font-family: 'Merriweather', serif; } /* LaTeX Style */
  .font-elegant { font-family: 'Playfair Display', serif; }
  
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

