import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { getPatientsByDepartment, updatePatient } from '../../utils/patientsStore';

const NurseVitals = () => {
  const navigate = useNavigate();
  const [currentDepartment] = useOutletContext();

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsData, setVitalsData] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Centralized loader to reuse on Retry
  const loadPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = getPatientsByDepartment(currentDepartment) || [];
      setPatients(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentDepartment]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (patient.first_name || '').toLowerCase().includes(searchLower) ||
      (patient.last_name || '').toLowerCase().includes(searchLower) ||
      (patient.mrn || '').toLowerCase().includes(searchLower) ||
      (patient.room || '').toLowerCase().includes(searchLower)
    );
  });

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setVitalsData({
      temperature: '',
      heartRate: '',
      bloodPressure: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      notes: ''
    });
  };

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitVitals = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate network
      await new Promise(resolve => setTimeout(resolve, 800));

      // Persist vitals to store and update local state
      const updated = updatePatient(selectedPatient.id, {
        vitals: {
          ...vitalsData,
          lastUpdated: new Date().toISOString()
        }
      });
      setPatients(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Failed to save vitals', err);
      alert('Failed to save vitals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    if (selectedPatient?.id) {
      navigate(`/nurse/patients/${selectedPatient.id}`);
    }
  };

  const handleViewPatientDetails = () => {
    if (selectedPatient?.id) {
      navigate(`/nurse/patients/${selectedPatient.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-red-700">{error}</p>
        <button
          type="button"
          onClick={loadPatients}
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Record Patient Vitals</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="w-64 rounded-md border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-md border border-blue-200">
            <span className="font-medium mr-2">Department:</span> {currentDepartment || 'Not assigned'}
            <span className="ml-2 text-sm text-blue-500">(Showing patients only from your department)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Patient</h2>
              <div className="overflow-y-auto max-h-96">
                {filteredPatients.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <li key={patient.id}>
                        <button
                          type="button"
                          className={`w-full text-left px-4 py-4 hover:bg-gray-50 ${
                            selectedPatient?.id === patient.id ? 'bg-indigo-50' : ''
                          }`}
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="text-sm font-medium text-indigo-600">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {patient.mrn} • {patient.room ? `Room ${patient.room}` : 'No room'}
                              </div>
                            </div>
                            {selectedPatient?.id === patient.id && (
                              <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">No patients found</p>
                )}
              </div>
            </div>
          </div>

          {/* Vitals Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow sm:rounded-lg">
              {selectedPatient ? (
                <div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {selectedPatient.first_name} {selectedPatient.last_name}
                        </h2>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>{selectedPatient.gender}, {calculateAge(selectedPatient.dob)} years</p>
                          <p>MRN: {selectedPatient.mrn} • Room {selectedPatient.room}</p>
                          <p className="mt-1">Attending: {selectedPatient.attending_doctor}</p>
                          <p className="mt-1">Department: {selectedPatient.department}</p>
                        </div>
                        {Array.isArray(selectedPatient.medical_conditions) && selectedPatient.medical_conditions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Medical Conditions:</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedPatient.medical_conditions.map((condition) => (
                                <span
                                  key={`${condition}-${selectedPatient.id}`}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                >
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleViewPatientDetails}
                        className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900">Record Vital Signs</h3>
                      {selectedPatient.vitals && (
                        <div className="mt-2 text-sm text-gray-500">
                          Last updated: {formatDate(selectedPatient.vitals.lastUpdated)}
                        </div>
                      )}
                      <form onSubmit={handleSubmitVitals} className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                            Temperature (°C)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            name="temperature"
                            id="temperature"
                            value={vitalsData.temperature}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="36.5"
                          />
                        </div>

                        <div>
                          <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                            Heart Rate (bpm)
                          </label>
                          <input
                            type="number"
                            name="heartRate"
                            id="heartRate"
                            value={vitalsData.heartRate}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="75"
                          />
                        </div>

                        <div>
                          <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
                            Blood Pressure (mmHg)
                          </label>
                          <input
                            type="text"
                            name="bloodPressure"
                            id="bloodPressure"
                            value={vitalsData.bloodPressure}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="120/80"
                          />
                        </div>

                        <div>
                          <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
                            Respiratory Rate (breaths/min)
                          </label>
                          <input
                            type="number"
                            name="respiratoryRate"
                            id="respiratoryRate"
                            value={vitalsData.respiratoryRate}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="16"
                          />
                        </div>

                        <div>
                          <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
                            Oxygen Saturation (%)
                          </label>
                          <input
                            type="number"
                            name="oxygenSaturation"
                            id="oxygenSaturation"
                            value={vitalsData.oxygenSaturation}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="98"
                          />
                        </div>

                        <div>
                          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            name="weight"
                            id="weight"
                            value={vitalsData.weight}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="70"
                          />
                        </div>

                        <div>
                          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            name="height"
                            id="height"
                            value={vitalsData.height}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="170"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            id="notes"
                            value={vitalsData.notes}
                            onChange={handleVitalsChange}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Any additional observations..."
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : (
                              'Save Vitals'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patient selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a patient from the list to record their vital signs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal open={isSuccessModalOpen} onClose={handleCloseSuccessModal} title="Vitals Recorded Successfully" size="md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="mt-3 text-lg font-medium text-gray-900">Vitals Recorded Successfully</div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              The patient's vital signs have been successfully updated.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              onClick={handleCloseSuccessModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NurseVitals;
