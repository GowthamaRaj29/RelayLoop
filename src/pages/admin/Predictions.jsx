import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { patientAPI } from '../../services/api';

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Fetch predictions data
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch real data from API
        try {
          const response = await patientAPI.getAllPredictions();
          const predictionsData = response.data || [];
          
          if (predictionsData.length > 0) {
            // Transform API data to match component expectations
            const transformedPredictions = predictionsData.map(prediction => ({
              id: prediction.id,
              patientName: `${prediction.patient?.first_name || ''} ${prediction.patient?.last_name || ''}`.trim() || 'Unknown Patient',
              patientMrn: prediction.patient?.mrn || 'N/A',
              riskScore: prediction.risk_percentage ? prediction.risk_percentage / 100 : 0.5,
              predictedOutcome: prediction.risk_level === 'high' ? 'readmit' : 'no-readmit',
              modelVersion: 'v2.3.1',
              requestedBy: prediction.doctor_id || 'Unknown Doctor',
              date: prediction.predicted_at ? new Date(prediction.predicted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }));
            
            setPredictions(transformedPredictions);
            return;
          }
        } catch (apiError) {
          console.log('Using mock data as API returned no data:', apiError.message);
        }
        
        // Fallback to mock data if API is not available or returns no data
        const mockPredictions = [
          {
            id: 1,
            patientName: 'Alice Johnson',
            patientMrn: 'MRN48291',
            riskScore: 0.87,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Jane Smith',
            date: '2025-08-10'
          },
          {
            id: 2,
            patientName: 'Bob Smith',
            patientMrn: 'MRN38172',
            riskScore: 0.79,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Robert Johnson',
            date: '2025-08-09'
          },
          {
            id: 3,
            patientName: 'Carol Davis',
            patientMrn: 'MRN59281',
            riskScore: 0.76,
            predictedOutcome: 'readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Emily Chen',
            date: '2025-08-08'
          },
          {
            id: 4,
            patientName: 'David Miller',
            patientMrn: 'MRN91827',
            riskScore: 0.42,
            predictedOutcome: 'no-readmit',
            modelVersion: 'v2.3.1',
            requestedBy: 'Dr. Jane Smith',
            date: '2025-08-07'
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

  // Filter predictions
  const filteredPredictions = predictions.filter(prediction => {
    const searchMatch = 
      prediction.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prediction.patientMrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prediction.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    return searchMatch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get risk level class based on score
  const getRiskLevelClass = (score) => {
    if (score >= 0.7) return 'bg-red-100 text-red-800';
    if (score >= 0.3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading predictions...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
            
            <div className="relative w-full sm:w-[280px]">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, MRN, or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outcome
                    </th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Requested By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPredictions.map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{prediction.patientName}</div>
                          <div className="text-sm text-gray-500">{prediction.patientMrn}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${getRiskLevelClass(prediction.riskScore)}`}>
                          {Math.round(prediction.riskScore * 100)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          prediction.predictedOutcome === 'readmit' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {prediction.predictedOutcome === 'readmit' ? 'Readmission' : 'No Readmission'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {prediction.requestedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {formatDate(prediction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedPrediction(prediction);
                            setShowDetailsDialog(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                        >
                          View Details
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {filteredPredictions.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No predictions found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPredictions.length}</span> of{' '}
                  <span className="font-medium">{predictions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    1
                  </button>
                  <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Transition show={showDetailsDialog} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowDetailsDialog(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-xs transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white/80 backdrop-blur-md text-left shadow-xl transition-all w-full max-w-lg">
                  {selectedPrediction && (
                    <>
                      <div className="px-6 py-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                            Prediction Details
                          </Dialog.Title>
                          <button
                            onClick={() => setShowDetailsDialog(false)}
                            className="rounded-full p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="mt-6">
                          <div className="space-y-8">
                            {/* Patient Info Card */}
                            <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                              <h4 className="text-sm font-medium text-gray-500">Patient Information</h4>
                              <p className="mt-2 text-lg font-medium text-gray-900">{selectedPrediction.patientName}</p>
                              <p className="text-sm text-gray-500">{selectedPrediction.patientMrn}</p>
                            </div>
                            
                            {/* Status Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Risk Score Card */}
                              <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                                <h4 className="text-sm font-medium text-gray-500">Risk Score</h4>
                                <div className="mt-2">
                                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getRiskLevelClass(selectedPrediction.riskScore)}`}>
                                    {Math.round(selectedPrediction.riskScore * 100)}%
                                  </div>
                                </div>
                              </div>
                              
                              {/* Outcome Card */}
                              <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                                <h4 className="text-sm font-medium text-gray-500">Predicted Outcome</h4>
                                <div className="mt-2">
                                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                    selectedPrediction.predictedOutcome === 'readmit' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {selectedPrediction.predictedOutcome === 'readmit' ? 'Readmission' : 'No Readmission'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Requested By Card */}
                              <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                                <h4 className="text-sm font-medium text-gray-500">Requested By</h4>
                                <p className="mt-2 text-base text-gray-900">{selectedPrediction.requestedBy}</p>
                              </div>
                              
                              {/* Date Card */}
                              <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                                <p className="mt-2 text-base text-gray-900">{formatDate(selectedPrediction.date)}</p>
                              </div>
                            </div>

                            {/* Risk Factors Card */}
                            <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                              <h4 className="text-sm font-medium text-gray-500">Risk Factors</h4>
                              <ul className="mt-3 space-y-2.5">
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Previous admissions in the last 30 days</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Multiple chronic conditions</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Complex medication regimen</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Limited social support</span>
                                </li>
                              </ul>
                            </div>

                            {/* Recommended Actions Card */}
                            <div className="bg-white/50 backdrop-blur-xs rounded-lg p-4 shadow-sm ring-1 ring-gray-900/5">
                              <h4 className="text-sm font-medium text-gray-500">Recommended Actions</h4>
                              <ul className="mt-3 space-y-2.5">
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Schedule follow-up appointment within 7 days</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Review and adjust medication plan</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Coordinate with social services</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="flex-shrink-0 h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-500"></span>
                                  <span className="ml-2.5 text-sm text-gray-700">Implement remote monitoring program</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-xs px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:hidden"
                            onClick={() => setShowDetailsDialog(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
