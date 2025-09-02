import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { patientAPI } from '../../services/api';

const MLPredictionForm = ({ patient, onSubmit, isLoading, onCancel }) => {
  const { user, currentDepartment } = useAuth();
  const [formData, setFormData] = useState({
    // Chronic conditions
    diabetes: 0,
    hypertension: 0,
    heart_disease: 0,
    kidney_disease: 0,
    respiratory_disease: 0,

    // Hospital admission types
    regular_ward_admission: 1,
    semi_intensive_unit_admission: 0,
    intensive_care_unit_admission: 0,

    // Lab values (normal defaults)
    hemoglobin: 13.5,
    hematocrit: 40.0,
    platelets: 250,
    red_blood_cells: 4.8,
    lymphocytes: 2.2,
    urea: 5.2,
    potassium: 4.1,
    sodium: 140,

    // Other clinical factors
    sars_cov2_exam_result: 0,
    length_of_stay: 5,
    num_medications: 5,
    previous_admissions: 0,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const predictionData = {
      ...formData,
      patient_id: patient.id,
      doctor_id: user?.email || `Doctor (${currentDepartment || 'Unknown Dept'})`
    };
    onSubmit(predictionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">ML Readmission Risk Prediction</h2>
              <p className="text-sm text-gray-600">
                Patient: {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Chronic Conditions Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Chronic Conditions</h3>
              <div className="space-y-3">
                {[
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'hypertension', label: 'Hypertension' },
                  { key: 'heart_disease', label: 'Heart Disease' },
                  { key: 'kidney_disease', label: 'Kidney Disease' },
                  { key: 'respiratory_disease', label: 'Respiratory Disease' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleChange(key, 0)}
                        className={`px-3 py-1 text-xs rounded ${
                          formData[key] === 0
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange(key, 1)}
                        className={`px-3 py-1 text-xs rounded ${
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
            </div>

            {/* Hospital Admission Section */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 mb-4">Hospital Admission Type</h3>
              <div className="space-y-3">
                {[
                  { key: 'regular_ward_admission', label: 'Regular Ward' },
                  { key: 'semi_intensive_unit_admission', label: 'Semi-Intensive Unit' },
                  { key: 'intensive_care_unit_admission', label: 'Intensive Care Unit' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleChange(key, 0)}
                        className={`px-3 py-1 text-xs rounded ${
                          formData[key] === 0
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange(key, 1)}
                        className={`px-3 py-1 text-xs rounded ${
                          formData[key] === 1
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Values Section */}
            <div className="bg-green-50 p-4 rounded-lg xl:col-span-1">
              <h3 className="text-lg font-medium text-green-900 mb-4">Laboratory Values</h3>
              <div className="space-y-3">
                {[
                  { key: 'hemoglobin', label: 'Hemoglobin (g/dL)', min: 6, max: 18, step: 0.1 },
                  { key: 'hematocrit', label: 'Hematocrit (%)', min: 25, max: 55, step: 0.1 },
                  { key: 'platelets', label: 'Platelets (x10³/μL)', min: 50, max: 600, step: 1 },
                  { key: 'red_blood_cells', label: 'RBC (x10⁶/μL)', min: 2.5, max: 7.0, step: 0.1 },
                  { key: 'lymphocytes', label: 'Lymphocytes (x10³/μL)', min: 0.5, max: 6.0, step: 0.1 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={formData[key]}
                      onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
                      min={min}
                      max={max}
                      step={step}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Lab Values */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-900 mb-4">Additional Lab Values</h3>
              <div className="space-y-3">
                {[
                  { key: 'urea', label: 'Urea (mmol/L)', min: 1.0, max: 20.0, step: 0.1 },
                  { key: 'potassium', label: 'Potassium (mmol/L)', min: 2.5, max: 6.0, step: 0.1 },
                  { key: 'sodium', label: 'Sodium (mmol/L)', min: 125, max: 155, step: 1 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={formData[key]}
                      onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
                      min={min}
                      max={max}
                      step={step}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Factors Section */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-900 mb-4">Clinical Factors</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">COVID-19 Positive</label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleChange('sars_cov2_exam_result', 0)}
                      className={`px-3 py-1 text-xs rounded ${
                        formData.sars_cov2_exam_result === 0
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('sars_cov2_exam_result', 1)}
                      className={`px-3 py-1 text-xs rounded ${
                        formData.sars_cov2_exam_result === 1
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {[
                  { key: 'length_of_stay', label: 'Length of Stay (days)', min: 1, max: 30, step: 1 },
                  { key: 'num_medications', label: 'Number of Medications', min: 0, max: 20, step: 1 },
                  { key: 'previous_admissions', label: 'Previous Admissions (past year)', min: 0, max: 10, step: 1 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={formData[key]}
                      onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                      min={min}
                      max={max}
                      step={step}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running Prediction...' : '🔬 Run ML Prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PredictionResult = ({ result, onClose }) => {
  const getRiskBadge = (riskLevel, riskPercentage) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors[riskLevel] || colors.low}`}>
        {riskLevel.toUpperCase()} ({riskPercentage.toFixed(1)}%)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🎯 ML Prediction Results</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border">
              <div className="text-sm font-medium text-blue-600 mb-1">Risk Level</div>
              <div className="text-2xl font-bold text-blue-900">
                {getRiskBadge(result.risk_level, result.risk_percentage)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border">
              <div className="text-sm font-medium text-purple-600 mb-1">ML Probability</div>
              <div className="text-2xl font-bold text-purple-900">
                {result.ml_probability.toFixed(1)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border">
              <div className="text-sm font-medium text-green-600 mb-1">Clinical Score</div>
              <div className="text-2xl font-bold text-green-900">
                {result.clinical_score.toFixed(1)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border">
              <div className="text-sm font-medium text-orange-600 mb-1">Confidence</div>
              <div className="text-2xl font-bold text-orange-900">
                {result.confidence.toFixed(1)}%
              </div>
            </div>
          </div>

          {result.risk_factors && result.risk_factors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Risk Factors Identified</h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <ul className="space-y-2">
                  {result.risk_factors.map((factor, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Clinical Recommendation</h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-blue-800">{result.recommendation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">🤖 Model Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Age Group:</strong> {result.age_group}</p>
                <p><strong>Age Multiplier:</strong> {result.age_multiplier}x</p>
                <p><strong>Prediction Time:</strong> {new Date(result.predicted_at).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2">🎯 Model Breakdown</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>ML Component:</strong> 60% weight</p>
                <p><strong>Clinical Component:</strong> 40% weight</p>
                <p><strong>Final Score:</strong> Combined with age adjustment</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DoctorPredictions() {
  const [currentDepartment] = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch patients
      const patientsResponse = await patientAPI.getPatients({ department: currentDepartment });
      const patientsData = patientsResponse.data?.patients || [];
      
      // Calculate age for each patient
      const patientsWithAge = patientsData.map(patient => ({
        ...patient,
        age: calculateAge(patient.dob),
        displayName: `${patient.first_name} ${patient.last_name}`
      }));

      setPatients(patientsWithAge);

      // Fetch predictions for the department
      try {
        const predictionsResponse = await fetch(`/api/v1/patients/predictions/department?department=${currentDepartment}`);
        if (predictionsResponse.ok) {
          const predictionsData = await predictionsResponse.json();
          setPredictions(predictionsData.data || []);
        }
      } catch (error) {
        console.log('Error fetching predictions:', error);
        setPredictions([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDepartment, fetchData]);

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRunPrediction = async (predictionData) => {
    try {
      setIsRunningPrediction(true);

      const response = await fetch(`/api/v1/patients/${selectedPatient.id}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      if (!response.ok) {
        throw new Error('Failed to run prediction');
      }

      const result = await response.json();
      setPredictionResult(result.data);
      setSelectedPatient(null);
      
      // Refresh predictions list
      await fetchData();

    } catch (error) {
      console.error('Error running prediction:', error);
      alert('Error running prediction: ' + error.message);
    } finally {
      setIsRunningPrediction(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLatestPrediction = (patientId) => {
    return predictions.find(p => p.patient_id === patientId);
  };

  const getRiskBadge = (riskLevel, riskPercentage) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800', 
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[riskLevel] || colors.low}`}>
        {riskLevel?.toUpperCase()} {riskPercentage ? `(${riskPercentage.toFixed(1)}%)` : ''}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ML Prediction System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔬 ML Readmission Prediction</h1>
          <p className="text-gray-600 mt-2">
            Advanced machine learning system for predicting patient readmission risk
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Department:</strong> {currentDepartment || 'All'} | 
              <strong> Total Patients:</strong> {patients.length} |
              <strong> Predictions Made:</strong> {predictions.length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients by name or MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Patients List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Patient List - ML Prediction</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age/Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Prediction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => {
                  const latestPrediction = getLatestPrediction(patient.id);
                  
                  return (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.displayName}
                          </div>
                          <div className="text-sm text-gray-500">MRN: {patient.mrn}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.age} / {patient.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {latestPrediction ? (
                          getRiskBadge(latestPrediction.risk_level, latestPrediction.risk_percentage)
                        ) : (
                          <span className="text-gray-400 text-xs">No prediction</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {latestPrediction ? (
                          new Date(latestPrediction.predicted_at).toLocaleDateString()
                        ) : (
                          'Never'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          🔬 Run Prediction
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No patients found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedPatient && (
          <MLPredictionForm
            patient={selectedPatient}
            onSubmit={handleRunPrediction}
            isLoading={isRunningPrediction}
            onCancel={() => setSelectedPatient(null)}
          />
        )}

        {predictionResult && (
          <PredictionResult
            result={predictionResult}
            onClose={() => setPredictionResult(null)}
          />
        )}

      </div>
    </div>
  );
}
