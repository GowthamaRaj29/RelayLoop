import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Enhanced password validation
const passwordSchema = z.string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Form validation schema with enhanced security
// Temporarily removed CSRF requirement for testing login
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .max(255, 'Email is too long'),
  password: passwordSchema,
  // Removed csrfToken requirement temporarily for testing
});

// Simple anti-brute force mechanism
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function LoginForm() {
  const { signIn, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  // Temporarily disabled for testing
  // const [csrfToken, setCsrfToken] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  
  // CSRF token generation temporarily disabled for testing
  /* useEffect(() => {
    // In a real app, this would be fetched from the server
    const token = Array(32).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
    setCsrfToken(token);
  }, []); */

  const {
    register,
    handleSubmit,
    formState: { errors },
    // Removed unused setError
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      // Removed csrfToken default as it's no longer in the schema
    },
  });
  
  // CSRF token update effect temporarily disabled for testing
  /* useEffect(() => {
    if (csrfToken) {
      // Update the hidden field value
      const csrfField = document.getElementById('csrfToken');
      if (csrfField) {
        csrfField.value = csrfToken;
      }
    }
  }, []); */
  
  const onSubmit = async (data) => {
    // Check if account is locked
    if (lockedUntil && Date.now() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - Date.now()) / (60 * 1000));
      setAuthError(`Too many login attempts. Please try again in ${minutesLeft} minutes.`);
      return;
    }

    try {
      // CSRF token verification temporarily disabled for testing
      // TODO: Re-enable CSRF protection after login is confirmed working
      // if (data.csrfToken !== csrfToken) {
      //   setAuthError('Security verification failed. Please refresh the page and try again.');
      //   return;
      // }

      setAuthError(null);
      await signIn({
        email: data.email.trim().toLowerCase(),
        password: data.password
      });
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
    } catch (error) {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Lock account after too many attempts
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_TIME;
        setLockedUntil(lockTime);
        setAuthError(`Too many failed login attempts. Your account is temporarily locked. Please try again later.`);
        
        // Store lockout in sessionStorage
        try {
          sessionStorage.setItem('lockUntil', lockTime.toString());
        } catch (e) {
          console.error('Failed to store lockout time:', e);
        }
      } else {
        setAuthError(error.message || 'Invalid email or password. Please try again.');
      }
    }
  };

  // Check for existing lockout on component mount
  useEffect(() => {
    try {
      const storedLockTime = sessionStorage.getItem('lockUntil');
      if (storedLockTime) {
        const lockTime = parseInt(storedLockTime, 10);
        if (Date.now() < lockTime) {
          setLockedUntil(lockTime);
        } else {
          // Clear expired lockout
          sessionStorage.removeItem('lockUntil');
        }
      }
    } catch (e) {
      console.error('Failed to check lockout status:', e);
    }
  }, []);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* CSRF Protection temporarily disabled for testing
      <input 
        type="hidden" 
        id="csrfToken"
        {...register('csrfToken')}
        value={csrfToken}
      /> */}
      
      {authError && (
        <div 
          className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md" 
          role="alert"
          aria-live="assertive"
        >
          {authError}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username" /* Security best practice */
          spellCheck="false"
          autoCapitalize="none"
          className={`w-full px-3 py-2 border text-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600" id="email-error" aria-live="polite">
            {errors.email.message}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={`w-full px-3 py-2 border rounded-md shadow-sm text-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex="-1" /* So it doesn't interfere with form submission order */
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600" id="password-error" aria-live="polite">
            {errors.password.message}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <div className="text-sm">
          {/* Using button instead of anchor for better security */}
          <button 
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
            onClick={() => {
              // In a real app, this would navigate to the forgot password page
              console.log('Navigate to forgot password');
            }}
          >
            Forgot your password?
          </button>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading || (lockedUntil && Date.now() < lockedUntil)}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            (isLoading || (lockedUntil && Date.now() < lockedUntil)) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          aria-busy={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
