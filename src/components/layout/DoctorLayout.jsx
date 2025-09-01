import { useState, useEffect, useRef, Fragment } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../hooks/useAuth';
import { RouteDebugger } from '../debug/RouteDebugger';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import RoleVerificationOverlay from '../ui/RoleVerificationOverlay';

// Icons
function DashboardIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function PatientIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function PredictionIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={props.className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

export default function DoctorLayout() {
  const { user, role, department, signOut, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // We'll use department from Auth context, but need a state for the Outlet context
  const [currentDepartment, setCurrentDepartment] = useState(department || '');
  
  // Verification state for doctor role
  const [verificationState, setVerificationState] = useState({
    verified: false,
    inProgress: false,
    retryCount: 0
  });
  
  // Verify doctor role on mount and location change
  useEffect(() => {
    if (verificationState.verified && role === 'doctor') {
      return;
    }
    
    if (verificationState.retryCount > 3) {
      console.error('Too many verification attempts, forcing logout');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_department');
      navigate('/login');
      return;
    }
    
    if (verificationState.inProgress) {
      return;
    }
    
    const verifyDoctorAccess = async () => {
      setVerificationState(prev => ({ ...prev, inProgress: true }));
      
    if (isLoading) {
        setVerificationState(prev => ({ ...prev, inProgress: false }));
        return;
      }

    if (role !== 'doctor') {
        console.warn('User is not a doctor, redirecting to login');
        await signOut();
        navigate('/login');
        return;
      }
      
      setVerificationState({
        verified: true,
        inProgress: false,
        retryCount: 0
      });
      
      // Set the doctor's department from auth context
      if (department && (!currentDepartment || currentDepartment !== department)) {
        setCurrentDepartment(department);
      }
    };
    
    verifyDoctorAccess();
  }, [user, role, department, isLoading, navigate, signOut, verificationState, currentDepartment]);
  
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

  // Update currentDepartment whenever the auth context department changes
  useEffect(() => {
    if (department && (!currentDepartment || currentDepartment !== department)) {
      setCurrentDepartment(department);
    } else if (!currentDepartment && !department) {
      // If no department is set from auth, use a default (for development only)
      if (import.meta.env.DEV) {
        setCurrentDepartment('Cardiology');
      }
    }
  }, [department, currentDepartment]);

  // Handle logout
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // If loading, show spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Show verification overlay if not verified yet
  if (!verificationState.verified && !verificationState.inProgress) {
    return <RoleVerificationOverlay role="doctor" />;
  }
  
  return (
    <div className="h-full bg-gray-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-green-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <CloseIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img src="/relyloop.svg" alt="RelayLoop" className="h-6 w-auto" />
                    <span className="ml-2 px-2 py-1 text-xs bg-white text-green-700 rounded-lg">Doctor</span>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    <Link
                      to="/doctor/dashboard"
                      className={`${
                        location.pathname === '/doctor/dashboard'
                          ? 'bg-green-800 text-white'
                          : 'text-white hover:bg-green-600'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <DashboardIcon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-green-300"
                        aria-hidden="true"
                      />
                      Dashboard
                    </Link>
                    <Link
                      to="/doctor/patients"
                      className={`${
                        location.pathname === '/doctor/patients' || location.pathname.includes('/doctor/patients/')
                          ? 'bg-green-800 text-white'
                          : 'text-white hover:bg-green-600'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <PatientIcon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-green-300"
                        aria-hidden="true"
                      />
                      Patients
                    </Link>
                    <Link
                      to="/doctor/predictions"
                      className={`${
                        location.pathname === '/doctor/predictions' || location.pathname.includes('/doctor/predictions/')
                          ? 'bg-green-800 text-white'
                          : 'text-white hover:bg-green-600'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <PredictionIcon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-green-300"
                        aria-hidden="true"
                      />
                      Predictions
                    </Link>
                    {/* Settings removed for doctor sidebar */}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-green-800 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center text-white">
                        {user?.email?.charAt(0).toUpperCase() || 'D'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Dr. {user?.email?.split('@')[0] || 'User'}</p>
                      <button
                        className="text-sm font-medium text-green-200 hover:text-white flex items-center"
                        onClick={handleSignOut}
                      >
                        <LogoutIcon className="h-4 w-4 mr-1" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-green-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img src="/relyloop.svg" alt="RelayLoop" className="h-6 w-auto" />
              <span className="ml-2 px-2 py-1 text-xs bg-white text-green-700 rounded-lg">Doctor</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <Link
                to="/doctor/dashboard"
                className={`${
                  location.pathname === '/doctor/dashboard'
                    ? 'bg-green-800 text-white'
                    : 'text-white hover:bg-green-600'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <DashboardIcon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-green-300"
                  aria-hidden="true"
                />
                Dashboard
              </Link>
              <Link
                to="/doctor/patients"
                className={`${
                  location.pathname === '/doctor/patients' || location.pathname.includes('/doctor/patients/')
                    ? 'bg-green-800 text-white'
                    : 'text-white hover:bg-green-600'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <PatientIcon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-green-300"
                  aria-hidden="true"
                />
                Patients
              </Link>
              <Link
                to="/doctor/predictions"
                className={`${
                  location.pathname === '/doctor/predictions' || location.pathname.includes('/doctor/predictions/')
                    ? 'bg-green-800 text-white'
                    : 'text-white hover:bg-green-600'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <PredictionIcon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-green-300"
                  aria-hidden="true"
                />
                Predictions
              </Link>
              {/* Settings removed for doctor sidebar */}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-green-800 flex items-center justify-center text-white">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'D'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Dr. {user?.name || user?.email?.split('@')[0] || 'User'}</p>
                <button
                  className="text-xs font-medium text-green-200 hover:text-white flex items-center"
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
                    <span className="ml-2 text-sm text-green-600 font-semibold">
                      {currentDepartment || department || 'Not assigned'}
                    </span>
                  </div>
                </div>
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 p-2 lg:rounded-md lg:hover:bg-gray-50"
                    id="user-menu-button"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'D'}
                      </span>
                    </div>
                    <span className="hidden ml-3 text-gray-700 text-sm font-medium lg:block">
                      <span className="sr-only">Logged in as </span>
                      Dr. {user?.name || user?.email?.split('@')[0] || 'User'}
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
                        Signed in as <span className="font-medium">{user?.email || 'doctor@relayloop.com'}</span>
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
