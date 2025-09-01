import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { getPatientById, updatePatient, addMedication } from '../../utils/patientsStore';

export default function DoctorPatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();
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
    setLoading(true);
    const p = getPatientById(patientId);
    if (!p) {
      setError('Patient not found');
      setLoading(false);
      return;
    }
    if (currentDepartment && p.department !== currentDepartment) {
      setError(`This patient belongs to ${p.department}.`);
      setLoading(false);
      return;
    }
    setPatient({
      ...p,
      vitals: Array.isArray(p.vitals) ? p.vitals : [],
      medications: Array.isArray(p.medications) ? p.medications : [],
      notes_history: Array.isArray(p.notes_history) ? p.notes_history : [],
      diagnosis: p.diagnosis || null,
    });
    setLoading(false);
  }, [patientId, currentDepartment]);

  const handleSaveRx = (e) => {
    e.preventDefault();
    const updated = addMedication(patient.id, rx);
    setPatient(updated || patient);
    setIsRxOpen(false);
  };

  const handleSaveDx = (e) => {
    e.preventDefault();
    const updated = updatePatient(patient.id, { diagnosis: { ...dx, updatedAt: new Date().toISOString(), addedBy: 'Doctor' } });
    setPatient(updated || patient);
    setIsDxOpen(false);
  };

  const handlePredict = async () => {
    setPredicting(true);
    // Simulate compute: use basic heuristic on vitals if present
    await new Promise(r => setTimeout(r, 800));
    const last = patient.vitals?.[0];
    let riskScore = 0.42;
    if (last) {
      const hr = parseFloat(last.heartRate || '0');
      const ox = parseFloat(last.oxygenSaturation || '100');
      if (hr > 100) riskScore += 0.2;
      if (ox < 94) riskScore += 0.25;
    }
    if (patient.medical_conditions?.length > 1) riskScore += 0.1;
    riskScore = Math.min(0.99, Math.max(0, riskScore));
  let outcome = 'low';
  if (riskScore >= 0.7) outcome = 'readmit';
  else if (riskScore >= 0.3) outcome = 'monitor';
  setPrediction({ riskScore, outcome });
    setPredicting(false);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatDateTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const doctorMeds = useMemo(() => (patient?.medications || []).filter(m => m.addedBy !== 'Nurse'), [patient?.medications]);

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
                <div className="mt-4">
                  <p className="text-sm text-gray-700">Risk Score: <span className="font-semibold">{Math.round(prediction.riskScore * 100)}%</span></p>
                  {(() => {
                    let outText = 'Low Risk';
                    if (prediction.outcome === 'readmit') outText = 'Readmission';
                    else if (prediction.outcome === 'monitor') outText = 'Monitor';
                    return (
                      <p className="text-sm text-gray-700">Outcome: <span className="font-semibold">{outText}</span></p>
                    );
                  })()}
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
                    <td className="px-6 py-3 text-sm text-gray-900">{v.heartRate}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{v.bloodPressure}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{v.oxygenSaturation}%</td>
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
                      <td className="px-6 py-3 text-sm text-gray-900">{formatDate(m.startDate)}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{m.addedBy || 'Doctor'}</td>
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
                    {(patient.medications || []).filter(m => m.addedBy === 'Nurse').map(m => (
                      <tr key={m.id}>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.dosage}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.frequency}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{formatDate(m.startDate)}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {((patient.medications || []).filter(m => m.addedBy === 'Nurse').length === 0) && (
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
            <input id="rx_name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" name="name" value={rx.name} onChange={(e)=>setRx(r=>({...r,name:e.target.value}))} required />
          </div>
          <div>
            <label htmlFor="rx_dosage" className="block text-sm text-gray-700">Dosage</label>
            <input id="rx_dosage" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" name="dosage" value={rx.dosage} onChange={(e)=>setRx(r=>({...r,dosage:e.target.value}))} required />
          </div>
          <div>
            <label htmlFor="rx_frequency" className="block text-sm text-gray-700">Frequency</label>
            <input id="rx_frequency" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" name="frequency" value={rx.frequency} onChange={(e)=>setRx(r=>({...r,frequency:e.target.value}))} required />
          </div>
          <div>
            <label htmlFor="rx_start" className="block text-sm text-gray-700">Start Date</label>
            <input id="rx_start" type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" name="startDate" value={rx.startDate} onChange={(e)=>setRx(r=>({...r,startDate:e.target.value}))} required />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rx_instructions" className="block text-sm text-gray-700">Instructions</label>
            <textarea id="rx_instructions" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" name="instructions" value={rx.instructions} onChange={(e)=>setRx(r=>({...r,instructions:e.target.value}))} />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={()=>setIsRxOpen(false)} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md">Save</button>
          </div>
        </form>
      </Modal>

      {/* Diagnosis Modal */}
      <Modal open={isDxOpen} onClose={() => setIsDxOpen(false)} title={`Add Diagnosis for ${patient.first_name} ${patient.last_name}`} size="lg">
        <form onSubmit={handleSaveDx} className="mt-2">
          <div>
            <label htmlFor="dx_assessment" className="block text-sm text-gray-700">Assessment</label>
            <textarea id="dx_assessment" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" value={dx.assessment} onChange={(e)=>setDx(d=>({...d, assessment: e.target.value}))} required />
          </div>
          <div className="mt-4">
            <label htmlFor="dx_plan" className="block text-sm text-gray-700">Plan</label>
            <textarea id="dx_plan" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" value={dx.plan} onChange={(e)=>setDx(d=>({...d, plan: e.target.value}))} required />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={()=>setIsDxOpen(false)} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
