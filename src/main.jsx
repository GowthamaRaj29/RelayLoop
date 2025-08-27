import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './font.css'; // Import the custom font CSS
import App from './App.jsx';

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // You could send this to a logging service in production
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You could send this to a logging service in production
});

// Initialize the app with error handling
try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Failed to find the root element. The app cannot be mounted.');
  }
  
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('Application successfully mounted');
} catch (error) {
  console.error('Failed to render the application:', error);
  
  // Display a fallback UI when the application fails to mount
  const rootElement = document.getElementById('root') || document.body;
  rootElement.innerHTML = `
    <div style="
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 0 20px;
    ">
      <h1 style="color: #4f46e5; font-size: 1.5rem; margin-bottom: 1rem;">
        RelayLoop - Application Error
      </h1>
      <p style="color: #1f2937; margin-bottom: 1.5rem;">
        We're sorry, but the application couldn't be loaded. Please try refreshing the page.
      </p>
      <p style="color: #6b7280; font-size: 0.875rem;">
        Error: ${error.message || 'Unknown error'}
      </p>
      <button onclick="window.location.reload()" style="
        background-color: #4f46e5;
        color: white;
        border: none;
        border-radius: 0.375rem;
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
        cursor: pointer;
        margin-top: 1.5rem;
      ">
        Reload Application
      </button>
    </div>
  `;
}
