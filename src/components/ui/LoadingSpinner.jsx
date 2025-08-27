import React from 'react';

/**
 * Loading spinner component to display during authentication checks
 * @param {string} message - Message to display during loading
 * @param {string} type - Type of spinner (default, overlay, inline, card)
 * @param {string} size - Size of spinner (small, medium, large)
 */
export function LoadingSpinner({ 
  message = 'Loading...', 
  type = 'overlay',
  size = 'medium',
  showProgress = false,
  progress = 0
}) {
  // Determine spinner size based on size prop
  const spinnerSizeClasses = {
    small: 'h-8 w-8 border-t-2 border-b-2',
    medium: 'h-12 w-12 border-t-3 border-b-3',
    large: 'h-16 w-16 border-t-4 border-b-4',
  }[size] || 'h-12 w-12 border-t-3 border-b-3';
  
  // Text size based on spinner size
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size] || 'text-base';
  
  // Determine container style based on type
  if (type === 'overlay') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="flex flex-col items-center justify-center p-6">
          <div className={`animate-spin rounded-full ${spinnerSizeClasses} border-blue-800 mb-4`}></div>
          <p className={`text-gray-700 ${textSizeClasses} font-medium`}>{message}</p>
          {showProgress && (
            <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-blue-700 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (type === 'card') {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg flex flex-col items-center w-full">
        <div className={`animate-spin rounded-full ${spinnerSizeClasses} border-teal-600 mb-3`}></div>
        <p className={`text-gray-700 ${textSizeClasses} text-center`}>{message}</p>
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }
  
  if (type === 'inline') {
    return (
      <div className="flex items-center">
        <div className={`animate-spin rounded-full ${spinnerSizeClasses} border-teal-600 mr-3`}></div>
        <p className={`text-gray-700 ${textSizeClasses}`}>{message}</p>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full ${spinnerSizeClasses} border-teal-600 mb-2`}></div>
      <p className={`text-gray-700 ${textSizeClasses}`}>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
