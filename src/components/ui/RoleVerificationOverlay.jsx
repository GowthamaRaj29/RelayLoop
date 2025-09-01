import React, { useEffect, useState } from 'react';

/**
 * RoleVerificationOverlay - Component shown during role verification
 * Displays a branded loading animation with meaningful status updates
 * 
 * @param {string} role - The role being verified ('admin', 'doctor', etc)
 * @param {boolean} isRecovering - Whether this is a recovery operation or initial verification
 */
export default function RoleVerificationOverlay({ role = 'admin', isRecovering = false }) {
  const [progressStage, setProgressStage] = useState(0);
  const [progressText, setProgressText] = useState('Initializing...');
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Color scheme based on role
  const colorScheme = {
    admin: {
      primary: 'border-teal-600',
      secondary: 'bg-teal-600',
      accent: 'bg-teal-400',
      text: 'text-teal-700',
    },
    doctor: {
      primary: 'border-blue-600',
      secondary: 'bg-blue-600',
      accent: 'bg-blue-400',
      text: 'text-blue-700',
    },
    nurse: {
      primary: 'border-purple-600',
      secondary: 'bg-purple-600',
      accent: 'bg-purple-400',
      text: 'text-purple-700',
    },
    default: {
      primary: 'border-gray-600',
      secondary: 'bg-gray-600',
      accent: 'bg-gray-400',
      text: 'text-gray-700',
    }
  }[role] || colorScheme.default;
  
  // Auto-retry mechanism for persistent role issues
  useEffect(() => {
    // Set up error detection - if we're stuck in verification for too long
    const errorTimeout = setTimeout(() => {
      if (progressStage < 4 && !error) {
        setError(`Unable to verify ${role} access. Try refreshing the page.`);
      }
    }, 3000); // 3 seconds to detect a potential role issue
    
    return () => {
      clearTimeout(errorTimeout);
    };
  }, [progressStage, error, role]);

  // Handle automatic retry when error is detected
  useEffect(() => {
    if (error && retryCount < 2) { // Limit to 2 automatic retries
      const retryTimeout = setTimeout(() => {
        console.log(`Auto-retrying role verification (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        setProgressStage(0);
        setProgressText(isRecovering ? 'Retrying recovery...' : 'Retrying verification...');
        setError(null);
        
        // Try to refresh the role from localStorage
        const cachedRole = localStorage.getItem('user_role');
        if (cachedRole) {
          console.log('Found cached role during retry:', cachedRole);
        }
      }, 1000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [error, retryCount, isRecovering]);
  
  // Simulate progress stages - faster with error handling
  useEffect(() => {
    // Don't continue if we have an error
    if (error) return;
    
    const stages = [
      { text: isRecovering ? 'Recovering session...' : 'Initializing...', delay: 50 },
      { text: 'Verifying credentials...', delay: 150 },
      { text: `Checking ${role} permissions...`, delay: 250 },
      { text: isRecovering ? 'Restoring previous session...' : 'Preparing dashboard...', delay: 350 }
    ];
    
    // Add a final stage that completes very quickly
    if (isRecovering) {
      stages.push({ text: 'Session restored!', delay: 450 });
    } else {
      stages.push({ text: 'Ready!', delay: 450 });
    }
    
    let timeouts = [];
    
    stages.forEach((stage, index) => {
      const timeout = setTimeout(() => {
        setProgressStage(index + 1);
        setProgressText(stage.text);
        
        // Trigger fade out animation when reaching the last stage
        if (index === stages.length - 1) {
          setTimeout(() => {
            setFadeOut(true);
          }, 200); // Short delay after showing "Ready!" before starting to fade out
        }
      }, stage.delay);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [role, isRecovering, error, retryCount]);
  
  // Calculate progress percentage - now accounts for 5 stages
  const progressPercentage = (progressStage / 5) * 100;
  
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-50 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center max-w-md text-center">
        {/* Logo or brand */}
        <div className="mb-8">
          <img src="/relyloop.svg" alt="RelyLoop" className="h-12 w-auto mx-auto" />
          <h2 className="text-2xl font-medium mt-2 font-montserrat-alternates text-black">RelyLoop</h2>
        </div>
        
        {/* Main spinner - faster animation */}
        <div className="relative w-20 h-20 mb-4">
          <div className={`absolute inset-0 animate-ping rounded-full ${colorScheme.accent} opacity-20 duration-75`}></div>
          <div className={`relative animate-spin rounded-full h-full w-full border-t-3 border-b-3 ${colorScheme.primary}`} 
               style={{ animationDuration: '0.6s' }}></div>
        </div>
        
        {/* Status text - with transition effect */}
        <p className="text-lg font-medium text-gray-700 h-7 transition-all duration-150">
          {progressText}
        </p>
        <p className="text-sm text-gray-500 mt-1 capitalize h-5">
          {isRecovering ? 'Recovering' : 'Loading'} {role} access
        </p>
        
        {/* Progress bar - faster transitions */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
          <div 
            className={`h-full ${colorScheme.secondary} transition-all duration-150 ease-out`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Add quick-fade effect when almost done */}
        {progressStage >= 4 && !error && (
          <p className="text-xs text-gray-400 mt-3 animate-pulse">
            Almost there...
          </p>
        )}
        
        {/* Error message and retry button */}
        {error && (
          <div className="mt-6 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => {
                  setError(null);
                  setProgressStage(0);
                  setProgressText('Restarting verification...');
                  setRetryCount(prev => prev + 1);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 text-sm"
              >
                Try Again
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Attempt {retryCount + 1} of 3
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
