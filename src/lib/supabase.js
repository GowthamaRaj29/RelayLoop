import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only log environment variables in development mode
if (import.meta.env.DEV) {
  console.debug('Supabase environment variables:', {
    url: supabaseUrl ? 'defined' : 'undefined',
    key: supabaseAnonKey ? 'defined' : 'undefined'
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

// Create a singleton Supabase client to prevent multiple instances
let supabaseInstance = null;

// Function to get the Supabase client instance
const getSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: localStorage, // Explicitly use localStorage for better performance
        storageKey: 'relayloop-auth', // Unique key to prevent conflicts
      },
      persistSession: true,
      autoRefreshToken: true,
      // Add a unique client name to help with debugging
      clientName: 'relayloop-client',
    });
    
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.debug('Supabase client initialized successfully');
    }
    
    return supabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
  }
};

// Create and export the Supabase client
const supabase = getSupabase();

/**
 * Get the role of the currently authenticated user
 * This function tries multiple approaches to get the user role:
 * 1. First from user metadata in the JWT claims (fastest)
 * 2. Then from the user_profiles table (more reliable but requires DB access)
 * 
 * @returns {Promise<string|null>} The user's role or null if not authenticated
 */
/**
 * Get the role of the currently authenticated user with optimized caching
 * @returns {Promise<string|null>} The user's role or null if not authenticated
 */
async function getUserRole() {
  try {
    // First check if we have an authenticated user
    const { data } = await supabase.auth.getUser();
    
    // Safety check for user data
    if (!data || !data.user) {
      return null;
    }
    
    const user = data.user;
    
    // Check for role in user metadata
    if (user.user_metadata && user.user_metadata.role) {
      return user.user_metadata.role;
    }
    
    // Check for role in app_metadata (Supabase often stores roles here)
    if (user.app_metadata && user.app_metadata.role) {
      return user.app_metadata.role;
    }
    
    // Try to get email domain to determine role
    // This is useful for organizations that use specific email domains
    if (user.email) {
      const emailDomain = user.email.split('@')[1]?.toLowerCase();
      // Example mapping of domains to roles
      if (emailDomain === 'hospital-admin.com') {
        return 'admin';
      } else if (emailDomain === 'doctors.org') {
        return 'doctor';
      } else if (emailDomain === 'nursing.org') {
        return 'nurse';
      }
    }
    
    // Always provide a default role in development
    if (import.meta.env.DEV) {
      if (user.email && user.email.includes('admin')) {
        return 'admin';
      } else if (user.email && user.email.includes('doctor')) {
        return 'doctor';
      } else if (user.email && user.email.includes('nurse')) {
        return 'nurse';
      }
      // Default admin role for dev environment
      return 'admin';
    }
    
    // Check identity providers for role info
    const identityData = user.identities?.[0]?.identity_data;
    if (identityData && identityData.role) {
      return identityData.role;
    }
    
    // Before returning a default, check if we have a cached role
    const cachedRole = localStorage.getItem('user_role');
    if (cachedRole) {
      console.log('Using cached role from localStorage when no role found:', cachedRole);
      return cachedRole;
    }
    
    // For development, return admin by default to prevent unnecessary role changes
    if (import.meta.env.DEV) {
      return 'admin';
    }
    
    // Last resort - return null to trigger proper error handling
    return null;
  } catch (error) {
    console.error('Error in getUserRole function:', error);
    
    // Try to recover from cached role first
    const cachedRole = localStorage.getItem('user_role');
    if (cachedRole) {
      console.log('Recovering with cached role after error:', cachedRole);
      return cachedRole;
    }
    
    // For development only - provide a default role to prevent hanging
    if (import.meta.env.DEV) {
      return 'admin';
    }
    
    return null;
  }
}

export { supabase, getUserRole };
