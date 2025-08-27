import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If user has a specific role, redirect them to their specific dashboard
    if (!isLoading && user && role) {
      if (role === 'admin' || role === 'doctor' || role === 'nurse') {
        setIsRedirecting(true);
        const dashboardPath = `/${role}/dashboard`;
        setTimeout(() => navigate(dashboardPath), 1500);
      }
    }
  }, [user, role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to RelayLoop
          </h1>
          
          {isRedirecting && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
              We've detected your role as <strong>{role}</strong>. Redirecting you to the appropriate dashboard...
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {!role ? (
              "We're setting up your account. Your role is being configured by an administrator."
            ) : (
              `You are logged in as a ${role}.`
            )}
          </p>
          
          {/* User profile info */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium text-xs">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Sign In</p>
                <p className="font-medium">
                  {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleString() 
                    : 'First login'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Access Level</p>
                <p className="font-medium">{role || 'Standard User'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center border-b border-gray-100 pb-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">System login</p>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
