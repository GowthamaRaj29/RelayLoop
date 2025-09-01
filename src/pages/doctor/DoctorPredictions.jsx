import React, { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getPatientsByDepartment } from '../../utils/patientsStore';

// Simple heuristic to score risk based on latest vitals and conditions
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

function classify(risk, threshold) {
  // threshold in 0..1
  if (risk >= Math.max(0.7, threshold)) return 'readmit';
  if (risk >= Math.max(0.3, threshold * 0.75)) return 'monitor';
  return 'low';
}

export default function DoctorPredictions() {
  const [currentDepartment] = useOutletContext();
  const [threshold, setThreshold] = useState(0.6); // 0..1
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const list = currentDepartment ? getPatientsByDepartment(currentDepartment) : [];
    setPatients(list.map(p => ({
      ...p,
      vitals: Array.isArray(p.vitals) ? p.vitals : [],
      riskScore: scoreRisk(p),
    })));
  }, [currentDepartment]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients
      .filter(p =>
        !q || `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) || (p.mrn || '').toLowerCase().includes(q)
      )
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [patients, query]);

  const stats = useMemo(() => {
    const counts = { low: 0, monitor: 0, readmit: 0 };
    filtered.forEach(p => counts[classify(p.riskScore, threshold)]++);
    const total = filtered.length || 1;
    const avg = filtered.reduce((s, p) => s + p.riskScore, 0) / total;
    return {
      counts,
      total: filtered.length,
      avg,
      pct: {
        low: Math.round((counts.low / total) * 100),
        monitor: Math.round((counts.monitor / total) * 100),
        readmit: Math.round((counts.readmit / total) * 100),
      },
    };
  }, [filtered, threshold]);

  const topAtRisk = filtered.filter(p => classify(p.riskScore, threshold) === 'readmit').slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
            <p className="text-sm text-gray-500 mt-1">Department: <span className="font-medium text-green-700">{currentDepartment || 'N/A'}</span></p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name or MRN"
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="sm:w-64">
              <label className="block text-xs text-gray-500 mb-1">Readmission Threshold: <span className="font-semibold">{Math.round(threshold * 100)}%</span></label>
              <input
                type="range"
                min="0.3"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={e => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
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
            <p className="mt-1 text-2xl font-semibold text-amber-600">{stats.counts.monitor}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">High Risk</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.counts.readmit}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distribution Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-900">Risk Distribution</h3>
            <div className="mt-4 space-y-3">
              {[{k:'low',label:'Low Risk',color:'bg-emerald-500'}, {k:'monitor',label:'Monitor',color:'bg-amber-500'}, {k:'readmit',label:'Readmission',color:'bg-rose-500'}].map(row => (
                <div key={row.k}>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{row.label}</span>
                    <span>{stats.pct[row.k]}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className={`${row.color} h-3`} style={{ width: `${stats.pct[row.k]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top at-risk list */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900">Top At-Risk Patients</h3>
            <ul className="mt-3 divide-y divide-gray-100">
              {topAtRisk.length === 0 && (
                <li className="py-6 text-center text-gray-500 text-sm">No patients above threshold.</li>
              )}
              {topAtRisk.map(p => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-gray-500">MRN: {p.mrn} • Risk {Math.round(p.riskScore * 100)}%</p>
                  </div>
                  <Link to={`/doctor/patients/${p.id}`} className="text-xs px-2 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">View</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full table */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Patients (sorted by risk)</h3>
            <span className="text-xs text-gray-500">{filtered.length} results</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(p => {
                  const c = classify(p.riskScore, threshold);
                  const badge = c === 'readmit' ? 'bg-rose-100 text-rose-800' : c === 'monitor' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
                  return (
                    <tr key={p.id}>
                      <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">{p.first_name} {p.last_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">{p.mrn}</td>
                      <td className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">{Math.round(p.riskScore * 100)}%</td>
                      <td className="px-6 py-3 text-sm whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs ${badge}`}>{c}</span></td>
                      <td className="px-6 py-3 text-right whitespace-nowrap"><Link to={`/doctor/patients/${p.id}`} className="text-sm text-emerald-700 hover:text-emerald-900">Open</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
