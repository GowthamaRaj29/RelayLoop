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
 * Get the role and department of the currently authenticated user with optimized caching
 * @returns {Promise<{role: string|null, department: string|null}>} The user's role and department or null if not authenticated
 */
async function getUserRole() {
  try {
    // First check if we have an authenticated user
    const { data } = await supabase.auth.getUser();
    
    // Safety check for user data
    if (!data || !data.user) {
      return { role: null, department: null };
    }
    
    const user = data.user;
    let role = null;
    let department = null;
    
    // Log full user object in development mode for debugging
    if (import.meta.env.DEV) {
      console.debug('User data from Supabase:', {
        id: user.id,
        email: user.email,
        has_user_metadata: !!user.user_metadata,
        has_app_metadata: !!user.app_metadata,
        user_metadata_keys: user.user_metadata ? Object.keys(user.user_metadata) : [],
        app_metadata_keys: user.app_metadata ? Object.keys(user.app_metadata) : []
      });
    }
    
    // Check for role in user metadata
    if (user.user_metadata && user.user_metadata.role) {
      role = user.user_metadata.role;
      console.log('Found role in user_metadata:', role);
      // Get department for both nurse and doctor roles
      if ((role === 'nurse' || role === 'doctor') && user.user_metadata.department) {
        department = user.user_metadata.department;
        console.log('Found department in user_metadata:', department);
      }
    }
    
    // Check for role in app_metadata (Supabase often stores roles here)
    if (!role && user.app_metadata && user.app_metadata.role) {
      role = user.app_metadata.role;
      console.log('Found role in app_metadata:', role);
      // Get department for both nurse and doctor roles
      if ((role === 'nurse' || role === 'doctor') && user.app_metadata.department) {
        department = user.app_metadata.department;
        console.log('Found department in app_metadata:', department);
      }
    }
    
    // Explicitly check for raw_user_meta_data in the JWT claims
    try {
      // Get the JWT token directly from auth
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (token) {
        // Decode the token to get the payload - simple base64 decode, not verification
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log('JWT payload keys:', Object.keys(payload));
        
        // Check if we have metadata in the JWT claims
        if (payload.raw_user_meta_data && payload.raw_user_meta_data.role) {
          if (!role) {
            role = payload.raw_user_meta_data.role;
            console.log('Found role in JWT claims:', role);
          }
          
          if (!department && (role === 'nurse' || role === 'doctor')) {
            department = payload.raw_user_meta_data.department;
            if (department) {
              console.log('Found department in JWT claims:', department);
            }
          }
        }
      }
    } catch (jwtError) {
      console.error('Error parsing JWT token:', jwtError);
      // Continue with other methods to get role
    }
    
    // Try to get email domain to determine role
    // This is useful for organizations that use specific email domains
    if (!role && user.email) {
      const emailDomain = user.email.split('@')[1]?.toLowerCase();
      const emailUsername = user.email.split('@')[0].toLowerCase();
      
      // Example mapping of domains to roles
      if (emailDomain === 'hospital-admin.com') {
        role = 'admin';
      } else if (emailDomain === 'doctors.org') {
        role = 'doctor';
        // Extract department for doctors from email
        if (!department && emailUsername.includes('-')) {
          const possibleDept = emailUsername.split('-')[0];
          if (['cardiology', 'neurology', 'oncology', 'pediatrics', 'general medicine'].includes(possibleDept)) {
            department = possibleDept.charAt(0).toUpperCase() + possibleDept.slice(1);
          } else {
            department = 'General Medicine'; // Default department for doctors
          }
        }
      } else if (emailDomain === 'nursing.org') {
        role = 'nurse';
        // Extract department for nurses from email
        if (!department) {
          if (emailUsername.includes('-')) {
            const possibleDept = emailUsername.split('-')[0];
            if (['cardiology', 'neurology', 'oncology', 'pediatrics', 'general medicine'].includes(possibleDept)) {
              department = possibleDept.charAt(0).toUpperCase() + possibleDept.slice(1);
            }
          }
          if (!department) {
            department = 'Cardiology'; // Default department for nurses
          }
        }
      }
    }
    
    // Always provide a default role in development
    if (!role && import.meta.env.DEV) {
      if (user.email && user.email.includes('admin')) {
        role = 'admin';
      } else if (user.email && user.email.includes('doctor')) {
        role = 'doctor';
        // Determine department from email for development - for doctors
        if (user.email.includes('cardiology')) {
          department = 'Cardiology';
        } else if (user.email.includes('neurology')) {
          department = 'Neurology';
        } else if (user.email.includes('oncology')) {
          department = 'Oncology';
        } else if (user.email.includes('pediatrics')) {
          department = 'Pediatrics';
        } else {
          department = 'General Medicine'; // Default department
        }
      } else if (user.email && user.email.includes('nurse')) {
        role = 'nurse';
        // Determine department from email for development - for nurses
        if (user.email.includes('cardiology')) {
          department = 'Cardiology';
        } else if (user.email.includes('neurology')) {
          department = 'Neurology';
        } else if (user.email.includes('oncology')) {
          department = 'Oncology';
        } else if (user.email.includes('pediatrics')) {
          department = 'Pediatrics';
        } else {
          department = 'General Medicine'; // Default department
        }
      }
      // Default admin role for dev environment if still not set
      if (!role) role = 'admin';
    }
    
    // Check identity providers for role info
    if (!role) {
      const identityData = user.identities?.[0]?.identity_data;
      if (identityData && identityData.role) {
        role = identityData.role;
        if ((role === 'nurse' || role === 'doctor') && identityData.department) {
          department = identityData.department;
        }
      }
    }
    
    // Before returning defaults, check if we have cached values
    if (!role) {
      const cachedRole = localStorage.getItem('user_role');
      if (cachedRole) {
        console.log('Using cached role from localStorage when no role found:', cachedRole);
        role = cachedRole;
        
        // If the cached role is nurse, check for cached department
        if (role === 'nurse' && !department) {
          const cachedDept = localStorage.getItem('user_department');
          if (cachedDept) {
            department = cachedDept;
          }
        }
      }
    }
    
    // For development, return admin by default to prevent unnecessary role changes
    if (!role && import.meta.env.DEV) {
      role = 'admin';
    }
    
    // If still no role, try to query the user_profiles table directly
    if (!role && user.id) {
      try {
        console.log('Trying to get role from user_profiles table');
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('department')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (profileData) {
          console.log('Found user profile data:', profileData);
          if (!department && profileData.department) {
            department = profileData.department;
            console.log('Using department from user_profiles table:', department);
          }
        }
      } catch (profileQueryError) {
        console.error('Error querying user_profiles table:', profileQueryError);
      }
    }
    
    // Return object with role and department
    // Ensure role is not null/undefined if we have it in localStorage
    const cachedRole = !role ? localStorage.getItem('user_role') : null;
    if (!role && cachedRole) {
      console.log('Using cached role as last resort:', cachedRole);
      role = cachedRole;
    }
    
    return {
      role: role || null,
      department: department || null
    };
  } catch (error) {
    console.error('Error in getUserRole function:', error);
    
    let role = null;
    let department = null;
    
    // Try to recover from cached role first
    const cachedRole = localStorage.getItem('user_role');
    if (cachedRole) {
      console.log('Recovering with cached role after error:', cachedRole);
      role = cachedRole;
      
      // Check for cached department
      if ((role === 'nurse' || role === 'doctor')) {
        const cachedDept = localStorage.getItem('user_department');
        if (cachedDept) {
          department = cachedDept;
          console.log('Recovering with cached department after error:', cachedDept);
        }
      }
    }
    
    // For development only - provide a default role to prevent hanging
    if (!role && import.meta.env.DEV) {
      role = 'admin';
    }
    
    return {
      role,
      department
    };
  }
}

export { supabase, getUserRole };
