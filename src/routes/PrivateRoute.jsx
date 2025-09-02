import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { RouteDebugger } from '../components/debug/RouteDebugger';
import RoleVerificationOverlay from '../components/ui/RoleVerificationOverlay';

export default function PrivateRoute({ allowedRoles = [] }) {
  const { user, role, isLoading } = useAuth();
  const cachedRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  
  // If still checking auth status, show enhanced loading UI
  if (isLoading) {
    // Determine the role to display in the loading overlay
    // First check the current URL for hints about expected role
    const path = window.location.pathname;
    let expectedRole = 'user';
    
    if (path.startsWith('/admin')) {
      expectedRole = 'admin';
    } else if (path.startsWith('/doctor')) {
      expectedRole = 'doctor';
    } else if (path.startsWith('/nurse')) {
      expectedRole = 'nurse';
    }
    
    // Now check cached role and see if it matches path expectation
    const cachedRole = localStorage.getItem('user_role');
    const isRoleMismatch = cachedRole && cachedRole !== expectedRole && expectedRole !== 'user';
    
    // Use cached role if available and consistent with path, otherwise use path expectation
    const displayRole = cachedRole || expectedRole;
    
    // If there's a mismatch, we're recovering from an incorrect role state
    return <RoleVerificationOverlay role={displayRole} isRecovering={isRoleMismatch} />;
  }
  
  // If not logged in, redirect to login but save current location
  if (!user) {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectPath', currentPath);
    }
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role is not included, redirect to login
  if (allowedRoles.length > 0 && !isLoading) {
    console.log(`Checking route access - User role: ${role || 'none'}, Allowed roles:`, allowedRoles);
    
    // Special handling for admin paths to ensure role persistence
    const isAdminPath = window.location.pathname.startsWith('/admin');
    
    if (isAdminPath && cachedRole === 'admin' && role !== 'admin') {
      console.warn('Route is admin path but current role is not admin. Cached role is admin. Attempting role recovery...');
      
      // Don't redirect yet, let the component remount with the recovered role
      // This avoids unnecessary redirects when tab switching
      return <RoleVerificationOverlay role="admin" isRecovering={true} />;
    }
    
    // Normal role checking
    if (!role || !allowedRoles.includes(role)) {
      console.warn(`User role (${role || 'none'}) not authorized for this route. Redirecting to login.`);
      
      // If we have a cached role that matches, show recovery overlay instead of redirecting immediately
      if (cachedRole && allowedRoles.includes(cachedRole)) {
        return <RoleVerificationOverlay role={cachedRole} isRecovering={true} />;
      }
      
      // Only clear role if there's a definite mismatch, not during loading
      if (!isLoading) {
        localStorage.removeItem('user_role');
        sessionStorage.removeItem('redirectPath');
      }
      
      return <Navigate to="/login" replace />;
    }
  }
  
  // If authenticated and authorized, render the child routes
  // But first check if we're at a root path that should be redirected to a role-specific page
  if (window.location.pathname === '/dashboard' || window.location.pathname === '/') {
    // Redirect to the appropriate dashboard based on role
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'doctor') {
      return <Navigate to="/doctor/patients" replace />;
    } else if (role === 'nurse') {
      return <Navigate to="/nurse/patients" replace />;
    } else {
      // For any other role or undefined role, send back to login
      localStorage.removeItem('user_role');
      return <Navigate to="/login" replace />;
    }
  }
  
  return (
    <>
      <Outlet />
      {/* {import.meta.env.DEV && <RouteDebugger />} */}
    </>
  );
}
