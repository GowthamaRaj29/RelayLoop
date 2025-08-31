import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
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

export default function PatientsNew() {
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
    attending_doctor: '',
    email: '',
    phone: '',
    address: '',
    medical_conditions: '',
    notes: '',
    risk_level: 'low',
    risk_score: 0
  });
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      const mockPatients = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          dob: '1980-05-15',
          gender: 'Male',
          mrn: 'MRN12345',
          risk_score: 0.82,
          risk_level: 'high',
          last_admission: '2023-07-20',
          attending_doctor: 'Dr. Smith',
          department: 'Cardiology',
          email: 'john.doe@example.com',
          phone: '(555) 987-6543',
          address: '123 Main St, Anytown, CA',
          medical_conditions: ['Coronary Artery Disease', 'Hypertension'],
          last_visit: '2023-08-20',
          notes: 'Patient reports chest pain during physical activity. EKG shows abnormal readings. Scheduled for angiogram next week.'
        },
        {
          id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          dob: '1975-11-08',
          gender: 'Female',
          mrn: 'MRN12346',
          risk_score: 0.35,
          risk_level: 'medium',
          last_admission: '2023-08-05',
          attending_doctor: 'Dr. Johnson',
          department: 'Neurology',
          email: 'jane.smith@example.com',
          phone: '(555) 456-7890',
          address: '789 Oak St, Riverdale, NY',
          medical_conditions: ['Migraine', 'Anxiety'],
          last_visit: '2023-07-25',
          notes: 'Patient reports reduced frequency of migraines with new medication. Sleep pattern has improved. Continue current treatment plan.'
        },
        {
          id: '3',
          first_name: 'Robert',
          last_name: 'Williams',
          dob: '1990-03-22',
          gender: 'Male',
          mrn: 'MRN12347',
          risk_score: 0.15,
          risk_level: 'low',
          last_admission: '2023-08-15',
          attending_doctor: 'Dr. Davis',
          department: 'General',
          email: 'robert.williams@example.com',
          phone: '(555) 234-5678',
          address: '567 Pine St, Westfield, MA',
          medical_conditions: ['Seasonal Allergies'],
          last_visit: '2023-08-10',
          notes: 'Annual check-up completed. All vitals normal. Prescription for allergy medication renewed.'
        }
      ];
      
      setPatients(mockPatients);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patient data. Please try again.');
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
    setNewPatient({
      first_name: '',
      last_name: '',
      gender: 'Male',
      dob: '',
      mrn: '',
      department: 'Cardiology',
      attending_doctor: '',
      email: '',
      phone: '',
      address: '',
      medical_conditions: '',
      notes: '',
      risk_level: 'low',
      risk_score: 0
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
    
    // Determine risk level if not provided
    let riskLevel = newPatient.risk_level || 'low';
    let riskScore = newPatient.risk_score || parseFloat(Math.random().toFixed(2));
    
    if (!newPatient.risk_level || !newPatient.risk_score) {
      const randomValue = Math.random();
      if (randomValue > 0.66) {
        riskLevel = 'high';
        riskScore = (0.8 + Math.random() * 0.2).toFixed(2);
      } else if (randomValue > 0.33) {
        riskLevel = 'medium';
        riskScore = (0.3 + Math.random() * 0.3).toFixed(2);
      } else {
        riskLevel = 'low';
        riskScore = (Math.random() * 0.3).toFixed(2);
      }
    }
    
    // Process medical conditions into array
    const medical_conditions = newPatient.medical_conditions
      ? newPatient.medical_conditions.split(',').map(item => item.trim())
      : [];
    
    const newPatientData = {
      ...newPatient,
      id: `${patients.length + 1}`,
      risk_score: parseFloat(riskScore),
      risk_level: riskLevel,
      medical_conditions,
      last_admission: new Date().toISOString().split('T')[0],
      last_visit: new Date().toISOString().split('T')[0]
    };
    
    setPatients([newPatientData, ...patients]);
    handleCloseModal();
  };
  
  // Helper function for risk display
  const getRiskBadge = (riskLevel, riskScore) => {
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
    
    return (
      <div className="flex items-center">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
          {displayText}
        </span>
        <span className="ml-2 text-gray-500 text-xs">{scorePercent}%</span>
      </div>
    );
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
    <div className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Patients</h1>
        
        <div className="mt-4 sm:mt-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            {/* Search input */}
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:pl-10 py-2 h-9 sm:h-10 text-sm border-gray-300 bg-white rounded-md shadow-sm text-black"
                  placeholder="Search by name or MRN"
                />
              </div>
            </div>
            
            {/* Risk filter dropdown */}
            <div className="flex flex-shrink-0 w-full sm:w-auto">
              <select
                id="risk-filter"
                name="risk-filter"
                value={riskFilter}
                onChange={handleRiskFilterChange}
                className="block w-full pl-3 pr-10 py-2 h-9 sm:h-10 text-sm border-gray-300 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm text-black"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
            
            {/* Add patient button */}
            <div className="flex w-full sm:w-auto">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleAddPatientClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 h-9 sm:h-10 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  Add Patient
                </button>
              )}
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
              <p className="text-sm sm:text-base">{error}</p>
              <button 
                onClick={fetchPatients}
                className="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Patients table - responsive approach */}
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
            {/* Table layout for medium and large screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed md:table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:w-1/4 lg:w-auto">
                      Patient
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:w-[10%] lg:w-auto">
                      MRN
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:w-[13%] lg:w-auto">
                      Risk Level
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Department
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Last Admission
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:w-[15%] lg:w-auto">
                      Doctor
                    </th>
                    <th scope="col" className="relative px-3 lg:px-6 py-3 md:w-[15%] lg:w-auto">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Loading skeletons */}
                  {isLoading && (
                    [...Array(5)].map((_, i) => (
                      <tr key={`skeleton-${i}`}>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="ml-3 lg:ml-4">
                              <div className="h-4 bg-gray-200 rounded w-20 lg:w-24 mb-1 lg:mb-2 animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded w-24 lg:w-32 animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="h-4 bg-gray-200 rounded w-20 lg:w-24 animate-pulse"></div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                          <div className="h-4 bg-gray-200 rounded w-16 lg:w-20 animate-pulse"></div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20 lg:w-28 animate-pulse"></div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  )}
                  
                  {/* No results */}
                  {!isLoading && filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 lg:px-6 py-4 text-center text-sm text-gray-500">
                        No patients found matching your search criteria.
                      </td>
                    </tr>
                  )}
                  
                  {/* Patient rows */}
                  {!isLoading && filteredPatients.length > 0 && 
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm">
                              {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                            </div>
                            <div className="ml-3 lg:ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate md:max-w-[120px] lg:max-w-none">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-xs lg:text-sm text-gray-500">
                                {patient.gender}, {calculateAge(patient.dob)} years
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                          {patient.mrn}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          {getRiskBadge(patient.risk_level, patient.risk_score)}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden lg:table-cell">
                          {patient.department}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden xl:table-cell">
                          {formatDate(patient.last_admission)}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 truncate md:max-w-[100px] lg:max-w-none">
                          {patient.attending_doctor}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                          <button 
                            onClick={() => handleViewPatient(patient)}
                            className="text-blue-600 hover:text-blue-800 mr-2 lg:mr-4 font-medium"
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
            
            {/* Small screens - card layout */}
            <div className="md:hidden">
              {/* Loading skeletons for mobile */}
              {isLoading && (
                <div className="divide-y divide-gray-200">
                  {[...Array(3)].map((_, i) => (
                    <div key={`mobile-skeleton-${i}`} className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="ml-3 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-2/5 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No results for mobile */}
              {!isLoading && filteredPatients.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No patients found matching your search criteria.
                </div>
              )}
              
              {/* Patient cards for mobile */}
              {!isLoading && filteredPatients.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                          {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {patient.first_name} {patient.last_name}
                          </div>
                          <div className="text-xs text-gray-500 flex flex-wrap items-center">
                            <span>{patient.gender}, {calculateAge(patient.dob)} yrs</span>
                            <span className="mx-1.5">•</span>
                            <span>{patient.mrn}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs mb-3">
                        <div className="overflow-hidden">
                          <span className="text-gray-500">Department:</span> <span className="font-medium truncate block">{patient.department}</span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-gray-500">Doctor:</span> <span className="font-medium truncate block">{patient.attending_doctor}</span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-gray-500">Last Admission:</span> <span className="font-medium block">{formatDate(patient.last_admission)}</span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-gray-500">Risk:</span> <span className="block pt-1">{getRiskBadge(patient.risk_level, patient.risk_score)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3 space-x-3">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          View
                        </button>
                        <button
                          onClick={() => console.log(`Edit patient ${patient.id}`)}
                          className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Patient Modal */}
      <Dialog
        open={isAddPatientModalOpen}
        onClose={handleCloseModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-80" />
        
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white shadow-xl my-4 mx-2 sm:mx-4">
            <div className="bg-indigo-600 px-4 sm:px-6 py-4 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-base sm:text-lg font-medium text-white">
                  Add New Patient
                </Dialog.Title>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddPatient} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <div className=" p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                
                <div className="mt-3 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4">
                  <div>
                    <label htmlFor="first_name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={newPatient.first_name}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={newPatient.last_name}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm text-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dob" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      value={newPatient.dob}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={newPatient.gender}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newPatient.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={newPatient.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={newPatient.address}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                      placeholder="Street address, city, state, zip code"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Medical Information</h3>
                
                <div className="mt-3 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4">
                  <div>
                    <label htmlFor="mrn" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Medical Record Number (MRN)
                    </label>
                    <input
                      type="text"
                      name="mrn"
                      id="mrn"
                      value={newPatient.mrn}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={newPatient.department}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Oncology">Oncology</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="attending_doctor" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Attending Doctor
                    </label>
                    <input
                      type="text"
                      name="attending_doctor"
                      id="attending_doctor"
                      value={newPatient.attending_doctor}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="risk_level" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Risk Level
                    </label>
                    <select
                      id="risk_level"
                      name="risk_level"
                      value={newPatient.risk_level}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="medical_conditions" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Medical Conditions
                    </label>
                    <input
                      type="text"
                      name="medical_conditions"
                      id="medical_conditions"
                      value={newPatient.medical_conditions}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-9 sm:h-10 px-3 text-sm"
                      placeholder="Separate conditions with commas (e.g., Hypertension, Diabetes)"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <label htmlFor="notes" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  value={newPatient.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 text-sm text-black"
                  placeholder="Add any relevant patient notes here"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 sm:space-x-3 sticky bottom-0 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 border border-transparent rounded-md text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
      
      {/* View Patient Modal */}
      <Dialog
        open={isViewPatientModalOpen}
        onClose={handleCloseViewModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-80" />
        
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white shadow-xl overflow-hidden my-4 mx-2 sm:mx-4">
            <div className="bg-indigo-600 px-4 sm:px-6 py-4 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-base sm:text-lg font-medium text-white">
                  Patient Details
                </Dialog.Title>
                <button
                  type="button"
                  onClick={handleCloseViewModal}
                  className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {selectedPatient && (
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <div className="border-b pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span>ID:</span> <span className="ml-1 font-medium">{selectedPatient.id}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center">
                      <span>Gender:</span> <span className="ml-1 font-medium">{selectedPatient.gender}</span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="flex items-center">
                      <span>Age:</span> <span className="ml-1 font-medium">{calculateAge(selectedPatient.dob)} years</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="flex items-center text-sm text-black">
                      Risk Level: {' '}
                      {selectedPatient.risk_level === 'high' && (
                        <span className="ml-1 px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-red-100 text-red-800">
                          High ({Math.round(selectedPatient.risk_score * 100)}%)
                        </span>
                      )}
                      {selectedPatient.risk_level === 'medium' && (
                        <span className="ml-1 px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Medium ({Math.round(selectedPatient.risk_score * 100)}%)
                        </span>
                      )}
                      {selectedPatient.risk_level === 'low' && (
                        <span className="ml-1 px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Low ({Math.round(selectedPatient.risk_score * 100)}%)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Personal Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Date of Birth</p>
                        <p className="text-sm sm:text-base text-gray-900">{new Date(selectedPatient.dob).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm sm:text-base text-gray-900 break-words">{selectedPatient.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm sm:text-base text-gray-900">{selectedPatient.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Address</p>
                        <p className="text-sm sm:text-base text-gray-900 break-words">{selectedPatient.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Medical Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Department</p>
                        <p className="text-sm sm:text-base text-gray-900">{selectedPatient.department}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Attending Doctor</p>
                        <p className="text-sm sm:text-base text-gray-900">{selectedPatient.attending_doctor}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Medical Conditions</p>
                        <p className="text-sm sm:text-base text-gray-900 break-words">
                          {selectedPatient.medical_conditions?.length > 0 
                            ? selectedPatient.medical_conditions.join(', ') 
                            : 'None recorded'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Last Visit</p>
                        <p className="text-sm sm:text-base text-gray-900">
                          {selectedPatient.last_visit ? new Date(selectedPatient.last_visit).toLocaleDateString() : 'No visits recorded'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedPatient.notes && (
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Notes</h3>
                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">{selectedPatient.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end pt-2 sm:pt-4 sticky bottom-0">
                  <button
                    type="button"
                    onClick={handleCloseViewModal}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
