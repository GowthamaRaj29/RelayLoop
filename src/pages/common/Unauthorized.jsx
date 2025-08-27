import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  
  // Check if we have a custom message passed from the PrivateRoute
  const customMessage = location.state?.message;
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoHome = () => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'doctor') {
      navigate('/doctor/patients');
    } else if (role === 'nurse') {
      navigate('/nurse/patients');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/relyloop.svg"
            alt="RelayLoop"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this page
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {customMessage || `Your current role (${role || 'none'}) doesn't have the necessary permissions to view this content.`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleGoBack}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ExclamationIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);
