import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RouteDebugger } from '../components/debug/RouteDebugger';

export default function PrivateRoute({ allowedRoles = [] }) {
  const { user, role, isLoading } = useAuth();
  
  // If still checking auth status, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role is not included, redirect to unauthorized
  if (allowedRoles.length > 0) {
    // If role is null/undefined, we can't authorize the user
    if (!role) {
      console.warn('User authenticated but has no role assigned');
      return <Navigate to="/unauthorized" replace state={{ 
        message: "Your account doesn't have a role assigned. Please contact an administrator." 
      }} />;
    }
    
    // If user's role is not in the allowed roles list
    if (!allowedRoles.includes(role)) {
      console.warn(`User role (${role}) not in allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // If authenticated and authorized, render the child routes
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <RouteDebugger />}
    </>
  );
}
