import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoHome = () => {
    navigate('/');
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">404</h2>
          <h3 className="mt-2 text-center text-xl font-bold text-gray-700">Page Not Found</h3>
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8 space-y-4">
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
