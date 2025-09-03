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
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
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

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientAPI.getPatients();
      setPatients(data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again.');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
      await patientAPI.createPatient(newPatient);
      setIsAddPatientModalOpen(false);
      setNewPatient({
        first_name: '',
        last_name: '',
        gender: 'Male',
        dob: '',
        mrn: '',
        department: 'Cardiology',
        attending_doctor: ''
      });
      fetchPatients();
    } catch (err) {
      console.error('Error adding patient:', err);
      setError('Failed to add patient. Please try again.');
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientAPI.deletePatient(patientId);
        fetchPatients();
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Failed to delete patient. Please try again.');
      }
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsViewPatientModalOpen(true);
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
      attending_doctor: ''
    });
  };

  const handleCloseViewModal = () => {
    setIsViewPatientModalOpen(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.mrn?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '' || patient.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Patients</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all patients in the system including their personal information and medical details.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsAddPatientModalOpen(true)}
              className="flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5" />
              Add Patient
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-8 sm:flex sm:gap-4 sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Patient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        MRN
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Age
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Attending Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Admission Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                          No patients found.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {patient.first_name?.[0]}{patient.last_name?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {patient.first_name} {patient.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{patient.gender}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.mrn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {calculateAge(patient.dob)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.attending_doctor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(patient.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => handleViewPatient(patient)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeletePatient(patient.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
            />
            <div className="relative bg-white rounded-lg w-full max-w-3xl mx-auto shadow-xl z-20">
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">
                    Patient Details
                  </h3>
                  <button
                    onClick={handleCloseViewModal}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-base font-medium text-gray-900">
                          {selectedPatient.first_name} {selectedPatient.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="text-base text-gray-900">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="text-base text-gray-900">{calculateAge(selectedPatient.dob)} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="text-base text-gray-900">{formatDate(selectedPatient.dob)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Medical Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Medical Record Number</p>
                        <p className="text-base font-medium text-gray-900">{selectedPatient.mrn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-base text-gray-900">{selectedPatient.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Attending Doctor</p>
                        <p className="text-base text-gray-900">{selectedPatient.attending_doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Admission Date</p>
                        <p className="text-base text-gray-900">{formatDate(selectedPatient.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
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
      )}
    </div>
  );
}
