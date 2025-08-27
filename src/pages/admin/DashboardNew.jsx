import React, { useState, useEffect } from 'react';

// Main dashboard component
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRiskPatients: 0,
    recentReadmissions: 0,
    pendingAssessments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        setStats({
          totalPatients: 248,
          highRiskPatients: 42,
          recentReadmissions: 15,
          pendingAssessments: 23
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        
        {/* Stats cards */}
        {isLoading ? (
          <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white shadow rounded-lg animate-pulse p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Patients */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 text-blue-500 bg-blue-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">Total Patients</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</dd>
                </div>
              </div>
            </div>
            
            {/* High Risk */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 text-red-500 bg-red-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">High Risk Patients</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.highRiskPatients}</dd>
                </div>
              </div>
            </div>
            
            {/* Readmissions */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 text-amber-500 bg-amber-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">Recent Readmissions</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.recentReadmissions}</dd>
                </div>
              </div>
            </div>
            
            {/* Assessments */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 text-green-500 bg-green-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">Pending Assessments</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.pendingAssessments}</dd>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Recent Activity Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-5">
                <ul className="divide-y divide-gray-200">
                  {[
                    { id: 1, type: 'assessment', patient: 'John Doe', time: '3 hours ago' },
                    { id: 2, type: 'admission', patient: 'Jane Smith', time: '5 hours ago' },
                    { id: 3, type: 'prediction', patient: 'Robert Johnson', time: 'Yesterday' },
                    { id: 4, type: 'assessment', patient: 'Mary Williams', time: 'Yesterday' },
                  ].map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 text-gray-400">
                          {activity.type === 'assessment' && (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          )}
                          {activity.type === 'admission' && (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          )}
                          {activity.type === 'prediction' && (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                          <p className="text-sm text-gray-500">
                            {activity.type === 'assessment' && 'New assessment completed'}
                            {activity.type === 'admission' && 'Patient admitted'}
                            {activity.type === 'prediction' && 'Risk prediction updated'}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <button
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => console.log('View all activity')}
                >
                  View all activity
                </button>
              </div>
            </div>
          </div>
          
          {/* Prediction Accuracy Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Prediction Accuracy</h3>
              <div className="mt-2 flex justify-between items-baseline">
                <div className="text-5xl font-semibold text-gray-900">87%</div>
                <div className="text-sm flex items-center text-green-600">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  +2.5%
                </div>
              </div>
              <div className="mt-4">
                <div className="relative h-3 bg-gray-200 rounded-full">
                  <div className="absolute h-3 rounded-full bg-blue-500" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => console.log('View analytics')}
                >
                  View detailed analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
