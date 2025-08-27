import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Maintain a timestamp to throttle debug logging
let lastAuthLogTimestamp = 0;
const LOG_THROTTLE_MS = 5000; // Log at most every 5 seconds

/**
 * Custom hook to access authentication context with enhanced error handling and performance
 * @returns {Object} Authentication context with user, role, and auth methods
 */
export function useAuth() {
  try {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    
    // Log authentication status changes in development mode with throttling
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH) {
      const now = Date.now();
      if (now - lastAuthLogTimestamp > LOG_THROTTLE_MS) {
        const { user, role, isLoading } = context;
        console.debug('Auth Status:', { 
          authenticated: !!user, 
          role: role || 'none', 
          isLoading
        });
        lastAuthLogTimestamp = now;
      }
    }
    
    return context;
  } catch (error) {
    console.error('Fatal error in useAuth hook:', error);
    // Re-throw to bubble up to error boundary
    throw error;
  }
}
