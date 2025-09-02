import { useState, useEffect, useCallback } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { patientAPI } from '../../services/api';

// Helper functions
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Simple, inline components
function SearchIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

SearchIcon.propTypes = {
  className: PropTypes.string
};

PlusIcon.propTypes = {
  className: PropTypes.string
};

export default function NursePatients() {
  const navigate = useNavigate();
  const [currentDepartment] = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  
  // Define fetchPatients before it's used in useEffect
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch patients from API with department filtering temporarily removed
      console.log('Making API call to patientAPI.getPatients');
      
      // Temporarily remove department filter to debug
      const response = await patientAPI.getPatients(); // Remove currentDepartment parameter
      console.log('API response received:', response);
      console.log('API response type:', typeof response);
      console.log('API response keys:', Object.keys(response || {}));
      console.log('Full response structure:', JSON.stringify(response, null, 2));
      
      const data = response.data || response.patients || [];
      console.log('Extracted patients data:', data);
      console.log('Number of patients:', Array.isArray(data) ? data.length : 'Not an array');
      console.log('Data type:', typeof data, Array.isArray(data) ? 'is array' : 'not array');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('First patient object:', data[0]);
        console.log('First patient keys:', Object.keys(data[0] || {}));
        console.log('First patient first_name:', data[0]?.first_name);
        console.log('First patient last_name:', data[0]?.last_name);
        console.log('First patient mrn:', data[0]?.mrn);
      }
      
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients from API:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(`Failed to load patient data: ${err.message}. Please check if the backend server is running.`);
      // Fallback to empty array instead of localStorage
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove currentDepartment dependency to prevent infinite re-renders
  // Now use the fetchPatients function in useEffect
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddPatientClick = () => {
    navigate('/nurse/patients/new');
  };
  
  const handleAddVitals = (patient) => {
    navigate(`/nurse/vitals?patient=${encodeURIComponent(patient.id)}`);
  };
  
  // Filter patients based on search term
  const filteredPatients = searchTerm
    ? patients.filter(p => 
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.medical_conditions && p.medical_conditions.some(condition => 
          condition.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : patients || [];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchPatients}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">Department: <span className="font-medium text-blue-700">{currentDepartment || 'Not assigned'}</span></p>
        </div>
        <button
          onClick={handleAddPatientClick}
          className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, MRN, or condition..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No patients found</td>
                </tr>
              )}
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/nurse/patients/${p.id}`} className="text-blue-700 hover:underline font-medium">
                      {p.first_name} {p.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.mrn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{calculateAge(p.dob)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.attending_doctor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(p.last_visit || p.last_admission)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/nurse/patients/${p.id}`}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      View
                    </Link>
                    <Link
                      to={`/nurse/patients/${p.id}/edit`}
                      className="text-indigo-700 hover:text-indigo-800"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleAddVitals(p)}
                      className="text-blue-700 hover:text-blue-800"
                    >
                      Add Vitals
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
