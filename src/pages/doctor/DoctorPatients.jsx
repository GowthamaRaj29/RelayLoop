import React, { useMemo, useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getPatientsByDepartment } from '../../utils/patientsStore';

export default function DoctorPatients() {
  const [currentDepartment] = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const list = getPatientsByDepartment(currentDepartment || '');
    setPatients(list);
    setLoading(false);
  }, [currentDepartment]);

  const filtered = useMemo(() => {
    if (!q) return patients;
    const s = q.toLowerCase();
    return patients.filter(p =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(s) ||
      (p.mrn || '').toLowerCase().includes(s)
    );
  }, [patients, q]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading patients...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <div className="relative w-full sm:w-[280px]">
            <input
              type="text"
              placeholder="Search name or MRN..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="block w-full pl-3 pr-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</div>
                      <div className="text-sm text-gray-500">{p.gender}, {p.dob}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.mrn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.room || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.attending_doctor || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link to={`/doctor/patients/${p.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No patients found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
