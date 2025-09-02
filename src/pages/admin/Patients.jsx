import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { patientAPI } from '../../services/api';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

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

// Helper function for risk badge
function getRiskDisplay(riskLevel, riskScore) {
  let colorClass;
  
  switch (riskLevel) {
    case 'high':
      colorClass = 'bg-red-100 text-red-800';
      break;
    case 'medium':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'low':
      colorClass = 'bg-green-100 text-green-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }
  
  const displayText = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const scorePercent = Math.round(riskScore * 100);
  
  return { colorClass, displayText, scorePercent };
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
  const [riskFilter, setRiskFilter] = useState('all');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isViewPatientModalOpen, setIsViewPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    mrn: '',
    department: 'Cardiology',
    attending_doctor: ''
  });
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data from API instead of mock data
      const response = await patientAPI.getPatients(); // Admin can see all departments
      const data = response.data || response.patients || [];
      
      // Map the data to ensure risk assessment is available (could be calculated or from backend)
      const patientsWithRisk = data.map(patient => {
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
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(`Failed to load patients: ${error.message}. Please check if the backend server is running.`);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleRiskFilterChange = (e) => {
    setRiskFilter(e.target.value);
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
  
  const handleAddPatient = (e) => {
    e.preventDefault();
    
    // Determine risk level
    let riskLevel = 'low';
    const randomValue = Math.random();
    if (randomValue > 0.66) {
      riskLevel = 'high';
    } else if (randomValue > 0.33) {
      riskLevel = 'medium';
    }
    
    // In a real app, this would send data to the backend
    const newPatientData = {
      ...newPatient,
      id: `${patients.length + 1}`,
      risk_score: parseFloat(Math.random().toFixed(2)),
      risk_level: riskLevel,
      last_admission: new Date().toISOString().split('T')[0]
    };
    
    setPatients([newPatientData, ...patients]);
    handleCloseModal();
  };
  
  // Filter patients based on search term and risk filter
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || patient.risk_level === riskFilter;
    
    return matchesSearch && matchesRisk;
  });
  
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
            
            <div className="flex flex-shrink-0">
              <select
                id="risk-filter"
                name="risk-filter"
                value={riskFilter}
                onChange={handleRiskFilterChange}
                className="block w-full pl-3 pr-10 py-2 h-10 text-base border-gray-300 bg-white bg-opacity-90 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm text-gray-900"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
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
                    Risk Level
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
                
                {!isLoading && filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No patients found matching your search criteria.
                    </td>
                  </tr>
                )}
                
                {!isLoading && filteredPatients.length > 0 && 
                  filteredPatients.map((patient) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const { colorClass, displayText, scorePercent } = getRiskDisplay(patient.risk_level, patient.risk_score);
                          return (
                            <div className="flex items-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                                {displayText}
                              </span>
                              <span className="ml-2 text-gray-500 text-xs">{scorePercent}%</span>
                            </div>
                          );
                        })()}
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
                          onClick={() => console.log(`Edit patient ${patient.id}`)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Patient Modal */}
      <Dialog
        open={isAddPatientModalOpen}
        onClose={handleCloseModal}
        className="relative z-50"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-opacity-80 backdrop-blur-xs" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
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
      </Dialog>

      {/* Simple View Patient Modal */}
      <Dialog
        open={isViewPatientModalOpen}
        onClose={handleCloseViewModal}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg w-full max-w-3xl mx-auto shadow-xl z-20 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-medium text-white">
                  Patient Details
                </Dialog.Title>
                <button
                  type="button"
                  onClick={handleCloseViewModal}
                  className="bg-indigo-600 rounded-md text-white hover:text-gray-200 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedPatient && (
                <div className="space-y-6">
                  {/* Simple patient details */}
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </h2>
                    <p className="text-gray-600">ID: {selectedPatient.id}</p>
                    <p className="text-gray-600">Gender: {selectedPatient.gender}</p>
                    <p className="text-gray-600">Age: {calculateAge(selectedPatient.dob)} years</p>
                    <p className="text-gray-600">
                      Risk Level: {" "}
                      {(() => {
                        const { colorClass, displayText, scorePercent } = getRiskDisplay(selectedPatient.risk_level, selectedPatient.risk_score);
                        return (
                          <span className="inline-flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                              {displayText}
                            </span>
                            <span className="ml-1 text-gray-500 text-xs">({scorePercent}%)</span>
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                      <p>Email: {selectedPatient.email || 'Not provided'}</p>
                      <p>Phone: {selectedPatient.phone || 'Not provided'}</p>
                      <p>Address: {selectedPatient.address || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Medical Information</h3>
                      <p>Department: {selectedPatient.department}</p>
                      <p>Doctor: {selectedPatient.attending_doctor}</p>
                      <p>Medical Conditions: {selectedPatient.medical_conditions?.length ? selectedPatient.medical_conditions.join(', ') : 'None recorded'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={handleCloseViewModal}
                      className="px-5 py-2 h-10 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}






