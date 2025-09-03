import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { patientAPI } from '../../services/api';
import PropTypes from 'prop-types';

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

function SearchIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

// PropTypes
SearchIcon.propTypes = {
  className: PropTypes.string
};

PlusIcon.propTypes = {
  className: PropTypes.string
};

export default function Patients() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isViewPatientModalOpen, setIsViewPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    mrn: '',
    attending_doctor: ''
  });
  
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch real data from API with pagination support
      const response = await patientAPI.getPatients(null, searchTerm, pagination.limit, (pagination.page - 1) * pagination.limit);
      
      if (response && response.patients) {
        const { patients: fetchedPatients, totalPatients } = response;
        
        // Map the data to ensure risk assessment is available
        const patientsWithRisk = (fetchedPatients || []).map(patient => {
          const riskScore = patient.risk_score || Math.random() * 0.5 + 0.3;
          let riskLevel = patient.risk_level;
          if (!riskLevel) {
            if (riskScore > 0.7) {
              riskLevel = 'high';
            } else if (riskScore > 0.4) {
              riskLevel = 'medium';
            } else {
              riskLevel = 'low';
            }
          }
          
          return {
            ...patient,
            risk_score: riskScore,
            risk_level: riskLevel
          };
        });
        
        setPatients(patientsWithRisk);
        const totalPages = Math.ceil(totalPatients / pagination.limit);
        setPagination(prev => ({
          ...prev,
          total: totalPatients || 0,
          totalPages: totalPages
        }));
      } else {
        throw new Error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(`Failed to load patients: ${error.message}. Please check if the backend server is running.`);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, pagination.limit, pagination.page]);
  
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Reset to page 1 when searching
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const handleAddPatientClick = () => {
    setIsAddPatientModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsAddPatientModalOpen(false);
    // Reset form
    setNewPatient({
      first_name: '',
      last_name: '',
      gender: 'Male',
      dob: '',
      mrn: '',
      department: 'Cardiology',
      attending_doctor: ''
    });
  };
  
  const handleViewPatient = (patient) => {
    console.log("View patient triggered with:", patient);
    setSelectedPatient(patient);
    setIsViewPatientModalOpen(true);
  };
  
  const handleCloseViewModal = () => {
    setIsViewPatientModalOpen(false);
    setSelectedPatient(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Send data to backend API
      const response = await patientAPI.createPatient(newPatient);
      
      if (response.statusCode === 201) {
        // Successfully created, refresh the list
        await fetchPatients();
        handleCloseModal();
      } else {
        throw new Error(response.message || 'Failed to create patient');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      setError(`Failed to create patient: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await patientAPI.deletePatient(patientId);
      
      // Remove patient from local state immediately
      setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
      
      // Refresh the list to ensure consistency
      await fetchPatients();
      
      // Close modal if the deleted patient was being viewed
      if (selectedPatient && selectedPatient.id === patientId) {
        setIsViewPatientModalOpen(false);
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError(`Failed to delete patient: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
        
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2 h-10 sm:text-sm border-gray-300 bg-white bg-opacity-90 rounded-md shadow-sm text-gray-900"
                  placeholder="Search by name or MRN"
                />
              </div>
            </div>
            
            
            <div className="flex space-x-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleAddPatientClick}
                  className="inline-flex items-center px-5 py-2 h-10 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Add Patient
                </button>
              )}
            </div>
          </div>
          

          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
              <p>{error}</p>
              <button 
                onClick={fetchPatients}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
          
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MRN
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Admission
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Table content logic */}
                {isLoading && (
                  // Loading skeletons
                  [...Array(5)].map(() => (
                    <tr key={`skeleton-row-${Math.random().toString(36).substring(2, 11)}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                )}
                
                {!isLoading && patients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No patients found matching your search criteria.
                    </td>
                  </tr>
                )}
                
                {!isLoading && patients.length > 0 && 
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                            {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.gender}, {calculateAge(patient.dob)} years
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.mrn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(patient.last_admission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.attending_doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="flex items-center justify-center min-h-screen px-4">
            <button 
              className="fixed inset-0 bg-black opacity-30 w-full h-full border-0 p-0 cursor-default" 
              onClick={handleCloseModal}
              aria-label="Close modal"
            />
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10">
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Add New Patient
                </h3>
                
                <form onSubmit={handleAddPatient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value={newPatient.first_name}
                          onChange={handleInputChange}
                          required
                          className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={newPatient.last_name}
                          onChange={handleInputChange}
                          required
                          className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={newPatient.gender}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        id="dob"
                        value={newPatient.dob}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="mrn" className="block text-sm font-medium text-gray-700 mb-1">
                        Medical Record Number (MRN)
                      </label>
                      <input
                        type="text"
                        name="mrn"
                        id="mrn"
                        value={newPatient.mrn}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                        placeholder="MRN12350"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={newPatient.department}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Oncology">Oncology</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="attending_doctor" className="block text-sm font-medium text-gray-700 mb-1">
                        Attending Doctor
                      </label>
                      <input
                        type="text"
                        name="attending_doctor"
                        id="attending_doctor"
                        value={newPatient.attending_doctor}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-gray-300 bg-white bg-opacity-90 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3 text-gray-900"
                        placeholder="Dr. Smith"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-5 py-2 h-10 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 h-10 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Patient
                      </button>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {isViewPatientModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <button 
              className="fixed inset-0 bg-black opacity-30 w-full h-full border-0 p-0 cursor-default" 
              onClick={handleCloseViewModal}
              aria-label="Close modal"
            ></button>
            
            <div className="relative bg-white rounded-lg w-full max-w-3xl mx-auto shadow-xl z-20">
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">
                    Patient Details
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseViewModal}
                    className="bg-indigo-600 rounded-md text-white hover:text-gray-200 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Patient Basic Info */}
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <p><span className="font-medium">ID:</span> {selectedPatient.id}</p>
                      <p><span className="font-medium">MRN:</span> {selectedPatient.mrn}</p>
                      <p><span className="font-medium">Gender:</span> {selectedPatient.gender}</p>
                      <p><span className="font-medium">Age:</span> {calculateAge(selectedPatient.dob)} years</p>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                      <p><span className="font-medium">Email:</span> {selectedPatient.email || 'Not provided'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedPatient.phone || 'Not provided'}</p>
                      <p><span className="font-medium">Address:</span> {selectedPatient.address || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Medical Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <p><span className="font-medium">Department:</span> {selectedPatient.department}</p>
                      <p><span className="font-medium">Doctor:</span> {selectedPatient.attending_doctor}</p>
                      <p><span className="font-medium">Status:</span> {selectedPatient.status || 'Active'}</p>
                      <p><span className="font-medium">Blood Type:</span> {selectedPatient.blood_type || 'Not specified'}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Medical Conditions:</span> {
                          selectedPatient.medical_conditions && selectedPatient.medical_conditions.length > 0 
                            ? selectedPatient.medical_conditions.join(', ') 
                            : 'None recorded'
                        }
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Allergies:</span> {
                          selectedPatient.allergies && selectedPatient.allergies.length > 0 
                            ? selectedPatient.allergies.join(', ') 
                            : 'None recorded'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCloseViewModal}
                      className="px-6 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}