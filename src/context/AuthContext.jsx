import { createContext, useEffect, useState } from 'react';
import { supabase, getUserRole } from '../lib/supabase';

export const AuthContext = createContext({
  user: null,
  role: null,
  department: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  error: null,
});

export function AuthProvider({ children }) {
  // Fast-path initialization from localStorage to prevent flickering
  const cachedUser = localStorage.getItem('user_data');
  const cachedRole = localStorage.getItem('user_role');
  const cachedDepartment = localStorage.getItem('user_department');
  
  // Initialize states with cached values if available
  const [user, setUser] = useState(cachedUser ? JSON.parse(cachedUser) : null);
  const [role, setRole] = useState(cachedRole || null);
  const [department, setDepartment] = useState(cachedDepartment || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent multiple concurrent checks with a ref
    let isCheckingSession = false;

    // Check active session on mount with timeout safety and proper promise handling
    const checkSession = async () => {
      // Prevent concurrent session checks
      if (isCheckingSession) {
        return;
      }
      
      isCheckingSession = true;
      
      // If we already have cached data, we can set loading to false more quickly
      const hasValidCachedData = user && role && (role !== 'nurse' || department);
      
      // Longer timeout to prevent too many timeouts
      const timeoutDuration = hasValidCachedData ? 2000 : 5000;
      
      // Safety timeout to prevent hanging in loading state
      const sessionTimeout = setTimeout(() => {
        // Only log this warning once per session
        console.debug('Session check timed out, using cached data');
        
        // Since we've already initialized with cached data in useState,
        // we just need to set isLoading to false here
        setIsLoading(false);
        isCheckingSession = false;
      }, timeoutDuration);
      
      try {
        // Get session with proper promise handling
        const sessionData = await supabase.auth.getSession().catch(error => {
          console.error('Supabase getSession error:', error);
          return { data: { session: null } };
        });
        
        // Clear the safety timeout since we got a response
        clearTimeout(sessionTimeout);
        
        if (sessionData?.data?.session) {
          const userData = sessionData.data.session.user;
          setUser(userData);
          // Cache user data in localStorage
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          // Get role with a timeout to prevent hanging and proper promise handling
          try {
              // First try to get the role from localStorage to prevent flickering during reload
              const cachedRole = localStorage.getItem('user_role');
              const cachedDepartment = localStorage.getItem('user_department');
              
              if (cachedRole) {
                console.debug('Using cached role from localStorage:', cachedRole);
                setRole(cachedRole);
                
                // If we have a cached department and the role is nurse or doctor, use it
                if ((cachedRole === 'nurse' || cachedRole === 'doctor') && cachedDepartment) {
                  console.debug('Using cached department from localStorage:', cachedDepartment);
                  setDepartment(cachedDepartment);
                }              // Validate that the cached data is actually what we expect
              try {
                const userData = await getUserRole();
                
                // Update role if needed
                if (userData.role && userData.role !== cachedRole) {
                  console.warn(`Cached role (${cachedRole}) doesn't match actual role (${userData.role}), updating...`);
                  setRole(userData.role);
                  localStorage.setItem('user_role', userData.role);
                }
                
                // Update department if this is a nurse or doctor
                if (userData.role === 'nurse' || userData.role === 'doctor') {
                  if (userData.department && userData.department !== cachedDepartment) {
                    console.warn(`Cached department (${cachedDepartment}) doesn't match actual department (${userData.department}), updating...`);
                    setDepartment(userData.department);
                    localStorage.setItem('user_department', userData.department);
                  } else if (userData.department && !cachedDepartment) {
                    // We have a department but no cached value
                    setDepartment(userData.department);
                    localStorage.setItem('user_department', userData.department);
                  }
                }
              } catch (validationError) {
                console.error('User data validation error:', validationError);
                // Keep using cached values even if validation fails
              }
            } else {
              // Create a timeout promise that won't reject - reduced to 1s for faster feedback
              const timeoutPromise = new Promise(resolve => {
                setTimeout(() => resolve({ role: null, department: null }), 1000);
              });
              
              // Fetch the user data from the server if no cache
              const userData = await Promise.race([
                getUserRole().catch(err => {
                  console.error('Error in getUserRole:', err);
                  return { role: null, department: null };
                }),
                timeoutPromise
              ]);
              
              // Update the role if we got a valid one from the server
              if (userData.role) {
                console.log('Setting role from server:', userData.role);
                setRole(userData.role);
                localStorage.setItem('user_role', userData.role);
                
                // If user is a nurse or doctor, set department
                if ((userData.role === 'nurse' || userData.role === 'doctor') && userData.department) {
                  console.log('Setting department from server:', userData.department);
                  setDepartment(userData.department);
                  localStorage.setItem('user_department', userData.department);
                }
              } else {
                // If we didn't get a valid role, try to get from cache before defaulting
                const cachedRole = localStorage.getItem('user_role');
                if (cachedRole) {
                  console.log('Using previously cached role when server returned null:', cachedRole);
                  setRole(cachedRole);
                  
                  // Try to get cached department as well
                  if (cachedRole === 'nurse' || cachedRole === 'doctor') {
                    const cachedDept = localStorage.getItem('user_department');
                    if (cachedDept) {
                      console.log('Using previously cached department:', cachedDept);
                      setDepartment(cachedDept);
                    }
                  }
                } else {
                  // Only set a default if we have no valid role from any source
                  console.log('No role found, defaulting to null (was defaulting to user)');
                  setRole(null); // Changed from 'user' to null to trigger proper error handling
                }
              }
            }
          } catch (roleError) {
            console.error('Error getting user role:', roleError);
            // Use cached role if available, otherwise fallback to 'user'
            const cachedRole = localStorage.getItem('user_role');
            setRole(cachedRole || 'user');
          }
        }
        
        // Always set loading to false when done, regardless of outcome
        setIsLoading(false);
        isCheckingSession = false;
      } catch (err) {
        console.error('Error checking auth session:', err);
        setError('Authentication error. Please try again.');
        setIsLoading(false);
        isCheckingSession = false;
        clearTimeout(sessionTimeout);
      }
    };

    checkSession();

    // Listen for auth changes with timeout safety and proper promise handling
    let subscription;
    // Track if auth state change is in progress to prevent multiple handlers
    let isHandlingAuthChange = false;
    
    try {
      const authData = supabase.auth.onAuthStateChange(async (event, session) => {
        // Skip if we're already handling an auth change
        if (isHandlingAuthChange) {
          console.debug(`Skipping duplicate auth state change: ${event}`);
          return;
        }
        
        isHandlingAuthChange = true;
        console.debug(`Auth state changed: ${event}`);
        setIsLoading(true);
        
        // Safety timeout to prevent hanging in loading state - use a longer timeout
        const authStateTimeout = setTimeout(() => {
          console.debug('Auth state change handler timed out, resetting loading state');
          // Try to restore from cache before giving up
          const cachedUser = localStorage.getItem('user_data');
          const cachedRole = localStorage.getItem('user_role');
          
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
              if (cachedRole) setRole(cachedRole);
              console.debug('Restored auth state from cache during timeout');
            } catch (e) {
              console.error('Error parsing cached auth data:', e);
            }
          }
          
          setIsLoading(false);
          isHandlingAuthChange = false;
        }, 8000);
        
        try {
          if (event === 'SIGNED_IN' && session) {
            const userData = session.user;
            setUser(userData);
            // Cache user data for persistence
            localStorage.setItem('user_data', JSON.stringify(userData));
            
            // Get role with timeout and error handling
            try {
              // First check if we already have cached data
              const cachedRole = localStorage.getItem('user_role');
              const cachedDepartment = localStorage.getItem('user_department');
              
              if (cachedRole) {
                console.debug('Using cached role during auth change:', cachedRole);
                setRole(cachedRole);
                
                if ((cachedRole === 'nurse' || cachedRole === 'doctor') && cachedDepartment) {
                  console.debug('Using cached department during auth change:', cachedDepartment);
                  setDepartment(cachedDepartment);
                }
              }
              
              // Create a timeout promise that won't reject
              const timeoutPromise = new Promise(resolve => {
                setTimeout(() => resolve({ role: null, department: null }), 3000); // 3s timeout
              });
              
              // Race the promises with proper error handling
              const userData = await Promise.race([
                getUserRole().catch(err => {
                  console.error('Error in getUserRole during auth change:', err);
                  return { 
                    role: cachedRole || null,
                    department: cachedDepartment || null
                  };
                }),
                timeoutPromise
              ]);
              
              if (userData.role) {
                console.log('Auth change: Setting role from server:', userData.role);
                setRole(userData.role);
                localStorage.setItem('user_role', userData.role);
                
                if ((userData.role === 'nurse' || userData.role === 'doctor') && userData.department) {
                  console.log('Auth change: Setting department from server:', userData.department);
                  setDepartment(userData.department);
                  localStorage.setItem('user_department', userData.department);
                }
              } else {
                // Try to get role from cache before defaulting
                if (cachedRole) {
                  console.log('Auth change: Using cached role when server returned null:', cachedRole);
                  setRole(cachedRole);
                  
                  if ((cachedRole === 'nurse' || cachedRole === 'doctor') && cachedDepartment) {
                    console.log('Auth change: Using cached department:', cachedDepartment);
                    setDepartment(cachedDepartment);
                  }
                } else {
                  console.log('Auth change: No role available, using null (was defaulting to user)');
                  setRole(null); // Changed from 'user' to null to trigger proper error handling
                  setDepartment(null);
                }
              }
            } catch (roleError) {
              console.error('Error getting user role during auth change:', roleError);
              setRole('user'); // Default fallback role
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setRole(null);
            setDepartment(null);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
        } finally {
          clearTimeout(authStateTimeout);
          setIsLoading(false);
          isHandlingAuthChange = false;
        }
      });
      
      subscription = authData.data.subscription;
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setIsLoading(false);
    }

    return () => {
      // Clean up subscription safely
      if (subscription && typeof subscription.unsubscribe === 'function') {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  // Run only once on mount, dependencies will cause this effect to run multiple times
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sanitize inputs
      const sanitizedEmail = email?.trim().toLowerCase();
      
      if (!sanitizedEmail || !password) {
        throw new Error('Email and password are required');
      }
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (signInError) throw signInError;
      
      if (!data?.user) {
        throw new Error('Authentication succeeded but no user was returned');
      }
      
      const userData = data.user;
      setUser(userData);
      
      // Cache user data for persistence
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      try {
        const userData = await getUserRole();
        const { role: userRole, department: userDepartment } = userData;
        
        setRole(userRole);
        
        // Cache the role in localStorage for page reloads
        if (userRole) {
          localStorage.setItem('user_role', userRole);
          
          // If user is a nurse or doctor, set and cache department
          if ((userRole === 'nurse' || userRole === 'doctor') && userDepartment) {
            setDepartment(userDepartment);
            localStorage.setItem('user_department', userDepartment);
          }
        }
        
        return { 
          user: userData, 
          role: userRole,
          department: (userRole === 'nurse' || userRole === 'doctor') ? userDepartment : null
        };
      } catch (roleError) {
        console.error('Error getting user role during sign in:', roleError);
        setError('Signed in successfully, but failed to get user role: ' + roleError.message);
        
        // We still return the user but with null role
        return { user: data.user, role: null };
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setDepartment(null);
      
      // Clear all cached authentication data
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_department');
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('redirectPath');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Import the diagnostics function at the top level
  // Add diagnoseAuth method for debugging
  const diagnoseAuth = () => {
    try {
      // Since we're in React, use dynamic import instead of require
      import('../utils/diagnostics').then(module => {
        const results = module.diagnoseAuthIssues({ user, role, isLoading, error });
        console.log('Auth Diagnostics Results:', results);
        return results;
      });
    } catch (e) {
      console.error("Error running diagnostics:", e);
      return { error: e.message };
    }
  };

  const value = {
    user,
    role,
    department,
    isLoading,
    signIn,
    signOut,
    error,
    diagnoseAuth, // Add diagnostic function to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
