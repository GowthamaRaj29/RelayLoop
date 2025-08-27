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
      // Safety timeout to prevent hanging in loading state
      const sessionTimeout = setTimeout(() => {
        console.warn('Session check timed out, resetting loading state');
        setIsLoading(false);
      }, 5000); // 5 seconds timeout for safety
      
      try {
        // Get session with proper promise handling
        const sessionData = await supabase.auth.getSession().catch(error => {
          console.error('Supabase getSession error:', error);
          return { data: { session: null } };
        });
        
        // Clear the safety timeout since we got a response
        clearTimeout(sessionTimeout);
        
        if (sessionData?.data?.session) {
          setUser(sessionData.data.session.user);
          
          // Get role with a timeout to prevent hanging and proper promise handling
          try {
            // Create a timeout promise that won't reject
            const timeoutPromise = new Promise(resolve => {
              setTimeout(() => resolve(null), 3000); // 3s timeout
            });
            
            // Race the promises but handle rejections in getUserRole
            const userRole = await Promise.race([
              getUserRole().catch(err => {
                console.error('Error in getUserRole:', err);
                return null;
              }),
              timeoutPromise
            ]);
            
            setRole(userRole);
          } catch (roleError) {
            console.error('Error getting user role:', roleError);
            // Provide a fallback role if there was an error
            setRole('user');
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
        setIsLoading(true);
        
        // Safety timeout to prevent hanging in loading state
        const authStateTimeout = setTimeout(() => {
          console.warn('Auth state change handler timed out, resetting loading state');
          setIsLoading(false);
        }, 5000);
        
        try {
          if (event === 'SIGNED_IN' && session) {
            setUser(session.user);
            
            // Get role with timeout and error handling
            try {
              // Create a timeout promise that won't reject
              const timeoutPromise = new Promise(resolve => {
                setTimeout(() => resolve(null), 3000); // 3s timeout
              });
              
              // Race the promises with proper error handling
              const userRole = await Promise.race([
                getUserRole().catch(err => {
                  console.error('Error in getUserRole during auth change:', err);
                  return null;
                }),
                timeoutPromise
              ]);
              
              setRole(userRole || 'user'); // Provide fallback role
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
      
      setUser(data.user);
      
      try {
        const userRole = await getUserRole();
        setRole(userRole);
        
        return { user: data.user, role: userRole };
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
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    role,
    isLoading,
    signIn,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
