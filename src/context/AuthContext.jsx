import { createContext, useEffect, useState } from 'react';
import { supabase, getUserRole } from '../lib/supabase';

export const AuthContext = createContext({
  user: null,
  role: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  error: null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check active session on mount with timeout safety and proper promise handling
    const checkSession = async () => {
      // Safety timeout to prevent hanging in loading state - reduced to 2 seconds for faster feedback
      const sessionTimeout = setTimeout(() => {
        console.warn('Session check timed out, resetting loading state');
        
        // Check if we have a cached user in localStorage
        const cachedUser = localStorage.getItem('user_data');
        if (cachedUser) {
          try {
            const userData = JSON.parse(cachedUser);
            setUser(userData);
            console.debug('Using cached user from localStorage');
            
            // Also restore role from cache immediately for faster rendering
            const cachedRole = localStorage.getItem('user_role');
            if (cachedRole) {
              setRole(cachedRole);
              console.debug('Fast path: Restored cached role during timeout');
            }
          } catch (e) {
            console.error('Error parsing cached user:', e);
          }
        }
        
        setIsLoading(false);
      }, 2000); // Reduced to 2 seconds for faster feedback
      
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
            if (cachedRole) {
              console.debug('Using cached role from localStorage:', cachedRole);
              setRole(cachedRole);
              
              // Validate that the cached role is actually what we expect
              // This prevents issues where a user might have a stale or incorrect role
              try {
                const validatedRole = await getUserRole();
                if (validatedRole && validatedRole !== cachedRole) {
                  console.warn(`Cached role (${cachedRole}) doesn't match actual role (${validatedRole}), updating...`);
                  setRole(validatedRole);
                  localStorage.setItem('user_role', validatedRole);
                }
              } catch (validationError) {
                console.error('Role validation error:', validationError);
                // Keep using cached role even if validation fails
              }
            } else {
              // Create a timeout promise that won't reject - reduced to 1s for faster feedback
              const timeoutPromise = new Promise(resolve => {
                setTimeout(() => resolve(null), 1000); // Reduced to 1s timeout for faster response
              });
              
              // Fetch the role from the server if no cache
              const userRole = await Promise.race([
                getUserRole().catch(err => {
                  console.error('Error in getUserRole:', err);
                  return null;
                }),
                timeoutPromise
              ]);
              
              // Update the role if we got a valid one from the server
              if (userRole) {
                console.log('Setting role from server:', userRole);
                setRole(userRole);
                // Cache the role for future page reloads
                localStorage.setItem('user_role', userRole);
              } else {
                // If we didn't get a valid role, try to get from cache before defaulting
                const cachedRole = localStorage.getItem('user_role');
                if (cachedRole) {
                  console.log('Using previously cached role when server returned null:', cachedRole);
                  setRole(cachedRole);
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
      } catch (err) {
        console.error('Error checking auth session:', err);
        setError('Authentication error. Please try again.');
        setIsLoading(false);
        clearTimeout(sessionTimeout);
      }
    };

    checkSession();

    // Listen for auth changes with timeout safety and proper promise handling
    let subscription;
    try {
      const authData = supabase.auth.onAuthStateChange(async (event, session) => {
        console.debug(`Auth state changed: ${event}`);
        setIsLoading(true);
        
        // Safety timeout to prevent hanging in loading state
        const authStateTimeout = setTimeout(() => {
          console.warn('Auth state change handler timed out, resetting loading state');
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
        }, 5000);
        
        try {
          if (event === 'SIGNED_IN' && session) {
            const userData = session.user;
            setUser(userData);
            // Cache user data for persistence
            localStorage.setItem('user_data', JSON.stringify(userData));
            
            // Get role with timeout and error handling
            try {
              // First check if we already have a cached role
              const cachedRole = localStorage.getItem('user_role');
              if (cachedRole) {
                console.debug('Using cached role during auth change:', cachedRole);
                setRole(cachedRole);
              }
              
              // Create a timeout promise that won't reject
              const timeoutPromise = new Promise(resolve => {
                setTimeout(() => resolve(null), 3000); // 3s timeout
              });
              
              // Race the promises with proper error handling
              const userRole = await Promise.race([
                getUserRole().catch(err => {
                  console.error('Error in getUserRole during auth change:', err);
                  return cachedRole || null; // Fallback to cached role
                }),
                timeoutPromise
              ]);
              
              if (userRole) {
                console.log('Auth change: Setting role from server:', userRole);
                setRole(userRole);
                localStorage.setItem('user_role', userRole);
              } else {
                // Try to get role from cache before defaulting
                const cachedRole = localStorage.getItem('user_role');
                if (cachedRole) {
                  console.log('Auth change: Using cached role when server returned null:', cachedRole);
                  setRole(cachedRole);
                } else {
                  console.log('Auth change: No role available, using null (was defaulting to user)');
                  setRole(null); // Changed from 'user' to null to trigger proper error handling
                }
              }
            } catch (roleError) {
              console.error('Error getting user role during auth change:', roleError);
              setRole('user'); // Default fallback role
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setRole(null);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
        } finally {
          clearTimeout(authStateTimeout);
          setIsLoading(false);
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
        const userRole = await getUserRole();
        setRole(userRole);
        
        // Cache the role in localStorage for page reloads
        if (userRole) {
          localStorage.setItem('user_role', userRole);
        }
        
        return { user: userData, role: userRole };
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
      
      // Clear all cached authentication data
      localStorage.removeItem('user_role');
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
    isLoading,
    signIn,
    signOut,
    error,
    diagnoseAuth, // Add diagnostic function to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
