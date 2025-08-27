import React, { Component, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes';
import { runAllDiagnostics } from './utils/diagnostics';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Run diagnostics when app starts
  useEffect(() => {
    // Check environment variables and browser compatibility
    const diagnostics = runAllDiagnostics({
      auth: true,
      router: true,
      queryClient: true
    });

    // Log the complete diagnostics object
    console.log('Application diagnostics:', diagnostics);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

// Simple Error Boundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
          <p className="text-gray-800 mb-6">{this.state.error?.message || "An error occurred while loading the application."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;
