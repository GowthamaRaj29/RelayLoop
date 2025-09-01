import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import VitalSignsForm from '../../components/forms/VitalSignsForm';
import { useAuth } from '../../hooks/useAuth';

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

export default function NurseVitals() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        const mockData = [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            dob: '1980-05-15',
            gender: 'Male',
            mrn: 'MRN12345',
            room: '205-A',
            department: 'Cardiology',
            attending_doctor: 'Dr. Smith',
            medical_conditions: ['Hypertension', 'Diabetes Type 2'],
            last_vitals_date: '2023-09-01T08:30:00',
            vitals: {
              temperature: '37.2',
              bloodPressure: '120/80',
              heartRate: '75',
              respiratoryRate: '16',
              oxygenSaturation: '98',
              weight: '70',
              height: '175',
              lastUpdated: '2023-09-01T08:30:00'
            }
          }
        ];
        setPatients(mockData);
      } catch (err) {
        setError('Failed to fetch patients');
        console.error('Error fetching patients:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.mrn.toLowerCase().includes(searchLower) ||
      patient.room.toLowerCase().includes(searchLower)
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
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update patients state with new vitals
      const updatedPatients = patients.map(patient => {
        if (patient.id === selectedPatient.id) {
          return {
            ...patient,
            vitals: {
              ...vitalsData,
              lastUpdated: new Date().toISOString()
            }
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      setIsSuccessModalOpen(true);
      
    } catch (err) {
      console.error('Error submitting vitals:', err);
      alert('Failed to submit vitals data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedPatient(null);
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

  const handleViewPatientDetails = () => {
    if (selectedPatient) {
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
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Patient</h2>
              <div className="overflow-y-auto max-h-96">
                {filteredPatients.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <li
                        key={patient.id}
                        className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${
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
                              {patient.mrn} • Room {patient.room}
                            </div>
                          </div>
                          {selectedPatient?.id === patient.id && (
                            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
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
                        </div>
                        {selectedPatient.medical_conditions?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedPatient.medical_conditions.map((condition, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleViewPatientDetails}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>

                    <form onSubmit={handleSubmitVitals} className="mt-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                            Temperature (°C)
                          </label>
                          <input
                            type="text"
                            name="temperature"
                            id="temperature"
                            required
                            value={vitalsData.temperature}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                            Heart Rate (bpm)
                          </label>
                          <input
                            type="text"
                            name="heartRate"
                            id="heartRate"
                            required
                            value={vitalsData.heartRate}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            required
                            value={vitalsData.bloodPressure}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
                            Respiratory Rate
                          </label>
                          <input
                            type="text"
                            name="respiratoryRate"
                            id="respiratoryRate"
                            required
                            value={vitalsData.respiratoryRate}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
                            O₂ Saturation (%)
                          </label>
                          <input
                            type="text"
                            name="oxygenSaturation"
                            id="oxygenSaturation"
                            required
                            value={vitalsData.oxygenSaturation}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            id="notes"
                            rows="3"
                            value={vitalsData.notes}
                            onChange={handleVitalsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isSubmitting
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }`}
                        >
                          {isSubmitting ? 'Saving...' : 'Record Vitals'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No patient selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a patient from the list to record vital signs
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog
        open={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg w-full max-w-md mx-auto p-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="mt-3 text-center">
              <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                Vitals Recorded Successfully
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  The vital signs have been recorded successfully.
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleCloseSuccessModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
