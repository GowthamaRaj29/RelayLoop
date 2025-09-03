import React, { useState, useEffect, memo, useCallback } from 'react';
import { 
  ReadmissionRateChart, 
  PatientRiskDistribution,
  DepartmentPerformanceChart,
  PredictionAccuracyChart
} from '../../components/charts/DashboardCharts';
import { patientAPI } from '../../services/api';

// Main dashboard component - Using React.memo to prevent unnecessary rerenders
const AdminDashboard = memo(function AdminDashboard() {
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
      
      // Fetch data from APIs
      const [patientStatsRes, predictionsRes] = await Promise.all([
        patientAPI.getPatientStats().catch(() => ({ data: { totalPatients: 0, activePatients: 0, highRiskPatients: 0, recentAdmissions: 0 }})),
        patientAPI.getAllPredictions().catch(() => ({ data: [] }))
      ]);

      const patientStats = patientStatsRes.data || {};
      const predictions = predictionsRes.data || [];
      
      // Calculate high risk patients from predictions
      const highRiskCount = predictions.filter(p => p.risk_level === 'high').length;
      const recentReadmissions = predictions.filter(p => {
        const predictionDate = new Date(p.predicted_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return predictionDate >= thirtyDaysAgo && p.risk_level === 'high';
      }).length;
      
      setStats({
        totalPatients: patientStats.totalPatients || 0,
        highRiskPatients: highRiskCount,
        recentReadmissions: recentReadmissions,
        pendingAssessments: patientStats.totalPatients - predictions.length || 0
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
        <h1 className="text-2xl font-semibold text-gray-900">Hospital Readmission Dashboard</h1>
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
          
          {/* Prediction Accuracy */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Prediction Model Accuracy</h2>
            <PredictionAccuracyChart />
          </div>
        </div>
        
       
      </div>
    </div>
  );
});

export default AdminDashboard;
