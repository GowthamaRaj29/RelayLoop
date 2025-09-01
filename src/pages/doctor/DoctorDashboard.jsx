import React, { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getPatientsByDepartment } from '../../utils/patientsStore';

function scoreRisk(patient) {
  const last = Array.isArray(patient.vitals) && patient.vitals.length > 0 ? patient.vitals[0] : null;
  let risk = 0.35;
  if (last) {
    const hr = parseFloat(last.heartRate || '0');
    const ox = parseFloat(last.oxygenSaturation || '100');
    if (!Number.isNaN(hr) && hr > 100) risk += 0.22;
    if (!Number.isNaN(ox) && ox < 94) risk += 0.25;
  }
  const conds = Array.isArray(patient.medical_conditions) ? patient.medical_conditions.length : 0;
  if (conds >= 2) risk += 0.08;
  if (conds >= 4) risk += 0.05;
  return Math.min(0.99, Math.max(0, risk));
}

export default function DoctorDashboard() {
  const [currentDepartment] = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [threshold, setThreshold] = useState(0.6);

  useEffect(() => {
    const list = currentDepartment ? getPatientsByDepartment(currentDepartment) : [];
    setPatients(list.map(p => ({
      ...p,
      vitals: Array.isArray(p.vitals) ? p.vitals : [],
      notes_history: Array.isArray(p.notes_history) ? p.notes_history : [],
      medications: Array.isArray(p.medications) ? p.medications : [],
      riskScore: scoreRisk(p),
    })));
  }, [currentDepartment]);

  const stats = useMemo(() => {
    const total = patients.length;
    const high = patients.filter(p => p.riskScore >= Math.max(0.7, threshold)).length;
    const monitor = patients.filter(p => p.riskScore >= 0.3 && p.riskScore < Math.max(0.7, threshold)).length;
    const avg = total ? patients.reduce((s, p) => s + p.riskScore, 0) / total : 0;
    const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentVitals = patients.reduce((acc, p) => acc + (p.vitals || []).filter(v => new Date(v.date).getTime() >= lastWeek).length, 0);
    const recentRx = patients.reduce((acc, p) => acc + (p.medications || []).filter(m => m.addedBy !== 'Nurse' && new Date(m.startDate).getTime() >= lastWeek).length, 0);
    return { total, high, monitor, avg, recentVitals, recentRx };
  }, [patients, threshold]);

  const topAtRisk = useMemo(
    () => [...patients].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
    [patients]
  );

  const recentNotes = useMemo(() => {
    const all = patients.flatMap(p => (p.notes_history || []).map(n => ({...n, pid: p.id, name: `${p.first_name} ${p.last_name}`})));
    const sorted = [...all].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.slice(0, 6);
  }, [patients]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Department: <span className="font-medium text-green-700">{currentDepartment || 'N/A'}</span></p>
          </div>
          <div className="flex gap-2">
            <Link to="/doctor/patients" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">View Patients</Link>
            <Link to="/doctor/predictions" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">Open Predictions</Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">Total Patients</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">Avg Risk</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{Math.round(stats.avg * 100)}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">Monitor</p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">{stats.monitor}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">High Risk</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.high}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk overview + threshold */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="text-sm font-medium text-gray-900">Risk Overview</h3>
              <div className="md:w-80">
                <label className="block text-xs text-gray-500 mb-1">Readmission Threshold: <span className="font-semibold">{Math.round(threshold * 100)}%</span></label>
                <input type="range" min="0.3" max="0.9" step="0.05" value={threshold} onChange={e=>setThreshold(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{label:'Low',color:'bg-emerald-500',calc: p=>p.riskScore < 0.3}, {label:'Monitor',color:'bg-amber-500',calc:p=>p.riskScore >=0.3 && p.riskScore < Math.max(0.7, threshold)}, {label:'High',color:'bg-rose-500',calc:p=>p.riskScore >= Math.max(0.7, threshold)}].map((row)=>{
                const count = patients.filter(row.calc).length;
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{row.label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className={`${row.color} h-3`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900">This Week</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-gray-200 p-3">
                <dt className="text-xs text-gray-500">Vitals Recorded</dt>
                <dd className="text-xl font-semibold text-gray-900">{stats.recentVitals}</dd>
              </div>
              <div className="rounded-md border border-gray-200 p-3">
                <dt className="text-xs text-gray-500">Prescriptions</dt>
                <dd className="text-xl font-semibold text-gray-900">{stats.recentRx}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">Top At-Risk</h4>
              <ul className="mt-2 divide-y divide-gray-100">
                {topAtRisk.length === 0 && (
                  <li className="py-4 text-gray-500 text-sm">No patients.</li>
                )}
                {topAtRisk.map(p => (
                  <li key={p.id} className="py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-900">{p.first_name} {p.last_name}</span>
                    <span className="text-xs font-medium text-rose-700">{Math.round(p.riskScore * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent notes */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Recent Notes</h3>
            <Link to="/doctor/patients" className="text-xs text-emerald-700 hover:text-emerald-900">View all</Link>
          </div>
          <ul className="mt-3 divide-y divide-gray-100">
            {recentNotes.length === 0 && (
              <li className="py-6 text-center text-gray-500 text-sm">No recent notes.</li>
            )}
                {recentNotes.map(n => {
                  let cls = 'bg-purple-100 text-purple-800';
                  if (n.type === 'Observation') cls = 'bg-blue-100 text-blue-800';
                  else if (n.type === 'Assessment') cls = 'bg-green-100 text-green-800';
                  return (
                    <li key={n.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{n.name}</p>
                        <p className="text-xs text-gray-500">{new Date(n.date).toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${cls}`}>{n.type}</span>
                    </li>
                  );
                })}
          </ul>
        </div>
      </div>
    </div>
  );
}
