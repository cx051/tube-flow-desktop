
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a preconnect link for Google Fonts to optimize loading
const preconnect1 = document.createElement('link');
preconnect1.rel = 'preconnect';
preconnect1.href = 'https://fonts.googleapis.com';
document.head.appendChild(preconnect1);

const preconnect2 = document.createElement('link');
preconnect2.rel = 'preconnect';
preconnect2.href = 'https://fonts.gstatic.com';
preconnect2.crossOrigin = 'anonymous';
document.head.appendChild(preconnect2);

// Append the modified title
const originalTitle = document.title;
document.title = `${originalTitle} - Red Theme`;

createRoot(document.getElementById("root")!).render(<App />);
