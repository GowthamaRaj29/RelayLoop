import React, { useState, useEffect, memo, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  ReadmissionRateChart, 
  PatientRiskDistribution,
  DepartmentPerformanceChart,
  PredictionAccuracyChart
} from '../../components/charts/DashboardCharts';

// Main dashboard component - Using React.memo to prevent unnecessary rerenders
const NurseDashboard = memo(function NurseDashboard() {
  const [currentDepartment] = useOutletContext();
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRiskPatients: 0,
    recentReadmissions: 0,
    pendingAssessments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized fetch function to prevent recreating on each render
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with reduced timeout for faster loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
  }, []);

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
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
        <h1 className="text-2xl font-semibold text-gray-900">Nurse Dashboard: {currentDepartment || 'All Departments'}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor patient readmissions, risk levels, and prediction statistics
        </p>

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

        {/* Main dashboard content */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Readmission Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Readmission Rate Trends</h2>
            <ReadmissionRateChart />
          </div>
          
          {/* Patient Risk Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Risk Distribution</h2>
            <PatientRiskDistribution />
          </div>
          
          {/* Department Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Department Performance</h2>
            <DepartmentPerformanceChart />
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <li key={index} className="mb-4">
                      <div className="relative pb-8">
                        <div className="relative flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="w-3/4">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  [
                    { id: 1, type: 'assessment', patient: 'Maria Garcia', time: '30 minutes ago' },
                    { id: 2, type: 'admission', patient: 'Robert Johnson', time: '2 hours ago' },
                    { id: 3, type: 'discharge', patient: 'Sarah Wilson', time: '3 hours ago' },
                    { id: 4, type: 'alert', patient: 'David Chen', time: '5 hours ago' }
                  ].map((activity) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <div className={`relative px-1.5 py-1.5 rounded-full ${
                              activity.type === 'assessment' ? 'bg-blue-100 text-blue-500' :
                              activity.type === 'admission' ? 'bg-green-100 text-green-500' :
                              activity.type === 'discharge' ? 'bg-purple-100 text-purple-500' : 'bg-red-100 text-red-500'
                            }`}>
                              {activity.type === 'assessment' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              ) : activity.type === 'admission' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                                </svg>
                              ) : activity.type === 'discharge' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {activity.patient}
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                {activity.type === 'assessment' && 'Assessment completed'}
                                {activity.type === 'admission' && 'Admitted to hospital'}
                                {activity.type === 'discharge' && 'Discharged from hospital'}
                                {activity.type === 'alert' && 'High risk alert triggered'}
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              <p>{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NurseDashboard;
