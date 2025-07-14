import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Import Bootstrap SCSS
import 'bootstrap/scss/bootstrap.scss';
// Import custom CSS
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);