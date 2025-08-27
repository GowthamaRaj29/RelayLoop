import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect based on role if already authenticated
  useEffect(() => {
    if (!isLoading && user && role) {
      switch(role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/patients');
          break;
        case 'nurse':
          navigate('/nurse/patients');
          break;
        default:
          // Fallback to a common dashboard if role is unknown
          navigate('/dashboard');
      }
    }
  }, [user, role, isLoading, navigate]);
  
  // If still checking auth status, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="RelayLoop Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to RelayLoop
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hospital Readmission Prediction
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}