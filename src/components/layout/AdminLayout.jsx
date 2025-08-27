import { useState, memo, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RoleVerificationOverlay from '../ui/RoleVerificationOverlay';

// Memoize the entire layout for performance
const AdminLayout = memo(function AdminLayout() {
  const { user, role, signOut, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Track verification state to prevent multiple redirects
  const [verificationState, setVerificationState] = useState({
    verified: false,
    inProgress: false,
    retryCount: 0
  });
  
  // Verify admin role on mount and location change with additional safeguards
  useEffect(() => {
    // Skip if we've already verified and nothing changed
    if (verificationState.verified && role === 'admin') {
      return;
    }
    
    // Limit retry attempts to prevent infinite loops
    if (verificationState.retryCount > 3) {
      console.error('Too many verification attempts, forcing logout');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      navigate('/login');
      return;
    }
    
    // Prevent multiple verification attempts running concurrently
    if (verificationState.inProgress) {
      return;
    }
    
    const verifyAdminAccess = async () => {
      setVerificationState(prev => ({ ...prev, inProgress: true }));
      
      // Only check when loading is complete
      if (isLoading) {
        setVerificationState(prev => ({ ...prev, inProgress: false }));
        return; // Wait until loading is complete
      }
      
      // Get cached role first as a backup
      const cachedRole = localStorage.getItem('user_role');
      console.log(`Verifying admin access - Current role: ${role}, Cached role: ${cachedRole}`);
      
      // First check: We have a role and it's admin - all good!
      if (role === 'admin') {
        console.log('Role is admin, access granted');
        setVerificationState({
          verified: true,
          inProgress: false,
          retryCount: 0
        });
        return;
      }
      
      // Second check: If role is not admin but cached role is admin,
      // this could be due to tab switching, so use the cached role
      if (role !== 'admin' && cachedRole === 'admin') {
        console.warn('Current role is not admin but cached role is admin. Using cached role.');
        // Don't redirect - the auth context should pick up the cached role
        // and re-render with the correct role
        setVerificationState(prev => ({
          ...prev,
          inProgress: false,
          retryCount: prev.retryCount + 1
        }));
        return;
      }
      
      // Third check: If we have a non-admin role, this user doesn't have access
      if (role && role !== 'admin') {
        console.warn(`User has role ${role}, which is not admin. Redirecting to login.`);
        localStorage.removeItem('user_role');
        navigate('/login');
        return;
      }
      
      // Final check: No user = no access
      if (!isLoading && !user) {
        console.warn('No authenticated user, redirecting to login');
        localStorage.removeItem('user_role');
        navigate('/login');
      }
      
      setVerificationState(prev => ({
        ...prev,
        inProgress: false,
        retryCount: prev.retryCount + 1
      }));
    };
    
    verifyAdminAccess();
  }, [role, navigate, isLoading, user, verificationState.verified, verificationState.inProgress, verificationState.retryCount]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Memoize navigation items to prevent unnecessary recalculations
  const navigation = useMemo(() => [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: DashboardIcon,
      current: location.pathname === '/admin/dashboard'
    },
    { 
      name: 'Users Management', 
      path: '/admin/users', 
      icon: UserGroupIcon,
      current: location.pathname === '/admin/users',
      adminOnly: true
    },
    { 
      name: 'Patients', 
      path: '/admin/patients', 
      icon: UsersIcon,
      current: location.pathname === '/admin/patients' || location.pathname.startsWith('/admin/patients/')
    },
    { 
      name: 'Departments', 
      path: '/admin/departments', 
      icon: OfficeBuildingIcon,
      current: location.pathname === '/admin/departments'
    },
    { 
      name: 'Predictions', 
      path: '/admin/predictions', 
      icon: LightningBoltIcon,
      current: location.pathname === '/admin/predictions' || location.pathname.startsWith('/admin/predictions/')
    },
    { 
      name: 'Models', 
      path: '/admin/models', 
      icon: CubeIcon,
      current: location.pathname === '/admin/models',
      adminOnly: true
    },
    { 
      name: 'Batch Jobs', 
      path: '/admin/batch-jobs', 
      icon: ServerIcon,
      current: location.pathname === '/admin/batch-jobs',
      adminOnly: true
    },
    { 
      name: 'Audit Logs', 
      path: '/admin/audit-logs', 
      icon: DocumentTextIcon,
      current: location.pathname === '/admin/audit-logs',
      adminOnly: true
    },
    { 
      name: 'Reports & Analytics', 
      path: '/admin/analytics', 
      icon: ChartBarIcon,
      current: location.pathname === '/admin/analytics'
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: CogIcon,
      current: location.pathname === '/admin/settings',
      adminOnly: true
    }
  ], [location.pathname]);

  // Show loading overlay during authentication check - this needs to be fast!
  if (isLoading) {
    return <RoleVerificationOverlay role="admin" isRecovering={false} />;
  }
  
  // Also show loading during role verification, but with a quick-recovery flag
  // to signal this should be a fast process
  if (verificationState.inProgress && !verificationState.verified) {
    return <RoleVerificationOverlay role="admin" isRecovering={true} />;
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 flex md:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white shadow-xl shadow-gray-500/50 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-[8px] after:bg-gradient-to-r after:from-transparent after:via-gray-300/70 after:to-gray-400/50 after:content-['']">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-shrink-0 flex items-center px-4 border-b border-gray-100 pb-4">
              <img
                className="h-8 w-auto"
                src="/relyloop.svg"
                alt="RelyLoop"
              />
              <div className="ml-2">
                <span className="text-xl font-bold text-gray-800 font-montserrat-alternates">RelyLoop</span>
                <div className="text-xs bg-blue-800 text-white px-2 py-0.5 rounded inline-block ml-2">Healthcare</div>
              </div>
            </div>
            
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation
                  .filter(item => !item.adminOnly || role === 'admin')
                  .map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`${
                        item.current
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-blue-100 hover:shadow'
                      } group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-all duration-150`}
                    >
                      <item.icon
                        className={`${
                          item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-400'
                        } mr-4 flex-shrink-0 h-5 w-5`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                  
                {/* Debug button only visible in development mode */}
                {import.meta.env.DEV && (
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <button
                      onClick={() => {
                        console.group('Auth Debug Information');
                        console.log('Current user:', user);
                        console.log('Current role:', role);
                        console.log('Is loading:', isLoading);
                        console.log('Local storage - user_role:', localStorage.getItem('user_role'));
                        console.log('Local storage - user_data:', localStorage.getItem('user_data'));
                        console.log('Session storage - redirectPath:', sessionStorage.getItem('redirectPath'));
                        console.groupEnd();
                        
                        // Call the diagnose function if available
                        import('../../utils/diagnostics').then(module => {
                          const results = module.diagnoseAuthIssues({ user, role, isLoading, error: null });
                          console.log('Complete Auth Diagnostics:', results);
                          alert('Auth diagnostics logged to console. Check browser developer tools.');
                        }).catch(err => console.error('Failed to load diagnostics:', err));
                      }}
                      className="w-full flex items-center justify-center px-2 py-1 text-xs text-white bg-blue-700 rounded hover:bg-blue-600 shadow-sm transition-colors duration-150"
                    >
                      <span className="mr-2">📊</span>
                      Debug Auth State
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 relative after:absolute after:top-0 after:right-0 after:bottom-0 after:w-[6px] after:bg-gradient-to-r after:from-transparent after:to-gray-200/70 after:content-[''] border-r border-gray-100">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-100">
              <img
                className="h-8 w-auto"
                src="/relyloop.svg"
                alt="RelyLoop"
              />
              <div className="ml-2">
                <span className="text-xl font-bold text-black font-montserrat-alternates">RelyLoop</span>
                <div className="text-xs bg-blue-800 text-white px-2 py-0.5 rounded inline-block ml-2">Healthcare</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50/50">
              <nav className="flex-1 px-2 py-4 bg-white/80">
                {navigation
                  .filter(item => !item.adminOnly || role === 'admin')
                  .map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`${
                        item.current
                          ? 'bg-blue-900 text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                      } group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors duration-150`}
                    >
                      <item.icon
                        className={`${
                          item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-400'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <h1 className="text-xl text-gray-800 font-semibold">
                      {navigation.find(item => item.current)?.name || 'RelayLoop'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="group relative">
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    id="user-menu"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="ml-2 text-gray-700">{user?.email || 'User'}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                      {role || 'User'}
                    </span>
                  </button>
                  <div className="hidden group-hover:block origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <Outlet />
          {/* Debug component in development mode */}
          {import.meta.env.DEV && import.meta.env.VITE_DEBUG_ADMIN_DASHBOARD && (
            <div className="fixed bottom-4 right-4 p-3 bg-indigo-700 text-white text-xs rounded-lg shadow-lg z-50">
              <div>Role: {role || 'Not set'}</div>
              <div>Path: {location.pathname}</div>
              <div>UID: {user?.id?.substring(0,8) || 'Not authenticated'}</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
});

// Export the memoized component
export default AdminLayout;

// Memoized icons for better performance
const DashboardIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
));

const UsersIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
));

const UserGroupIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
));

const ChartBarIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
));

const CogIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
));

const MenuAlt2Icon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
));

const BellIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
));

const XIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
));

const OfficeBuildingIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
));

const LightningBoltIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
));

const CubeIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
));

const ServerIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
));

const DocumentTextIcon = memo(({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
));
