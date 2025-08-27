import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PredictionDetails() {
  const { predictionId } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch prediction data
  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock prediction data
        const mockPrediction = {
          id: parseInt(predictionId),
          patientId: 1,
          patientName: 'Alice Johnson',
          patientMrn: 'MRN48291',
          patientAge: 47,
          patientDepartment: 'Cardiology',
          riskScore: 0.87,
          predictedOutcome: 'readmit',
          modelVersion: 'v2.3.1',
          requestedBy: 'Dr. Jane Smith',
          date: '2025-08-10',
          previousPredictions: [
            { date: '2025-07-15', score: 0.82, version: 'v2.3.1' },
            { date: '2025-06-20', score: 0.75, version: 'v2.2.0' },
            { date: '2025-05-10', score: 0.68, version: 'v2.1.5' }
          ],
          shapValues: {
            'Age': 0.32,
            'Previous Admissions': 0.28,
            'Systolic BP': 0.21,
            'Cardiac Enzyme Levels': 0.15,
            'Diabetes': 0.12,
            'Hypertension': 0.08,
            'Smoking Status': 0.05,
            'Medication Adherence': -0.07,
            'Exercise Frequency': -0.12
          },
          patientData: {
            'Age': '47 years',
            'Gender': 'Female',
            'Previous Admissions': '3',
            'Last Admission': '2025-07-15',
            'Systolic BP': '142 mmHg',
            'Diastolic BP': '88 mmHg',
            'Heart Rate': '82 bpm',
            'BMI': '28.4',
            'Diabetes': 'Yes',
            'Hypertension': 'Yes',
            'Smoking Status': 'Former Smoker',
            'Alcohol Use': 'Occasional',
            'Exercise Frequency': '1-2 times/week'
          },
          availableModels: [
            { version: 'v2.3.1', status: 'Current' },
            { version: 'v2.2.0', status: 'Available' },
            { version: 'v2.1.5', status: 'Available' }
          ]
        };
        
        setPrediction(mockPrediction);
      } catch (err) {
        console.error('Error loading prediction data:', err);
        setError('Failed to load prediction data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictionData();
  }, [predictionId]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get risk level class based on score
  const getRiskLevelClass = (score) => {
    if (score >= 0.7) return 'bg-red-100 text-red-800';
    if (score >= 0.3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Get risk level label
  const getRiskLevel = (score) => {
    if (score >= 0.7) return 'High';
    if (score >= 0.3) return 'Medium';
    return 'Low';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-40"></div>
            <div className="ml-4 h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg animate-pulse">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading prediction data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/predictions')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back to predictions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Prediction not found</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>The prediction you are looking for could not be found.</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/predictions')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Back to predictions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Prediction header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/predictions')}
              className="mr-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Prediction Details</h1>
              <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 space-x-4">
                <div>{prediction.patientName}</div>
                <div>{prediction.patientMrn}</div>
                <div>{prediction.patientDepartment}</div>
                <div>Requested by: {prediction.requestedBy}</div>
                <div>Date: {formatDate(prediction.date)}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Export as PDF
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Re-run Prediction
            </button>
          </div>
        </div>

        {/* Risk score gauge card */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Risk Assessment</h3>
              
              <div className="mt-6 flex flex-col items-center">
                {/* Circular risk gauge */}
                <div className="relative h-48 w-48">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#E5E7EB" 
                      strokeWidth="10" 
                    />
                    
                    {/* Colored arc based on risk score */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={prediction.riskScore >= 0.7 ? "#EF4444" : prediction.riskScore >= 0.3 ? "#F59E0B" : "#10B981"} 
                      strokeWidth="10" 
                      strokeDasharray={`${prediction.riskScore * 283} 283`} 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)" 
                    />
                    
                    {/* Risk percentage text */}
                    <text 
                      x="50" 
                      y="45" 
                      textAnchor="middle" 
                      fontSize="20" 
                      fontWeight="bold" 
                      fill="#111827"
                    >
                      {Math.round(prediction.riskScore * 100)}%
                    </text>
                    
                    <text 
                      x="50" 
                      y="65" 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill="#6B7280"
                    >
                      {getRiskLevel(prediction.riskScore)} Risk
                    </text>
                  </svg>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-lg font-medium text-gray-900">
                    {prediction.predictedOutcome === 'readmit' 
                      ? 'Predicted Readmission' 
                      : 'No Readmission Predicted'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Model Version: {prediction.modelVersion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SHAP values */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Key Factors Influencing Prediction</h3>
              <div className="mt-6 space-y-4">
                {Object.entries(prediction.shapValues)
                  .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                  .slice(0, 7)
                  .map(([factor, value], index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-1/3 text-sm text-gray-600">{factor}</div>
                      <div className="w-2/3 relative">
                        <div className="h-6 bg-gray-100 rounded relative">
                          <div 
                            className={`absolute top-0 h-full ${value > 0 ? 'bg-red-400 right-1/2' : 'bg-green-400 left-1/2'}`} 
                            style={{ 
                              width: `${Math.abs(value) * 100}%`,
                              maxWidth: '50%'
                            }}
                          ></div>
                        </div>
                        <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-gray-300"></div>
                        <div className={`absolute top-1.5 ${value > 0 ? 'right-0' : 'left-0'} text-xs ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {value > 0 ? '+' : ''}{value.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                <div className="text-xs text-gray-500 mt-4">
                  Positive values (red) increase readmission risk. Negative values (green) decrease risk.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient data card */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Data Used For Prediction</h3>
            <Link
              to={`/admin/patients/${prediction.patientId}`}
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              View Patient Profile →
            </Link>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {Object.entries(prediction.patientData).map(([key, value], index) => (
                <div key={index} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-3">
                  <dt className="text-sm font-medium text-gray-500">{key}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Previous predictions */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Prediction History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Previous predictions for this patient</p>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Version</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prediction.previousPredictions.map((prev, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(prev.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelClass(prev.score)}`}>
                        {Math.round(prev.score * 100)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prev.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
