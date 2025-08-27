import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('admissions');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock patient data
        const mockPatient = {
          id: parseInt(patientId),
          mrn: `MRN${50000 + parseInt(patientId)}`,
          name: 'Alice Johnson',
          dob: '1978-04-12',
          gender: 'Female',
          department: 'Cardiology',
          primaryDoctor: 'Dr. Jane Smith',
          contactPhone: '(555) 123-4567',
          contactEmail: 'alice.johnson@example.com',
          address: '123 Main St, Anytown, CA 90210',
          insurance: 'BlueCross BlueShield',
          riskScore: 0.87,
          lastAdmissionDate: '2025-07-15',
          admissions: [
            { id: 1, admitDate: '2025-07-15', dischargeDate: '2025-07-20', reason: 'Chest pain', department: 'Cardiology', doctor: 'Dr. Jane Smith' },
            { id: 2, admitDate: '2025-03-22', dischargeDate: '2025-03-28', reason: 'Heart palpitations', department: 'Cardiology', doctor: 'Dr. Jane Smith' },
            { id: 3, admitDate: '2024-11-10', dischargeDate: '2024-11-15', reason: 'Shortness of breath', department: 'Cardiology', doctor: 'Dr. Robert Chen' }
          ],
          predictions: [
            { id: 1, date: '2025-07-21', riskScore: 0.87, modelVersion: 'v2.3.1', predictedBy: 'Dr. Jane Smith' },
            { id: 2, date: '2025-03-29', riskScore: 0.72, modelVersion: 'v2.2.0', predictedBy: 'Dr. Jane Smith' },
            { id: 3, date: '2024-11-16', riskScore: 0.65, modelVersion: 'v2.1.5', predictedBy: 'Dr. Robert Chen' }
          ],
          notes: [
            { id: 1, date: '2025-07-20', author: 'Dr. Jane Smith', content: 'Patient discharged with medication for hypertension. Follow-up appointment scheduled for 2 weeks.' },
            { id: 2, date: '2025-07-17', author: 'Dr. Mark Wilson', content: 'Cardiology consult performed. EKG shows normal sinus rhythm. Troponin levels normal.' },
            { id: 3, date: '2025-07-15', author: 'Dr. Jane Smith', content: 'Patient admitted with chest pain. History of hypertension. Starting diagnostics.' }
          ],
          staff: [
            { id: 1, name: 'Dr. Jane Smith', role: 'Cardiologist', assignedDate: '2024-06-15' },
            { id: 2, name: 'Nurse Mary Johnson', role: 'Primary Care Nurse', assignedDate: '2024-06-15' },
            { id: 3, name: 'Dr. Mark Wilson', role: 'Consulting Cardiologist', assignedDate: '2025-07-16' }
          ],
          shapValues: {
            'Age': 0.32,
            'Previous Admissions': 0.28,
            'Systolic BP': 0.21,
            'Cardiac Enzyme Levels': 0.15,
            'Diabetes': 0.12,
            'Hypertension': 0.08,
            'Smoking Status': 0.05,
            'Medication Adherence': -0.07,
            'Exercise Frequency': -0.12
          }
        };
        
        setPatient(mockPatient);
      } catch (err) {
        console.error('Error loading patient data:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score >= 0.7) return 'High';
    if (score >= 0.3) return 'Medium';
    return 'Low';
  };

  const getRiskLevelClass = (score) => {
    if (score >= 0.7) return 'bg-red-100 text-red-800';
    if (score >= 0.3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
            <div className="ml-4 h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg animate-pulse">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading patient data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/patients')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back to patients
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Patient not found</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>The patient you are looking for could not be found.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/patients')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Back to patients
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Patient header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/patients')}
              className="mr-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{patient.name}</h1>
              <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 space-x-4">
                <div>{patient.mrn}</div>
                <div>{calculateAge(patient.dob)} years</div>
                <div>{patient.gender}</div>
                <div>{patient.department}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(patient.riskScore)}`}>
                  {getRiskLevel(patient.riskScore)} Risk ({Math.round(patient.riskScore * 100)}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Export as PDF
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Patient
            </button>
          </div>
        </div>

        {/* Patient info card */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Information</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-gray-500">Primary Doctor</div>
                <div className="mt-1 text-sm text-gray-900">{patient.primaryDoctor}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Insurance</div>
                <div className="mt-1 text-sm text-gray-900">{patient.insurance}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Contact Phone</div>
                <div className="mt-1 text-sm text-gray-900">{patient.contactPhone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="mt-1 text-sm text-gray-900">{patient.contactEmail}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Address</div>
                <div className="mt-1 text-sm text-gray-900">{patient.address}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Last Admission</div>
                <div className="mt-1 text-sm text-gray-900">{formatDate(patient.lastAdmissionDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'admissions'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('admissions')}
              >
                Admissions History
              </button>
              <button
                className={`${
                  activeTab === 'predictions'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('predictions')}
              >
                Predictions
              </button>
              <button
                className={`${
                  activeTab === 'notes'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('notes')}
              >
                Clinical Notes
              </button>
              <button
                className={`${
                  activeTab === 'staff'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('staff')}
              >
                Assigned Staff
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {/* Admissions tab */}
            {activeTab === 'admissions' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {patient.admissions.map((admission) => (
                    <li key={admission.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="sm:flex sm:justify-between w-full">
                          <div>
                            <p className="text-sm font-medium text-teal-600 truncate">{admission.reason}</p>
                            <p className="mt-1 flex items-center text-sm text-gray-500">
                              <span className="truncate">{admission.department}</span>
                              <span className="mx-1">•</span>
                              <span>{admission.doctor}</span>
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500 sm:text-right">
                            <span>{formatDate(admission.admitDate)} - {formatDate(admission.dischargeDate)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Predictions tab */}
            {activeTab === 'predictions' && (
              <div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Latest Prediction</h3>
                    <div className="mt-5">
                      <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Date</div>
                          <div className="mt-1 text-sm text-gray-900">{formatDate(patient.predictions[0].date)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Predicted By</div>
                          <div className="mt-1 text-sm text-gray-900">{patient.predictions[0].predictedBy}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Model Version</div>
                          <div className="mt-1 text-sm text-gray-900">{patient.predictions[0].modelVersion}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Risk Score</div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(patient.predictions[0].riskScore)}`}>
                              {Math.round(patient.predictions[0].riskScore * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk gauge */}
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700">Risk Assessment</div>
                        <div className="mt-2 relative h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full ${patient.predictions[0].riskScore >= 0.7 ? 'bg-red-500' : patient.predictions[0].riskScore >= 0.3 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${patient.predictions[0].riskScore * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>Low Risk</span>
                          <span>Medium Risk</span>
                          <span>High Risk</span>
                        </div>
                      </div>
                      
                      {/* SHAP values */}
                      <div className="mt-6">
                        <div className="text-sm font-medium text-gray-700 mb-2">Key Factors Influencing Prediction</div>
                        <div className="space-y-2">
                          {Object.entries(patient.shapValues)
                            .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                            .map(([factor, value], index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-1/3 text-sm text-gray-600">{factor}</div>
                                <div className="w-2/3 relative">
                                  <div className="h-4 bg-gray-100 rounded relative">
                                    <div 
                                      className={`absolute top-0 h-full ${value > 0 ? 'bg-red-400 right-1/2' : 'bg-green-400 left-1/2'}`} 
                                      style={{ 
                                        width: `${Math.abs(value) * 100}%`,
                                        maxWidth: '50%'
                                      }}
                                    ></div>
                                  </div>
                                  <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300"></div>
                                  <div className={`absolute top-0 ${value > 0 ? 'right-0' : 'left-0'} text-xs ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {value > 0 ? '+' : ''}{value.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Prediction history */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Prediction History</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Version</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted By</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.predictions.map((prediction) => (
                          <tr key={prediction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(prediction.date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelClass(prediction.riskScore)}`}>
                                {Math.round(prediction.riskScore * 100)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prediction.modelVersion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prediction.predictedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Clinical notes tab */}
            {activeTab === 'notes' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Clinical Notes</h3>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-teal-700 bg-teal-100 hover:bg-teal-200">
                    <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Note
                  </button>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {patient.notes.map((note) => (
                        <li key={note.id} className="py-5">
                          <div className="flex items-start space-x-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {note.author}
                                <span className="ml-2 text-sm text-gray-500">{formatDate(note.date)}</span>
                              </p>
                              <p className="text-sm text-gray-500 mt-1">{note.content}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <button className="text-teal-600 hover:text-teal-900 text-sm">Edit</button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Assigned staff tab */}
            {activeTab === 'staff' && (
              <div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Assigned Staff</h3>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-teal-700 bg-teal-100 hover:bg-teal-200">
                      <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Assign Staff
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patient.staff.map((staffMember) => (
                          <tr key={staffMember.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{staffMember.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(staffMember.assignedDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-red-600 hover:text-red-900">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
