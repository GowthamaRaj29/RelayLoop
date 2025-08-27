/**
 * Utility functions for diagnostics and troubleshooting
 */

/**
 * Check if environment variables are loaded properly
 * @returns {Object} An object containing environment variable status
 */
export function checkEnvironmentVariables() {
  const environmentInfo = {
    supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    nodeEnv: import.meta.env.NODE_ENV,
    mode: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    baseUrl: import.meta.env.BASE_URL,
  };

  // Log environment variable status to console
  console.group('Environment Variables Check');
  console.log('Supabase URL is ' + (environmentInfo.supabaseUrl ? 'defined' : 'undefined'));
  console.log('Supabase Anon Key is ' + (environmentInfo.supabaseAnonKey ? 'defined' : 'undefined'));
  console.log('NODE_ENV:', environmentInfo.nodeEnv);
  console.log('Vite MODE:', environmentInfo.mode);
  console.log('Is Development:', environmentInfo.isDevelopment);
  console.log('Is Production:', environmentInfo.isProduction);
  console.log('Base URL:', environmentInfo.baseUrl);
  console.groupEnd();

  return environmentInfo;
}

/**
 * Check browser compatibility issues
 * @returns {Object} An object containing browser compatibility issues
 */
export function checkBrowserCompatibility() {
  const compatibility = {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDb: typeof indexedDB !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    fetch: typeof fetch !== 'undefined',
    promise: typeof Promise !== 'undefined',
    // Check for async/await support without using eval
    async: typeof Object.getOwnPropertyDescriptor(Function.prototype, 'constructor') !== 'undefined',
    userAgent: navigator.userAgent,
  };

  // Log browser compatibility to console
  console.group('Browser Compatibility Check');
  console.log('Local Storage available:', compatibility.localStorage);
  console.log('Session Storage available:', compatibility.sessionStorage);
  console.log('IndexedDB available:', compatibility.indexedDb);
  console.log('Service Worker API available:', compatibility.serviceWorker);
  console.log('Fetch API available:', compatibility.fetch);
  console.log('Promise API available:', compatibility.promise);
  console.log('Async/Await available:', compatibility.async);
  console.log('User Agent:', compatibility.userAgent);
  console.groupEnd();

  return compatibility;
}

/**
 * Check React application state
 * @param {Object} providers Object containing provider status
 * @returns {Object} The provider status
 */
export function checkAppState(providers = {}) {
  console.group('Application State Check');
  console.log('Auth Provider loaded:', !!providers.auth);
  console.log('Router Provider loaded:', !!providers.router);
  console.log('Query Client loaded:', !!providers.queryClient);
  console.groupEnd();

  return providers;
}

/**
 * Run all diagnostic checks and return results
 * @param {Object} appState Current application state
 * @returns {Object} All diagnostic results
 */
/**
 * Diagnose authentication issues by examining storage, session, and context state
 * @param {Object} authState Current authentication state from AuthContext
 * @returns {Object} Diagnostic information about authentication
 */
export function diagnoseAuthIssues(authState = {}) {
  const { user, role, isLoading, error } = authState;
  
  // Check stored values
  const localStorage_user = localStorage.getItem('user_data');
  const localStorage_role = localStorage.getItem('user_role');
  const sessionStorage_redirectPath = sessionStorage.getItem('redirectPath');
  
  // Parse stored user if it exists
  let parsedStoredUser = null;
  try {
    if (localStorage_user) {
      parsedStoredUser = JSON.parse(localStorage_user);
    }
  } catch (e) {
    console.error('Error parsing stored user data:', e);
  }
  
  // Gather diagnostics
  const diagnostics = {
    context: {
      hasUser: !!user,
      userEmail: user?.email,
      userId: user?.id,
      currentRole: role,
      isLoading,
      hasError: !!error,
      errorMessage: error,
    },
    storage: {
      localStorage: {
        hasUserData: !!localStorage_user,
        userDataValid: !!parsedStoredUser,
        userEmail: parsedStoredUser?.email,
        userId: parsedStoredUser?.id,
        storedRole: localStorage_role,
      },
      sessionStorage: {
        hasRedirectPath: !!sessionStorage_redirectPath,
        redirectPath: sessionStorage_redirectPath,
      },
    },
    consistency: {
      userMatch: user?.id === parsedStoredUser?.id,
      roleMatch: role === localStorage_role,
      hasValidAuth: !!user && !!role,
      recommendation: '',
    },
    timestamp: new Date().toISOString(),
  };
  
  // Generate recommendations
  if (!diagnostics.consistency.userMatch && user && parsedStoredUser) {
    diagnostics.consistency.recommendation = 'User mismatch between context and storage. Clear storage data and re-login.';
  } else if (!diagnostics.consistency.roleMatch && role && localStorage_role) {
    diagnostics.consistency.recommendation = 'Role mismatch between context and storage. Update localStorage role to match context.';
  } else if (!role && localStorage_role) {
    diagnostics.consistency.recommendation = 'Role missing in context but present in storage. Try refreshing the page or re-login.';
  } else if (role && !localStorage_role) {
    diagnostics.consistency.recommendation = 'Role present in context but missing in storage. Update localStorage with current role.';
  }
  
  console.group('Authentication Diagnostics');
  console.log('Context State:', diagnostics.context);
  console.log('Storage State:', diagnostics.storage);
  console.log('Consistency Checks:', diagnostics.consistency);
  console.log('Recommendation:', diagnostics.consistency.recommendation || 'No issues detected.');
  console.groupEnd();
  
  return diagnostics;
}

export function runAllDiagnostics(appState = {}) {
  console.group('RelayLoop Application Diagnostics');
  const env = checkEnvironmentVariables();
  const browser = checkBrowserCompatibility();
  const app = checkAppState(appState);
  
  // Include auth diagnostics if auth state is provided
  let auth = null;
  if (appState.auth) {
    auth = diagnoseAuthIssues(appState.auth);
  }
  
  console.groupEnd();

  return {
    environment: env,
    browser,
    application: app,
    auth,
    timestamp: new Date().toISOString(),
  };
}
