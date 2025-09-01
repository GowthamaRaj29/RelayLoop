import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/forms/LoginForm';
import { RouteDebugger } from '../components/debug/RouteDebugger';

export default function Login() {
  const { user, role, department, isLoading, error, signOut } = useAuth();
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
        console.log("Login: Authenticated user detected", { hasRole: !!role, role });
        
        // Try to get a cached role first if current role is null
        let effectiveRole = role;
        
        if (!effectiveRole) {
          const cachedRole = localStorage.getItem('user_role');
          console.log("Login: No current role, checking cached role:", cachedRole);
          if (cachedRole) {
            effectiveRole = cachedRole;
            console.log("Login: Using cached role:", effectiveRole);
          }
        } else {
          // We have a role, make sure it's cached
          localStorage.setItem('user_role', role);
        }
        
        // For department handling, we need to use what's already in the hook scope
        if ((role === 'nurse' || role === 'doctor' || 
            effectiveRole === 'nurse' || effectiveRole === 'doctor')) {
          // Cache department if available
          if (department) {
            localStorage.setItem('user_department', department);
            console.log("Login: Caching department:", department);
          } else {
            // Try to get department from cache
            const cachedDepartment = localStorage.getItem('user_department');
            if (cachedDepartment) {
              console.log("Login: Using cached department:", cachedDepartment);
            }
          }
        }
        
        // Check if there's a saved redirect path
        const redirectPath = sessionStorage.getItem('redirectPath');
        
        if (redirectPath) {
          // Clear it so we don't redirect again on subsequent navigations
          sessionStorage.removeItem('redirectPath');
          console.log("Redirecting to previously requested page:", redirectPath);
          navigate(redirectPath);
        } else if (effectiveRole) {
          // Always make sure the role is cached for persistence
          localStorage.setItem('user_role', effectiveRole);
          console.log("Redirecting to dashboard based on role:", effectiveRole);
          
          switch(effectiveRole) {
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
              // Show error alert for unknown role
              console.warn('Unknown user role:', effectiveRole);
              setRenderError("Your account doesn't have a recognized role. Please contact an administrator.");
              // Sign out the user if they have an unrecognized role
              localStorage.removeItem('user_role');
              signOut?.();
              return;
          }
        } else {
          // User has authenticated but no specific role was determined
          console.warn('No role determined for authenticated user');
          // Try cached role one more time before giving up
          const cachedRole = localStorage.getItem('user_role');
          if (cachedRole) {
            console.log('Using cached role as fallback:', cachedRole);
            switch(cachedRole) {
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
                break;
            }
            return;
          }
          
          // Show error for users without roles
          setRenderError("Your account doesn't have a role assigned. Please contact an administrator.");
          // Sign out the user
          localStorage.removeItem('user_role');
          signOut?.();
        }
      }
    } catch (err) {
      console.error('Error in navigation effect:', err);
      setRenderError(err.message);
    }
  }, [user, role, department, isLoading, navigate, signOut]);
  
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
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900 font-montserrat-alternates">
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