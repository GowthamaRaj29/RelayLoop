import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { patientAPI } from '../../services/api';

const DoctorPredictions = () => {
  const [currentDepartment] = useOutletContext();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Default form data for each new patient
  const getDefaultFormData = () => ({
    // Chronic Conditions (0=No, 1=Yes)
    diabetes: 0,
    hypertension: 0,
    heart_disease: 0,
    kidney_disease: 0,
    respiratory_disease: 0,
    
    // Hospital Admission Type (exactly one should be 1, others 0)
    regular_ward_admission: 1,
    semi_intensive_unit_admission: 0,
    intensive_care_unit_admission: 0,
    
    // Lab Values - Default normal values
    hemoglobin: 13.5,           // g/dL - Normal: Male 13.8-17.2, Female 12.1-15.1
    hematocrit: 40.0,           // % - Normal: Male 40.7-50.3%, Female 36.1-44.3%
    platelets: 250,             // x10³/μL - Normal: 150-400
    red_blood_cells: 4.8,       // x10⁶/μL - Normal: Male 4.7-6.1, Female 4.2-5.4
    lymphocytes: 2.2,           // x10³/μL - Normal: 1.0-4.0
    urea: 5.2,                  // mmol/L - Normal: 2.5-7.5
    potassium: 4.1,             // mmol/L - Normal: 3.5-5.0
    sodium: 140,                // mmol/L - Normal: 136-145
    
    // Clinical Factors
    sars_cov2_exam_result: 0,   // 0=Negative, 1=Positive
    length_of_stay: 5,          // Days
    num_medications: 5,         // Count of medications
    previous_admissions: 0,     // Number of previous admissions in past year
  });

  // ML Prediction Form Data - Initialize with defaults
  const [formData, setFormData] = useState(getDefaultFormData());

  const [activeSection, setActiveSection] = useState('conditions');
  const [formErrors, setFormErrors] = useState({});

    // Fetch patients on component mount
  useEffect(() => {
  const fetchPatients = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching patients for department:', currentDepartment);
        
        const response = await patientAPI.getPatients(currentDepartment);
        console.log('API Response:', response);
    // Backend returns an object: { patients: [...], total: number }
    const patientsData = response?.patients || response?.data || [];
    console.log('Patients data:', patientsData);
        
        const patientsWithAge = patientsData.map(patient => ({
          ...patient,
          age: calculateAge(patient.dob),
          displayName: `${patient.first_name} ${patient.last_name}`
        }));

        console.log('Processed patients:', patientsWithAge);
        setPatients(patientsWithAge);
      } catch (error) {
        console.error('Error fetching patients:', error);
        console.error('Error details:', error.message);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [currentDepartment]);

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle patient selection and open prediction form
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    
    // Get default form data and populate with patient's medical conditions
    const defaultData = getDefaultFormData();
    const patientFormData = {
      ...defaultData,
      // Auto-populate patient's medical conditions for consistency
      diabetes: patient.medical_conditions?.includes('Diabetes') ? 1 : 0,
      hypertension: patient.medical_conditions?.includes('HyperTension') || 
                   patient.medical_conditions?.includes('Hypertension') ? 1 : 0,
      heart_disease: patient.medical_conditions?.includes('Heart Disease') ? 1 : 0,
      kidney_disease: patient.medical_conditions?.includes('Kidney Disease') ? 1 : 0,
      respiratory_disease: patient.medical_conditions?.includes('Respiratory Disease') ? 1 : 0,
    };
    
    setFormData(patientFormData);
    
    // Note: patient_age, patient_gender, and department are handled by the backend
    // They don't need to be included in the form data
    
    setShowPredictionForm(true);
    setFormErrors({});
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    // Handle admission type exclusivity
    if (field.includes('admission')) {
      setFormData(prev => ({
        ...prev,
        regular_ward_admission: 0,
        semi_intensive_unit_admission: 0,
        intensive_care_unit_admission: 0,
        [field]: value
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear field error
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    // Check admission type selection
    if (!formData.regular_ward_admission && !formData.semi_intensive_unit_admission && !formData.intensive_care_unit_admission) {
      errors.admission_type = 'Please select one admission type';
    }
    
    // No restrictions - allow flexible input for real-world patient data
    setFormErrors({});
    return Object.keys(errors).length === 0;
  };

  // Submit prediction form
  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsRunningPrediction(true);

      // Only include properties that are allowed by the CreatePredictionDto
      const allowedProperties = [
        'patient_id',
        'doctor_id',
        'diabetes',
        'hypertension',
        'heart_disease',
        'kidney_disease',
        'respiratory_disease',
        'regular_ward_admission',
        'semi_intensive_unit_admission',
        'intensive_care_unit_admission',
        'hemoglobin',
        'hematocrit',
        'platelets',
        'red_blood_cells',
        'lymphocytes',
        'urea',
        'potassium',
        'sodium',
        'sars_cov2_exam_result',
        'length_of_stay',
        'num_medications',
        'previous_admissions'
      ];

      // Filter formData to only include allowed properties
      const filteredData = {};
      allowedProperties.forEach(prop => {
        if (prop in formData) {
          filteredData[prop] = formData[prop];
        }
      });

      // Prepare data for ML prediction
      const predictionData = {
        ...filteredData,
        patient_id: selectedPatient.id, // Ensure patient_id is set correctly
        doctor_id: user?.id || user?.email || `Doctor-${currentDepartment}`,
      };

      console.log('=== GENERATE PREDICTION DEBUG ===');
      console.log('Submitting prediction data:', predictionData);
      console.log('Form conditions used:', {
        diabetes: formData.diabetes,
        hypertension: formData.hypertension,
        heart_disease: formData.heart_disease,
        kidney_disease: formData.kidney_disease,
        respiratory_disease: formData.respiratory_disease
      });
      console.log('Lab values used:', {
        hemoglobin: formData.hemoglobin,
        hematocrit: formData.hematocrit,
        platelets: formData.platelets,
        length_of_stay: formData.length_of_stay
      });

      // Call ML prediction API
      const response = await patientAPI.createPrediction(selectedPatient.id, predictionData);
      
      if (response.data) {
        setPredictionResult(response.data);
        setShowResult(true);
        setShowPredictionForm(false);
        
        // Note: Could refresh patient data here if needed for updates
        console.log('Prediction completed successfully');
      }

    } catch (error) {
      console.error('Error running prediction:', error);
      alert('Error running ML prediction: ' + error.message + 
            '\n\nNote: Make sure the backend server is running and the ML prediction service is configured.');
    } finally {
      setIsRunningPrediction(false);
    }
  };

  // Close forms
  const closePredictionForm = () => {
    setShowPredictionForm(false);
    setSelectedPatient(null);
    setFormErrors({});
    // Reset form data to defaults when closing
    setFormData(getDefaultFormData());
  };

  const closeResult = () => {
    setShowResult(false);
    setPredictionResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔬 ML Readmission Risk Prediction
          </h1>
          <p className="text-gray-600">
            Select a patient and input clinical data to predict readmission risk using machine learning
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                <div className="text-sm text-blue-800">Total Patients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{currentDepartment || 'All'}</div>
                <div className="text-sm text-purple-800">Department</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">Ready</div>
                <div className="text-sm text-green-800">ML System</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Selection Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Patient for ML Prediction
            </h2>
            <p className="text-sm text-gray-600">
              Click "Run Prediction" to input clinical data and generate readmission risk assessment
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age/Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          MRN: {patient.mrn}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.age} years / {patient.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {patient.department || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handlePatientSelect(patient)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <span>🔬</span>
                        <span>Run Prediction</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {patients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p>No patients available in this department</p>
            </div>
          )}
        </div>

        {/* ML Prediction Form Modal */}
        {showPredictionForm && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
              
              {/* Form Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      🔬 ML Prediction Input Form
                    </h2>
                    <p className="text-sm opacity-90">
                      Patient: {selectedPatient.displayName} | Age: {selectedPatient.age} | 
                      Gender: {selectedPatient.gender} | MRN: {selectedPatient.mrn}
                    </p>
                  </div>
                  <button
                    onClick={closePredictionForm}
                    className="text-white hover:text-gray-300 text-2xl"
                    disabled={isRunningPrediction}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Section Navigation */}
              <div className="border-b bg-gray-50 flex-shrink-0">
                <div className="flex space-x-0 px-6">
                  {[
                    { id: 'conditions', label: '🏥 Medical Conditions' },
                    { id: 'admission', label: '🏨 Admission Type' },
                    { id: 'labs', label: '🔬 Lab Values' },
                    { id: 'clinical', label: '📋 Clinical Data' }
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeSection === section.id
                          ? 'text-blue-600 border-blue-600 bg-white'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handlePredictionSubmit} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6">

                  {/* Medical Conditions Section */}
                  {activeSection === 'conditions' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">
                          Chronic Medical Conditions
                        </h3>
                        <p className="text-sm text-blue-700 mb-4">
                          Select which chronic conditions the patient currently has:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'diabetes', label: 'Diabetes Mellitus' },
                            { key: 'hypertension', label: 'Hypertension' },
                            { key: 'heart_disease', label: 'Heart Disease' },
                            { key: 'kidney_disease', label: 'Kidney Disease' },
                            { key: 'respiratory_disease', label: 'Respiratory Disease' }
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                              <label className="text-sm font-medium text-gray-700">{label}</label>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(key, 0)}
                                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                    formData[key] === 0
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  No
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(key, 1)}
                                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                    formData[key] === 1
                                      ? 'bg-red-600 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 bg-blue-100 rounded">
                          <p className="text-sm text-blue-800">
                            💡 <strong>Note:</strong> Multiple chronic conditions significantly increase readmission risk
                          </p>
                        </div>
                      </div>

                      {/* Generate Prediction Button for Conditions Section */}
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={isRunningPrediction}
                          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                        >
                          {isRunningPrediction ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Running ML Prediction...</span>
                            </>
                          ) : (
                            <>
                              <span>🔬</span>
                              <span>Generate Prediction</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admission Type Section */}
                  {activeSection === 'admission' && (
                    <div className="space-y-6">
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4">
                          Hospital Admission Type
                        </h3>
                        <p className="text-sm text-purple-700 mb-4">
                          Select the type of hospital unit where the patient was admitted:
                        </p>

                        {formErrors.admission_type && (
                          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                            {formErrors.admission_type}
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          {[
                            { 
                              key: 'regular_ward_admission', 
                              label: 'Regular Ward', 
                              desc: 'Standard hospital ward with general medical care' 
                            },
                            { 
                              key: 'semi_intensive_unit_admission', 
                              label: 'Semi-Intensive Unit', 
                              desc: 'Step-down or intermediate care unit' 
                            },
                            { 
                              key: 'intensive_care_unit_admission', 
                              label: 'Intensive Care Unit (ICU)', 
                              desc: 'Critical care unit with advanced monitoring' 
                            }
                          ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center p-3 bg-white border rounded-lg">
                              <input
                                type="radio"
                                name="admission_type"
                                checked={formData[key] === 1}
                                onChange={() => handleInputChange(key, 1)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 mr-3"
                              />
                              <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">{label}</label>
                                <p className="text-xs text-gray-500">{desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 bg-purple-100 rounded">
                          <p className="text-sm text-purple-800">
                            💡 <strong>Risk Level:</strong> ICU &gt; Semi-ICU &gt; Regular Ward
                          </p>
                        </div>
                      </div>

                      {/* Generate Prediction Button for Admission Section */}
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={isRunningPrediction}
                          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                        >
                          {isRunningPrediction ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Running ML Prediction...</span>
                            </>
                          ) : (
                            <>
                              <span>🔬</span>
                              <span>Generate Prediction</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lab Values Section */}
                  {activeSection === 'labs' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        
                        {/* Hematology Panel */}
                        <div className="bg-green-50 p-4 md:p-6 rounded-lg border border-green-200">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <h3 className="text-lg font-semibold text-green-900">
                              Hematology Panel
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { key: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL', step: 0.1, normal: '12-16' },
                              { key: 'hematocrit', label: 'Hematocrit', unit: '%', step: 0.1, normal: '36-48' },
                              { key: 'platelets', label: 'Platelets', unit: '×10³/μL', step: 1, normal: '150-450' },
                              { key: 'red_blood_cells', label: 'RBC', unit: '×10⁶/μL', step: 0.1, normal: '4.0-5.5' },
                              { key: 'lymphocytes', label: 'Lymphocytes', unit: '×10³/μL', step: 0.1, normal: '1.5-3.5' }
                            ].map(({ key, label, unit, step, normal }) => (
                              <div key={key} className="bg-white p-3 rounded-md border border-green-100">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  {label}
                                  <span className="text-xs text-gray-500 block">{unit}</span>
                                </label>
                                <input
                                  type="number"
                                  value={formData[key]}
                                  onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                    handleInputChange(key, value);
                                  }}
                                  step={step}
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black text-sm ${
                                    formErrors[key] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder={`Enter ${label.toLowerCase()}`}
                                />
                                {formErrors[key] && (
                                  <p className="text-red-500 text-xs mt-1">{formErrors[key]}</p>
                                )}
                                <p className="text-xs text-green-600 mt-1">Reference: {normal} {unit}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Chemistry Panel */}
                        <div className="bg-yellow-50 p-4 md:p-6 rounded-lg border border-yellow-200">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                            <h3 className="text-lg font-semibold text-yellow-900">
                              Chemistry Panel
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { key: 'urea', label: 'Urea', unit: 'mmol/L', step: 0.1, normal: '2.5-7.8' },
                              { key: 'potassium', label: 'Potassium', unit: 'mmol/L', step: 0.1, normal: '3.5-5.0' },
                              { key: 'sodium', label: 'Sodium', unit: 'mmol/L', step: 1, normal: '136-146' }
                            ].map(({ key, label, unit, step, normal }) => (
                              <div key={key} className="bg-white p-3 rounded-md border border-yellow-100">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  {label}
                                  <span className="text-xs text-gray-500 block">{unit}</span>
                                </label>
                                <input
                                  type="number"
                                  value={formData[key]}
                                  onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                    handleInputChange(key, value);
                                  }}
                                  step={step}
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black text-sm ${
                                    formErrors[key] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder={`Enter ${label.toLowerCase()}`}
                                />
                                {formErrors[key] && (
                                  <p className="text-red-500 text-xs mt-1">{formErrors[key]}</p>
                                )}
                                <p className="text-xs text-yellow-600 mt-1">Reference: {normal} {unit}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-2">
                          <span className="text-blue-600 mr-2">💡</span>
                          <h4 className="text-sm font-semibold text-blue-900">Lab Guidelines</h4>
                        </div>
                        <p className="text-sm text-blue-800">
                          Enter actual patient values - ranges accommodate diverse patient conditions from critically low 
                          to extremely elevated levels. The ML model analyzes abnormalities to assess readmission risk accurately.
                        </p>
                      </div>

                      {/* Generate Prediction Button for Labs Section */}
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={isRunningPrediction}
                          className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                        >
                          {isRunningPrediction ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Running ML Prediction...</span>
                            </>
                          ) : (
                            <>
                              <span>🔬</span>
                              <span>Generate Prediction</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clinical Data Section */}
                  {activeSection === 'clinical' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Clinical Factors */}
                        <div className="bg-red-50 p-4 md:p-6 rounded-lg border border-red-200">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                            <h3 className="text-lg font-semibold text-red-900">
                              Clinical Factors
                            </h3>
                          </div>
                          
                          <div className="space-y-4">
                            {/* COVID-19 Status */}
                            <div className="bg-white p-4 rounded-lg border border-red-100">
                              <div className="flex items-center mb-3">
                                <span className="text-red-600 mr-2">🦠</span>
                                <label className="text-sm font-medium text-gray-800">COVID-19 Test Result</label>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleInputChange('sars_cov2_exam_result', 0)}
                                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                    formData.sars_cov2_exam_result === 0
                                      ? 'bg-green-600 text-white shadow-sm'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  ✅ Negative
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInputChange('sars_cov2_exam_result', 1)}
                                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                    formData.sars_cov2_exam_result === 1
                                      ? 'bg-red-600 text-white shadow-sm'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  ⚠️ Positive
                                </button>
                              </div>
                            </div>

                            {/* Numeric Clinical Values */}
                            {[
                              { key: 'length_of_stay', label: 'Length of Stay', unit: 'days', icon: '📅', hint: 'Extended stays (>10 days) increase risk' },
                              { key: 'num_medications', label: 'Number of Medications', unit: 'count', icon: '💊', hint: 'Polypharmacy (>10 meds) increases risk' },
                              { key: 'previous_admissions', label: 'Previous Admissions (past year)', unit: 'count', icon: '🏥', hint: 'Frequent readmissions (>2) significantly increase risk' }
                            ].map(({ key, label, unit, icon, hint }) => (
                              <div key={key} className="bg-white p-4 rounded-lg border border-red-100">
                                <div className="flex items-center mb-3">
                                  <span className="text-red-600 mr-2">{icon}</span>
                                  <label className="text-sm font-medium text-gray-800">
                                    {label}
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  value={formData[key]}
                                  onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    handleInputChange(key, value);
                                  }}
                                  step={1}
                                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black text-sm ${
                                    formErrors[key] ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder={`Enter ${unit}`}
                                />
                                {formErrors[key] && (
                                  <p className="text-red-500 text-xs mt-1">{formErrors[key]}</p>
                                )}
                                <p className="text-xs text-red-600 mt-2">⚠️ {hint}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Risk Summary */}
                        <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Current Risk Factors
                            </h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Active Conditions:</span>
                                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                                    (formData.diabetes + formData.hypertension + formData.heart_disease + 
                                     formData.kidney_disease + formData.respiratory_disease) >= 3 
                                      ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {formData.diabetes + formData.hypertension + formData.heart_disease + 
                                     formData.kidney_disease + formData.respiratory_disease}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Care Level:</span>
                                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                                    formData.intensive_care_unit_admission ? 'bg-red-100 text-red-700' : 
                                    formData.semi_intensive_unit_admission ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {formData.intensive_care_unit_admission ? 'ICU' : 
                                     formData.semi_intensive_unit_admission ? 'Semi-ICU' : 'Regular Ward'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">COVID-19:</span>
                                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${formData.sars_cov2_exam_result ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {formData.sars_cov2_exam_result ? 'Positive' : 'Negative'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Length of Stay:</span>
                                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${formData.length_of_stay > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {formData.length_of_stay} days
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Medications:</span>
                                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${formData.num_medications > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {formData.num_medications}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Previous Admissions:</span>
                                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${formData.previous_admissions > 2 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {formData.previous_admissions}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-red-100 rounded">
                        <p className="text-sm text-red-800">
                          💡 <strong>High-Risk Indicators:</strong> Multiple conditions (≥3), ICU admission, 
                          COVID-19 positive, prolonged stay (&gt;10 days), polypharmacy (&gt;10 medications), 
                          frequent readmissions significantly increase risk.
                        </p>
                      </div>

                      {/* Generate Prediction Button for Clinical Section */}
                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={isRunningPrediction}
                          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                        >
                          {isRunningPrediction ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Running ML Prediction...</span>
                            </>
                          ) : (
                            <>
                              <span>🔬</span>
                              <span>Generate Prediction</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Form Actions */}
                <div className="border-t bg-gray-50 px-6 py-4 flex-shrink-0">
                  <div className="flex justify-end items-center">
                    <button
                      type="button"
                      onClick={closePredictionForm}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isRunningPrediction}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Results Modal */}
        {showResult && predictionResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Results Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">🔬 ML Prediction Results</h2>
                    <p className="text-sm opacity-90">
                      Patient: {selectedPatient?.displayName} | MRN: {selectedPatient?.mrn}
                    </p>
                  </div>
                  <button
                    onClick={closeResult}
                    className="text-white hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Results Content */}
              <div className="p-6 space-y-6">
                
                {/* Main Risk Assessment */}
                <div className={`p-8 rounded-xl border-2 ${
                  predictionResult.risk_level === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                  predictionResult.risk_level === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                  'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="text-5xl">
                        {predictionResult.risk_level === 'high' ? '🚨' :
                         predictionResult.risk_level === 'medium' ? '⚠️' : '✅'}
                      </span>
                      <div>
                        <h3 className="text-4xl font-bold uppercase tracking-wide">
                          {predictionResult.risk_level} RISK
                        </h3>
                        <p className="text-xl font-semibold mt-1">
                          {(predictionResult.risk_percentage || 0).toFixed(1)}% Readmission Probability
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                    <p className="text-sm font-medium flex items-center">
                      <span className="text-lg mr-2">📋</span>
                      <span className="uppercase text-xs font-bold tracking-wider opacity-75">RECOMMENDATION:</span>
                    </p>
                    <p className="mt-2 font-medium">
                      {predictionResult.recommendation || 'Standard clinical monitoring and care protocols recommended'}
                    </p>
                  </div>
                </div>

                {/* Enhanced Detailed Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-blue-900 flex items-center text-lg">
                        <span className="text-2xl mr-3">📊</span>
                        ML Model Score
                      </h4>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-700 mb-2">
                        {(predictionResult.ml_probability || predictionResult.risk_percentage || 0).toFixed(1)}%
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(predictionResult.ml_probability || predictionResult.risk_percentage || 0)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-blue-700 font-medium">Machine Learning Assessment</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-purple-900 flex items-center text-lg">
                        <span className="text-2xl mr-3">🏥</span>
                        Clinical Score
                      </h4>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-700 mb-2">
                        {(predictionResult.clinical_score || predictionResult.risk_percentage || 0).toFixed(1)}%
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(predictionResult.clinical_score || predictionResult.risk_percentage || 0)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-purple-700 font-medium">Clinical Risk Assessment</p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {predictionResult.risk_factors && predictionResult.risk_factors.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-3">⚠️ Identified Risk Factors</h4>
                    <div className="space-y-2">
                      {predictionResult.risk_factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <span className="text-sm text-yellow-800">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Confidence Level */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg flex items-center">
                        <span className="text-xl mr-2">🎯</span>
                        Model Confidence Assessment
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Reliability score for this prediction</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-700">
                        {(predictionResult.confidence || 70).toFixed(0)}%
                      </div>
                      <div className={`text-sm font-medium ${
                        (predictionResult.confidence || 0) >= 80 ? 'text-green-600' : 
                        (predictionResult.confidence || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(predictionResult.confidence || 0) >= 80 ? 'High Confidence' : 
                         (predictionResult.confidence || 0) >= 60 ? 'Moderate Confidence' : 'Low Confidence'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Prediction Reliability</span>
                      <span className="font-medium">{(predictionResult.confidence || 70).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          (predictionResult.confidence || 0) >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                          (predictionResult.confidence || 0) >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${((predictionResult.confidence || 70))}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-center text-sm text-gray-500">
                  Prediction generated on {new Date(predictionResult.predicted_at || new Date()).toLocaleString()}
                </div>
              </div>

              {/* Results Actions */}
              <div className="border-t bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={closeResult}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Close Results
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorPredictions;
