import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { RouteDebugger } from '../debug/RouteDebugger';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RoleVerificationOverlay from '../ui/RoleVerificationOverlay';

// (Debounce utility removed; guarded effects handle churn safely)

// Icons
// (Removed unused HomeIcon)

function PatientIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function VitalsIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

PatientIcon.propTypes = { className: PropTypes.string };
VitalsIcon.propTypes = { className: PropTypes.string };
LogoutIcon.propTypes = { className: PropTypes.string };
MenuIcon.propTypes = { className: PropTypes.string };
CloseIcon.propTypes = { className: PropTypes.string };

export default function NurseLayout() {
  // Get auth context with role and department
  const { user, role, department, signOut, isLoading } = useAuth();
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use ref to track previous values and avoid unnecessary state updates
  const prevValuesRef = useRef({ 
    role, 
    department, 
    verificationCount: 0 
  });
  
  // Initialize with either context department, localStorage department, or empty string
  const initialDepartment = department || localStorage.getItem('user_department') || '';
  const [currentDepartment, setCurrentDepartment] = useState(initialDepartment);
  
  // Fast-path for role verification - initialize with cached values if possible
  const initialVerified = role === 'nurse' || localStorage.getItem('user_role') === 'nurse';
  
  // Verification state for nurse role
  const [verificationState, setVerificationState] = useState({
    verified: initialVerified,
    inProgress: false,
    retryCount: 0
  });
  
  // Verification is handled inside the effect below with strict guards
  
  // Verify nurse role on mount and location change - with proper dependency management
  useEffect(() => {
    // Skip execution if loading
    if (isLoading) {
      return;
    }
    
    // Early return if already verified and user is a nurse
    if (verificationState.verified && (role === 'nurse' || user?.role === 'nurse')) {
      return;
    }
    
    // Use the ref to track verification count and prevent too many re-renders
    if (prevValuesRef.current.verificationCount > 5) {
      console.warn('Too many verification attempts, suppressing further checks');
      return;
    }
    
    // Update the verification count
    prevValuesRef.current = {
      ...prevValuesRef.current,
      verificationCount: prevValuesRef.current.verificationCount + 1
    };
    
    // Check for too many retries in state
    if (verificationState.retryCount > 3) {
      console.error('Too many verification attempts, forcing logout');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_department');
      navigate('/login');
      return;
    }
    
    // If verification is already in progress, don't start another verification
    if (verificationState.inProgress) {
      return;
    }
    
    // Store department value in a ref to avoid dependency cycle
    const verifyNurseAccess = async () => {
      // Set verification state to in progress BEFORE doing anything else
      setVerificationState(prev => ({ ...prev, inProgress: true }));
      
      // Check role directly from context OR from localStorage as a backup
      const roleFromContext = role || user?.role;
      const roleFromStorage = localStorage.getItem('user_role');
      
      // Skip verification if role hasn't changed since last check
      if (roleFromContext === prevValuesRef.current.role && 
          roleFromContext === 'nurse' &&
          verificationState.verified) {
        console.log('NurseLayout: Role unchanged, skipping verification');
        setVerificationState(prev => ({ ...prev, inProgress: false }));
        return;
      }
      
      // Update stored role in ref
      prevValuesRef.current = {
        ...prevValuesRef.current,
        role: roleFromContext
      };
      
      console.log('NurseLayout: Verifying role', { 
        roleFromContext, 
        roleFromStorage,
        hasUser: !!user,
        role,
        userRole: user?.role,
        verificationCount: prevValuesRef.current.verificationCount
      });
      
      // Use either role from context or from localStorage
      const effectiveRole = roleFromContext || roleFromStorage;
      
      if (effectiveRole !== 'nurse') {
        console.warn('User is not a nurse (role: ' + effectiveRole + '), redirecting to login');
        await signOut();
        navigate('/login');
        return;
      }
      
      // If we made it here, the user is a nurse
      console.log('NurseLayout: User verified as nurse');
      
      // Set verified to true BEFORE doing anything else
      setVerificationState({
        verified: true,
        inProgress: false,
        retryCount: 0
      });
    };
    
    verifyNurseAccess();
    // Minimized dependencies to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, role, isLoading, navigate, signOut, verificationState.verified, verificationState.inProgress, verificationState.retryCount]);
  
  // Separate useEffect for department handling
  useEffect(() => {
    // Skip if loading or not verified
    if (isLoading || !verificationState.verified) {
      return;
    }
    
    // Get the effective department
    const effectiveDepartment = department || localStorage.getItem('user_department');
    
    // Skip if department hasn't changed since last check
    if (effectiveDepartment === prevValuesRef.current.department && 
        effectiveDepartment === currentDepartment) {
      return;
    }
    
    // Update department in ref
    prevValuesRef.current = {
      ...prevValuesRef.current,
      department: effectiveDepartment
    };
    
    // Only update if effective department exists and is different
    if (effectiveDepartment && effectiveDepartment !== currentDepartment) {
      console.log('NurseLayout: Updating department to', effectiveDepartment);
      setCurrentDepartment(effectiveDepartment);
      localStorage.setItem('user_department', effectiveDepartment);
    }
  }, [department, currentDepartment, isLoading, verificationState.verified]);
  
  // Close profile dropdown when clicking elsewhere
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // This useEffect is now handled by the one above - Empty dependency array means it runs only once on mount
  useEffect(() => {
    // If no department is set from any source, use a default (for development only)
    if (!currentDepartment && !department && !localStorage.getItem('user_department')) {
      if (import.meta.env.DEV) {
        console.log('NurseLayout: Using default department for development');
        const defaultDepartment = 'Cardiology';
        setCurrentDepartment(defaultDepartment);
        localStorage.setItem('user_department', defaultDepartment);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle logout
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Centralized navigation items for reuse (mobile + desktop)
  const navigation = useMemo(() => [
    {
      name: 'Patients',
      path: '/nurse/patients',
      icon: PatientIcon,
      current: location.pathname === '/nurse/patients' || location.pathname.includes('/nurse/patients/')
    },
    {
      name: 'Record Vitals',
      path: '/nurse/vitals',
      icon: VitalsIcon,
      current: location.pathname === '/nurse/vitals'
    }
  ], [location.pathname]);
  
  // If loading, show spinner with nurse role indicator
  if (isLoading) {
    return <LoadingSpinner role="nurse" department={currentDepartment || department} />;
  }
  
  // Show verification overlay if not verified yet
  if (!verificationState.verified && !verificationState.inProgress) {
    return <RoleVerificationOverlay 
      role="nurse" 
      isRecovering={true} 
      department={currentDepartment || department} 
    />;
  }
  
  return (
    <div className="nurse-ui h-full bg-gray-50">
      {/* Mobile sidebar overlay (no external UI libs) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Accessible backdrop as a button */}
          <button
            type="button"
            aria-label="Close sidebar"
            className={`fixed inset-0 bg-gray-900/60 transition-opacity ease-in-out duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-blue-700 shadow-xl transition-all duration-300 ease-in-out transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-blue-600">
              <div className="flex items-center">
                <img src="/relyloop.svg" alt="RelyLoop" className="h-8 w-auto" />
                <span className="ml-2 px-2 py-1 text-xs bg-white text-blue-700 rounded-lg">Nurse</span>
              </div>
              <button
                type="button"
                className="p-2 rounded-full bg-blue-600/40 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 h-0 overflow-y-auto">
              <nav className="px-3 pt-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      item.current
                        ? 'bg-blue-800 text-white shadow-sm'
                        : 'text-white/90 hover:bg-blue-600 hover:text-white'
                    } group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-150`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-blue-200" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-blue-800 p-4 bg-blue-700/80">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'N'}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">Nurse {user?.email?.split('@')[0] || 'User'}</p>
                  <button
                    className="text-sm font-medium text-blue-200 hover:text-white flex items-center"
                    onClick={handleSignOut}
                  >
                    <LogoutIcon className="h-4 w-4 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img src="/relyloop.svg" alt="RelyLoop" className="h-8 w-auto" />
              <span className="ml-2 px-2 py-1 text-xs bg-white text-blue-700 rounded-lg">Nurse</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${item.current ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-blue-300" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-blue-800 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'N'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Nurse {user?.email?.split('@')[0] || 'User'}</p>
                <button
                  className="text-xs font-medium text-blue-200 hover:text-white flex items-center"
                  onClick={handleSignOut}
                >
                  <LogoutIcon className="h-3 w-3 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Department selector */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <label htmlFor="department" className="sr-only">
                    Department
                  </label>
                  <div className="flex items-center bg-white px-4 py-2 rounded-md border border-gray-300 shadow-sm">
                    <span className="text-sm font-medium text-gray-700">Department:</span>
                    <span className="ml-2 text-sm text-blue-600 font-semibold">
                      {currentDepartment || department || 'Not assigned'}
                    </span>
                  </div>
                </div>
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 lg:rounded-md lg:hover:bg-gray-50"
                    id="user-menu-button"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'N'}
                      </span>
                    </div>
                    <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                      <span className="sr-only">Logged in as </span>
                      {user?.name || user?.email?.split('@')[0] || 'Nurse User'}
                    </span>
                    <svg 
                      className="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      aria-hidden="true"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Signed in as <span className="font-medium">{user?.email || 'nurse@relayloop.com'}</span>
                      </div>
                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-2"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Outlet context={[currentDepartment, setCurrentDepartment]} />
              </div>
            </div>
            
            {/* Debug only - remove in production */}
            {import.meta.env.DEV && (
              <div className="fixed bottom-2 right-2 z-50">
                <RouteDebugger />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
