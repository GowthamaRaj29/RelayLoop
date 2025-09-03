import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { patientAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function DoctorPatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDepartment] = useOutletContext();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRxOpen, setIsRxOpen] = useState(false);
  const [isDxOpen, setIsDxOpen] = useState(false);
  const [rx, setRx] = useState({ name: '', dosage: '', frequency: '', startDate: '', instructions: '', addedBy: 'Doctor' });
  const [dx, setDx] = useState({ assessment: '', plan: '' });
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch patient from API
        const response = await patientAPI.getPatient(patientId);
        const patientData = response.data || response;
        
        // Check department access
        if (currentDepartment && patientData.department !== currentDepartment) {
          setError(`This patient belongs to ${patientData.department}.`);
          return;
        }
        
        // Set patient with proper array initialization
        setPatient({
          ...patientData,
          vitals: Array.isArray(patientData.vitals) ? patientData.vitals : [],
          medications: Array.isArray(patientData.medications) ? patientData.medications : [],
          notes_history: Array.isArray(patientData.notes_history) ? patientData.notes_history : [],
          diagnosis: patientData.diagnosis || null,
        });
      } catch (error) {
        console.error('Error fetching patient:', error);
        setError(`Failed to load patient data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, currentDepartment]);

  const handleSaveRx = async (e) => {
    e.preventDefault();
    try {
      // Prepare medication data for API
      const medicationData = {
        patient_id: patient.id,
        name: rx.name,
        dosage: rx.dosage,
        frequency: rx.frequency,
        start_date: rx.startDate,
        instructions: rx.instructions,
        added_by: 'Doctor'
      };
      
      // Save to backend via API
      const response = await patientAPI.addMedication(patient.id, medicationData);
      console.log('Medication saved:', response);
      
      // Refresh patient data
      const updatedPatient = await patientAPI.getPatient(patient.id);
      setPatient({
        ...updatedPatient.data,
        vitals: Array.isArray(updatedPatient.data.vitals) ? updatedPatient.data.vitals : [],
        medications: Array.isArray(updatedPatient.data.medications) ? updatedPatient.data.medications : [],
        notes_history: Array.isArray(updatedPatient.data.notes_history) ? updatedPatient.data.notes_history : [],
        diagnosis: updatedPatient.data.diagnosis || null,
      });
      
      setIsRxOpen(false);
    } catch (error) {
      console.error('Error saving medication:', error);
      alert(`Failed to save medication: ${error.message}`);
    }
  };

  const handleSaveDx = async (e) => {
    e.preventDefault();
    try {
      // Prepare diagnosis note data for API
      const noteData = {
        patient_id: patient.id,
        content: `Assessment: ${dx.assessment}\nPlan: ${dx.plan}`,
        type: 'Assessment',
        author: user?.email || `Doctor (${currentDepartment || 'Unknown Dept'})`,
        date: new Date().toISOString().split('T')[0] // Add current date
      };
      
      // Save diagnosis as a patient note via API
      const response = await patientAPI.addNote(patient.id, noteData);
      console.log('Diagnosis saved:', response);
      
      // Refresh patient data
      const updatedPatient = await patientAPI.getPatient(patient.id);
      setPatient({
        ...updatedPatient.data,
        vitals: Array.isArray(updatedPatient.data.vitals) ? updatedPatient.data.vitals : [],
        medications: Array.isArray(updatedPatient.data.medications) ? updatedPatient.data.medications : [],
        notes_history: Array.isArray(updatedPatient.data.notes_history) ? updatedPatient.data.notes_history : [],
        diagnosis: updatedPatient.data.diagnosis || null,
      });
      
      setIsDxOpen(false);
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      alert(`Failed to save diagnosis: ${error.message}`);
    }
  };

  const handlePredict = async () => {
    setPredicting(true);
    
    try {
      // Use the same default values as the Generate Prediction form for consistency
      const defaultFormData = {
        // Chronic Conditions (0=No, 1=Yes) - Use patient's medical conditions
        diabetes: patient.medical_conditions?.includes('Diabetes') ? 1 : 0,
        hypertension: patient.medical_conditions?.includes('HyperTension') || 
                     patient.medical_conditions?.includes('Hypertension') ? 1 : 0,
        heart_disease: patient.medical_conditions?.includes('Heart Disease') ? 1 : 0,
        kidney_disease: patient.medical_conditions?.includes('Kidney Disease') ? 1 : 0,
        respiratory_disease: patient.medical_conditions?.includes('Respiratory Disease') ? 1 : 0,
        
        // Hospital Admission Type (exactly one should be 1, others 0)
        regular_ward_admission: 1,  // Default to regular ward (same as Generate Prediction)
        semi_intensive_unit_admission: 0,
        intensive_care_unit_admission: 0,
        
        // Lab Values - Use exact same defaults as Generate Prediction form
        hemoglobin: 13.5,           // g/dL - Normal: Male 13.8-17.2, Female 12.1-15.1
        hematocrit: 40.0,           // % - Normal: Male 40.7-50.3%, Female 36.1-44.3%
        platelets: 250,             // x10³/μL - Normal: 150-400
        red_blood_cells: 4.8,       // x10⁶/μL - Normal: Male 4.7-6.1, Female 4.2-5.4
        lymphocytes: 2.2,           // x10³/μL - Normal: 1.0-4.0
        urea: 5.2,                  // mmol/L - Normal: 2.5-7.5
        potassium: 4.1,             // mmol/L - Normal: 3.5-5.0
        sodium: 140,                // mmol/L - Normal: 136-145
        
        // Clinical Factors - Use exact same defaults as Generate Prediction form
        sars_cov2_exam_result: 0,   // 0=Negative, 1=Positive
        length_of_stay: 5,          // Days
        num_medications: 5,         // Count of medications (same default as form)
        previous_admissions: 0,     // Number of previous admissions in past year
      };

      // Remove the redundant admission type override logic
      // Both should use regular_ward_admission: 1 by default (same as Generate Prediction)

      // Prepare data for ML prediction
      const predictionData = {
        ...defaultFormData,
        patient_id: patient.id,
        doctor_id: user?.id || user?.email || `Doctor-${currentDepartment}`,
      };

      console.log('=== GET PREDICTION DEBUG ===');
      console.log('Getting ML prediction for patient:', patient.id, 'with data:', predictionData);
      console.log('Patient medical conditions:', patient.medical_conditions);
      console.log('Mapped conditions:', {
        diabetes: defaultFormData.diabetes,
        hypertension: defaultFormData.hypertension,
        heart_disease: defaultFormData.heart_disease,
        kidney_disease: defaultFormData.kidney_disease,
        respiratory_disease: defaultFormData.respiratory_disease
      });
      console.log('Lab values being used:', {
        hemoglobin: defaultFormData.hemoglobin,
        hematocrit: defaultFormData.hematocrit,
        platelets: defaultFormData.platelets,
        length_of_stay: defaultFormData.length_of_stay
      });

      // Call the real ML prediction API
      const response = await patientAPI.createPrediction(patient.id, predictionData);
      
      if (response.data) {
        // Convert the ML prediction result to the format expected by this component
        const mlResult = response.data;
        console.log('Raw ML prediction result:', mlResult);
        
        // Extract probability/risk score - handle different formats
        let probability = mlResult.risk_percentage || mlResult.probability || mlResult.risk_score || 0;
        
        // The backend returns risk_percentage as 0-100, convert to decimal (0-1)
        if (probability > 1) {
          probability = probability / 100;
        }
        
        setPrediction({
          riskScore: probability,
          outcome: mlResult.risk_level === 'high' ? 'readmit' : 
                   mlResult.risk_level === 'medium' ? 'monitor' : 'low'
        });
        console.log('Processed prediction:', { 
          riskScore: probability, 
          outcome: mlResult.risk_level,
          rawRiskPercentage: mlResult.risk_percentage,
          rawProbability: mlResult.probability,
          rawRiskScore: mlResult.risk_score,
          confidence: mlResult.confidence,
          riskFactors: mlResult.risk_factors
        });
      }

    } catch (error) {
      console.error('Error getting ML prediction:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show more specific error information
      let errorMessage = 'Error getting ML prediction: ';
      if (error.response?.status === 404) {
        errorMessage += 'ML prediction service not found. ';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error in ML prediction service. ';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage += 'Cannot connect to backend server. ';
      } else {
        errorMessage += error.message + ' ';
      }
      
      alert(errorMessage + '\n\nNote: Make sure the backend server is running and the ML prediction service is configured.');
    } finally {
      setPredicting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const doctorMeds = useMemo(() => (patient?.medications || []).filter(m => m.prescribed_by !== 'Nurse'), [patient?.medications]);

  if (loading) return (<div className="min-h-screen bg-gray-50/50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>);
  if (error) return (<div className="p-4 bg-red-50 text-red-700">{error}</div>);
  if (!patient) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate('/doctor/patients')} className="text-gray-600 hover:text-gray-800 mr-3">← Back</button>
            <h1 className="text-2xl font-semibold text-gray-900">{patient.first_name} {patient.last_name}</h1>
            <p className="text-sm text-gray-500">MRN: {patient.mrn} • {patient.gender}, {patient.dob} • Room {patient.room || '-'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsRxOpen(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Add Prescription</button>
            <button onClick={() => setIsDxOpen(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">Add Diagnosis</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview','vitals','medications','notes'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`${activeTab===t?'border-indigo-500 text-indigo-600':'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}>{t}</button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Summary</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Department</dt>
                  <dd className="text-sm text-gray-900">{patient.department}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Attending Doctor</dt>
                  <dd className="text-sm text-gray-900">{patient.attending_doctor || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Allergies</dt>
                  <dd className="text-sm text-gray-900">{patient.allergies?.join(', ') || 'None'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Conditions</dt>
                  <dd className="text-sm text-gray-900">{patient.medical_conditions?.join(', ') || 'None'}</dd>
                </div>
              </dl>
              {patient.diagnosis && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900">Latest Diagnosis</h4>
                  <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Assessment:</span> {patient.diagnosis.assessment}</p>
                  <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Plan:</span> {patient.diagnosis.plan}</p>
                  <p className="text-xs text-gray-500 mt-1">Updated: {formatDateTime(patient.diagnosis.updatedAt)}</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Risk & Readmission</h3>
              <button onClick={handlePredict} disabled={predicting} className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">{predicting ? 'Predicting...' : 'Get Prediction'}</button>
              {prediction && (
                <div className="mt-4 space-y-3">
                  {/* Risk Level Badge */}
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    prediction.outcome === 'readmit' ? 'bg-red-50 border border-red-200 text-red-700' :
                    prediction.outcome === 'monitor' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
                    'bg-green-50 border border-green-200 text-green-700'
                  }`}>
                    {prediction.outcome === 'readmit' ? '🚨' : prediction.outcome === 'monitor' ? '⚠️' : '✅'}
                    <span className="ml-2">
                      {prediction.outcome === 'readmit' ? 'High Risk' : 
                       prediction.outcome === 'monitor' ? 'Medium Risk' : 'Low Risk'}
                    </span>
                  </div>
                  
                  {/* Risk Percentage */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Readmission Probability</span>
                      <span className="text-lg font-bold text-gray-900">{Math.round(prediction.riskScore * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          prediction.riskScore >= 0.7 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          prediction.riskScore >= 0.3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-green-400 to-green-600'
                        }`}
                        style={{ width: `${Math.round(prediction.riskScore * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Insights */}
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                    💡 <strong>ML Analysis:</strong> Based on patient medical history, lab values, and clinical factors.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO₂</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(patient.vitals || []).map(v => (
                  <tr key={v.id}>
                    <td className="px-6 py-3 text-sm text-gray-900">{formatDateTime(v.date)}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{v.temperature}°F</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{v.heart_rate}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {v.blood_pressure_systolic && v.blood_pressure_diastolic 
                        ? `${v.blood_pressure_systolic}/${v.blood_pressure_diastolic}` 
                        : '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{v.oxygen_saturation}%</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{v.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!patient.vitals || patient.vitals.length === 0) && (
              <div className="text-center py-8 text-gray-500">No vitals recorded.</div>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
                <button onClick={() => setIsRxOpen(true)} className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Add Prescription</button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctorMeds.map(m => (
                    <tr key={m.id}>
                      <td className="px-6 py-3 text-sm text-gray-900">{m.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{m.dosage}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{m.frequency}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{formatDate(m.start_date)}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{m.prescribed_by || 'Doctor'}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{m.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doctorMeds.length === 0 && (
                <div className="text-center py-8 text-gray-500">No prescriptions yet.</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-md font-medium text-gray-900">Past Medications (added by Nurse)</h4>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(patient.medications || []).filter(m => m.prescribed_by === 'Nurse').map(m => (
                      <tr key={m.id}>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.dosage}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.frequency}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{formatDate(m.start_date)}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {((patient.medications || []).filter(m => m.prescribed_by === 'Nurse').length === 0) && (
                  <div className="text-center py-4 text-gray-500">No past meds added by nurse.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {(patient.notes_history || []).map(n => (
                <li key={n.id} className="px-4 py-5 sm:px-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.author || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(n.date)}</p>
                    </div>
                    {(() => {
                      let cls = 'bg-purple-100 text-purple-800';
                      if (n.type === 'Observation') cls = 'bg-blue-100 text-blue-800';
                      else if (n.type === 'Assessment') cls = 'bg-green-100 text-green-800';
                      return <span className={`px-2 py-1 text-xs rounded-full ${cls}`}>{n.type}</span>;
                    })()}
                  </div>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{n.content}</div>
                </li>
              ))}
            </ul>
            {(!patient.notes_history || patient.notes_history.length === 0) && (
              <div className="text-center py-8 text-gray-500">No notes recorded.</div>
            )}
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      <Modal open={isRxOpen} onClose={() => setIsRxOpen(false)} title={`Add Prescription for ${patient.first_name} ${patient.last_name}`} size="lg">
        <form onSubmit={handleSaveRx} className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 mt-2">
          <div>
            <label htmlFor="rx_name" className="block text-sm text-gray-700">Medication</label>
            <input id="rx_name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" name="name" value={rx.name} onChange={(e)=>setRx(r=>({...r,name:e.target.value}))} required />
          </div>
          <div>
            <label htmlFor="rx_dosage" className="block text-sm text-gray-700">Dosage</label>
            <input id="rx_dosage" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" name="dosage" value={rx.dosage} onChange={(e)=>setRx(r=>({...r,dosage:e.target.value}))} required />
          </div>
          <div>
            <label htmlFor="rx_frequency" className="block text-sm text-gray-700">Frequency</label>
            <input id="rx_frequency" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" name="frequency" value={rx.frequency} onChange={(e)=>setRx(r=>({...r,frequency:e.target.value}))} required />
          </div>
          <div>
            <label htmlFor="rx_start" className="block text-sm text-gray-700">Start Date</label>
            <input id="rx_start" type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" name="startDate" value={rx.startDate} onChange={(e)=>setRx(r=>({...r,startDate:e.target.value}))} required />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rx_instructions" className="block text-sm text-gray-700">Instructions</label>
            <textarea id="rx_instructions" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" name="instructions" value={rx.instructions} onChange={(e)=>setRx(r=>({...r,instructions:e.target.value}))} />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={()=>setIsRxOpen(false)} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-black">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md">Save</button>
          </div>
        </form>
      </Modal>

      {/* Diagnosis Modal */}
      <Modal open={isDxOpen} onClose={() => setIsDxOpen(false)} title={`Add Diagnosis for ${patient.first_name} ${patient.last_name}`} size="lg">
        <form onSubmit={handleSaveDx} className="mt-2">
          <div>
            <label htmlFor="dx_assessment" className="block text-sm text-gray-700">Assessment</label>
            <textarea id="dx_assessment" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" value={dx.assessment} onChange={(e)=>setDx(d=>({...d, assessment: e.target.value}))} required />
          </div>
          <div className="mt-4">
            <label htmlFor="dx_plan" className="block text-sm text-gray-700">Plan</label>
            <textarea id="dx_plan" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black" value={dx.plan} onChange={(e)=>setDx(d=>({...d, plan: e.target.value}))} required />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={()=>setIsDxOpen(false)} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-black">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
