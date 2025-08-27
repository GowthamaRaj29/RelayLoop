import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/forms/LoginForm';
import { RouteDebugger } from '../components/debug/RouteDebugger';

export default function Login() {
  const { user, role, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [renderError, setRenderError] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout to avoid infinite loading state
  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);
  
  // Only log in development mode and only critical information
  if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH) {
    console.debug("Login component rendering", { 
      authenticated: !!user, 
      role, 
      isLoading
    });
  }
  
  // Error boundary for the component
  useEffect(() => {
    try {
      // Validate that our auth context is working
      if (!useAuth) {
        throw new Error('Auth context not available');
      }
      
      // Additional debugging for auth state
      if (error) {
        console.warn('Auth system reported an error:', error);
      }
    } catch (err) {
      console.error('Error in Login component:', err);
      setRenderError(err.message);
    }
  }, [error]);
  
  // Redirect based on role if already authenticated
  useEffect(() => {
    try {
      if (!isLoading && user) {
        if (role) {
          console.log("Redirecting to dashboard based on role:", role);
          switch(role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'doctor':
              navigate('/doctor/patients');
              break;
            case 'nurse':
              navigate('/nurse/patients');
              break;
            default:
              // Fallback to a common dashboard if role is unknown
              console.warn('Unknown user role:', role);
              navigate('/dashboard');
          }
        } else {
          // User has authenticated but no specific role was determined
          // Instead of showing an error, we'll direct them to a generic dashboard
          // and let the backend/permissions handle access control
          console.debug('Using default user role for authenticated user');
          
          // Route to a generic dashboard for users without specific roles
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Error in navigation effect:', err);
      setRenderError(err.message);
    }
  }, [user, role, isLoading, navigate]);
  
  // Display render errors if any
  if (renderError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-700 text-xl font-medium mb-3">Application Error</h2>
          <p className="text-red-600">An error occurred while rendering the login page: {renderError}</p>
          <p className="mt-4 text-sm text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }
  
  // The state and effect have been moved to the top of the component

  // If still checking auth status, show loading with potential timeout
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Checking authentication status...</p>
        
        {/* Show retry button if loading takes too long */}
        {loadingTimeout && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Loading taking too long? Click to retry
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/relyloop.svg"
            alt="RelyLoop Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900 font-family: 'Montserrat Alternates', sans-serif;">
            Sign in to RelyLoop
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hospital Readmission Prediction
          </p>
        </div>
        
        <LoginForm />
      </div>
      {/* Add RouteDebugger in development only */}
      <RouteDebugger />
    </div>
  );
}