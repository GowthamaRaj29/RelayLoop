import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [dateRange, setDateRange] = useState('all');
  const [modelVersion, setModelVersion] = useState('all');
  const [outcome, setOutcome] = useState('all');
  const [riskThreshold, setRiskThreshold] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter options
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' }
  ];
  
  const modelVersions = [
    { value: 'all', label: 'All Versions' },
    { value: 'v2.3.1', label: 'v2.3.1 (Current)' },
    { value: 'v2.2.0', label: 'v2.2.0' },
    { value: 'v2.1.5', label: 'v2.1.5' },
    { value: 'v2.0.0', label: 'v2.0.0' }
  ];
  
  const outcomeOptions = [
    { value: 'all', label: 'All Outcomes' },
    { value: 'readmit', label: 'Readmission' },
    { value: 'no-readmit', label: 'No Readmission' }
  ];
  
  const riskThresholds = [
    { value: 0, label: 'All Risk Levels' },
    { value: 0.9, label: 'High Risk (>90%)' },
    { value: 0.7, label: 'Medium Risk (>70%)' },
    { value: 0.5, label: 'Low Risk (>50%)' }
  ];

  // Fetch predictions data
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockPredictions = [
          {
            id: 1,
            patientId: 1,
            patientName: 'Alice Johnson',
            patientMrn: 'MRN48291',
            riskScore: 0.87,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Jane Smith',
            date: '2025-08-10',
            department: 'Cardiology'
          },
          {
            id: 2,
            patientId: 2,
            patientName: 'Bob Smith',
            patientMrn: 'MRN38172',
            riskScore: 0.79,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Robert Johnson',
            date: '2025-08-09',
            department: 'Oncology'
          },
          {
            id: 3,
            patientId: 3,
            patientName: 'Carol Davis',
            patientMrn: 'MRN59281',
            riskScore: 0.76,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Emily Chen',
            date: '2025-08-08',
            department: 'Neurology'
          },
          {
            id: 4,
            patientId: 4,
            patientName: 'David Miller',
            patientMrn: 'MRN91827',
            riskScore: 0.42,
            predictedOutcome: 'no-readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Jane Smith',
            date: '2025-08-07',
            department: 'Surgery'
          },
          {
            id: 5,
            patientId: 5,
            patientName: 'Emma Wilson',
            patientMrn: 'MRN28371',
            riskScore: 0.67,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.2.0',
            requestedBy: 'Dr. Michael Brown',
            date: '2025-08-05',
            department: 'Cardiology'
          },
          {
            id: 6,
            patientId: 6,
            patientName: 'Frank Thomas',
            patientMrn: 'MRN47193',
            riskScore: 0.22,
            predictedOutcome: 'no-readmit',
            modelVersion: 'v2.2.0',
            requestedBy: 'Dr. Sarah Wilson',
            date: '2025-08-02',
            department: 'Pediatrics'
          },
          {
            id: 7,
            patientId: 7,
            patientName: 'Grace Lee',
            patientMrn: 'MRN38291',
            riskScore: 0.88,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.1.5',
            requestedBy: 'Dr. Robert Johnson',
            date: '2025-07-30',
            department: 'Oncology'
          },
          {
            id: 8,
            patientId: 8,
            patientName: 'Henry Garcia',
            patientMrn: 'MRN58271',
            riskScore: 0.35,
            predictedOutcome: 'no-readmit',
            modelVersion: 'v2.1.5',
            requestedBy: 'Dr. Emily Chen',
            date: '2025-07-25',
            department: 'Neurology'
          },
          {
            id: 9,
            patientId: 9,
            patientName: 'Isabel Martinez',
            patientMrn: 'MRN72819',
            riskScore: 0.51,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.0.0',
            requestedBy: 'Dr. Michael Brown',
            date: '2025-07-18',
            department: 'Surgery'
          },
          {
            id: 10,
            patientId: 10,
            patientName: 'James Wilson',
            patientMrn: 'MRN19283',
            riskScore: 0.73,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.0.0',
            requestedBy: 'Dr. Sarah Wilson',
            date: '2025-07-15',
            department: 'Cardiology'
          }
        ];
        
        setPredictions(mockPredictions);
      } catch (err) {
        console.error('Error loading predictions:', err);
        setError('Failed to load predictions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter predictions
  const filteredPredictions = predictions.filter(prediction => {
    // Search filter
    const searchMatch = 
      prediction.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prediction.patientMrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prediction.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filter
    let dateMatch = true;
    const predictionDate = new Date(prediction.date);
    const today = new Date();
    
    if (dateRange === '7days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      dateMatch = predictionDate >= sevenDaysAgo;
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      dateMatch = predictionDate >= thirtyDaysAgo;
    } else if (dateRange === '90days') {
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(today.getDate() - 90);
      dateMatch = predictionDate >= ninetyDaysAgo;
    }
    
    // Model version filter
    const versionMatch = modelVersion === 'all' || prediction.modelVersion === modelVersion;
    
    // Outcome filter
    const outcomeMatch = outcome === 'all' || prediction.predictedOutcome === outcome;
    
    // Risk threshold filter
    const riskMatch = prediction.riskScore >= riskThreshold;
    
    return searchMatch && dateMatch && versionMatch && outcomeMatch && riskMatch;
  });

  // Get risk level class based on score
  const getRiskLevelClass = (score) => {
    if (score >= 0.7) return 'bg-red-100 text-red-800';
    if (score >= 0.3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
          <div className="mt-6 animate-pulse">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="h-10 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="relative px-6 py-3"><span className="sr-only">View</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-5 bg-gray-200 rounded w-16 ml-auto"></div>
                      </td>
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

  // Error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
          <div className="mt-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading predictions</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Retry
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h3a1 1 0 110 2h-3v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h3V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Prediction
          </button>
        </div>
        
        {/* Filters and search */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
            <div className="relative rounded-md shadow-sm max-w-xs w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search predictions"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                {dateRanges.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={modelVersion}
                onChange={(e) => setModelVersion(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                {modelVersions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                {outcomeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                {riskThresholds.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-gray-500 mb-4">
            Showing {filteredPredictions.length} of {predictions.length} predictions
          </div>
          
          {/* Predictions table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPredictions.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{prediction.patientName}</div>
                          <div className="text-sm text-gray-500">{prediction.patientMrn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelClass(prediction.riskScore)}`}>
                        {Math.round(prediction.riskScore * 100)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prediction.predictedOutcome === 'readmit' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {prediction.predictedOutcome === 'readmit' ? 'Readmission' : 'No Readmission'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.modelVersion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.requestedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(prediction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/predictions/${prediction.id}`}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        View Details
                      </Link>
                    </td>
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
