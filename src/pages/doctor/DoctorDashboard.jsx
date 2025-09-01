import React from 'react';

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Today&apos;s Patients</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Pending Reviews</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Recent Predictions</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}
