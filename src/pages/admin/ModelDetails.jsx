import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ModelDetails() {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock model data
        const mockModel = {
          id: parseInt(id),
          version: 'v2.3.1',
          name: 'Readmission Predictor',
          status: 'active',
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.79,
          f1Score: 0.80,
          auc: 0.88,
          createdBy: 'Dr. Jane Smith',
          createdDate: '2025-07-01',
          lastUsed: '2025-08-10',
          predictionCount: 548,
          description: 'Latest production model with enhanced feature engineering and improved handling of time-series data.',
          features: [
            { name: 'Age', importance: 0.28, type: 'demographic' },
            { name: 'Previous Admissions', importance: 0.22, type: 'history' },
            { name: 'Length of Stay', importance: 0.18, type: 'clinical' },
            { name: 'Diagnosis Code', importance: 0.16, type: 'clinical' },
            { name: 'Blood Pressure', importance: 0.14, type: 'clinical' },
            { name: 'Medication Count', importance: 0.12, type: 'clinical' },
            { name: 'Insurance Type', importance: 0.10, type: 'demographic' },
            { name: 'Distance from Hospital', importance: 0.09, type: 'demographic' },
            { name: 'Discharge Disposition', importance: 0.08, type: 'clinical' },
            { name: 'Gender', importance: 0.05, type: 'demographic' },
          ],
          hyperparameters: [
            { name: 'n_estimators', value: '200' },
            { name: 'max_depth', value: '8' },
            { name: 'min_samples_split', value: '5' },
            { name: 'min_samples_leaf', value: '2' },
            { name: 'bootstrap', value: 'True' },
            { name: 'class_weight', value: 'balanced' },
            { name: 'random_state', value: '42' }
          ],
          confusionMatrix: {
            truePositive: 125,
            falsePositive: 28,
            trueNegative: 352,
            falseNegative: 33
          },
          predictionDistribution: [
            { risk: "0-10%", count: 145 },
            { risk: "11-20%", count: 102 },
            { risk: "21-30%", count: 78 },
            { risk: "31-40%", count: 65 },
            { risk: "41-50%", count: 52 },
            { risk: "51-60%", count: 43 },
            { risk: "61-70%", count: 31 },
            { risk: "71-80%", count: 22 },
            { risk: "81-90%", count: 17 },
            { risk: "91-100%", count: 10 }
          ],
          recentPredictions: [
            { id: 1, patientId: 'P-10567', patientName: 'James Wilson', risk: 0.82, outcome: 'Readmitted', timestamp: '2025-08-10T14:32:00' },
            { id: 2, patientId: 'P-10568', patientName: 'Emily Parker', risk: 0.23, outcome: 'Not Readmitted', timestamp: '2025-08-10T13:45:00' },
            { id: 3, patientId: 'P-10569', patientName: 'Robert Johnson', risk: 0.67, outcome: 'Readmitted', timestamp: '2025-08-10T11:20:00' },
            { id: 4, patientId: 'P-10570', patientName: 'Sarah Adams', risk: 0.12, outcome: 'Not Readmitted', timestamp: '2025-08-10T10:05:00' },
            { id: 5, patientId: 'P-10571', patientName: 'Michael Brown', risk: 0.91, outcome: 'Readmitted', timestamp: '2025-08-09T16:50:00' }
          ],
          versions: [
            { version: 'v2.3.1', date: '2025-07-01', changes: 'Added new feature engineering for time-series data' },
            { version: 'v2.2.0', date: '2025-05-15', changes: 'Hyperparameter tuning and optimization' },
            { version: 'v2.1.5', date: '2025-03-10', changes: 'Added additional clinical features' }
          ],
          environmentDetails: {
            framework: 'scikit-learn',
            version: '1.3.2',
            pythonVersion: '3.9.12',
            dependencies: [
              { name: 'pandas', version: '2.0.1' },
              { name: 'numpy', version: '1.24.3' },
              { name: 'matplotlib', version: '3.7.1' },
              { name: 'shap', version: '0.42.0' }
            ]
          }
        };
        
        setModel(mockModel);
      } catch (err) {
        console.error('Error loading model details:', err);
        setError('Failed to load model details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelDetails();
  }, [id]);

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format date time helper
  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                {['overview', 'features', 'performance', 'predictions', 'history'].map((tab, index) => (
                  <div key={index} className="h-8 bg-gray-200 rounded w-24"></div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
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
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading model details</h3>
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

  if (!model) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Model not found</h3>
            <p className="mt-2 text-sm text-gray-500">The requested model could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Model Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{model.name} {model.version}</h1>
              <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                model.status === 'active' ? 'bg-teal-100 text-teal-800' : 
                model.status === 'available' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{model.description}</p>
          </div>
          <div className="flex space-x-3">
            {model.status !== 'active' && (
              <button
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Activate Model
              </button>
            )}
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Download Model
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'overview'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${
                activeTab === 'features'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('features')}
            >
              Features & Parameters
            </button>
            <button
              className={`${
                activeTab === 'performance'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button
              className={`${
                activeTab === 'predictions'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('predictions')}
            >
              Predictions
            </button>
            <button
              className={`${
                activeTab === 'history'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('history')}
            >
              Version History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Model Summary Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg col-span-2">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Model Summary
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Model Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{model.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Version</dt>
                            <dd className="mt-1 text-sm text-gray-900">{model.version}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                model.status === 'active' ? 'bg-teal-100 text-teal-800' : 
                                model.status === 'available' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created By</dt>
                            <dd className="mt-1 text-sm text-gray-900">{model.createdBy}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(model.createdDate)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Used</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(model.lastUsed)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Total Predictions</dt>
                            <dd className="mt-1 text-sm text-gray-900">{model.predictionCount.toLocaleString()}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Framework</dt>
                            <dd className="mt-1 text-sm text-gray-900">{model.environmentDetails.framework} {model.environmentDetails.version}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-sm text-gray-900">{model.description}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Performance Metrics
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-500">Accuracy</span>
                          <span className="text-gray-900">{model.accuracy.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${model.accuracy * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-500">Precision</span>
                          <span className="text-gray-900">{model.precision.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${model.precision * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-500">Recall</span>
                          <span className="text-gray-900">{model.recall.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${model.recall * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-500">F1 Score</span>
                          <span className="text-gray-900">{model.f1Score.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${model.f1Score * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-500">AUC</span>
                          <span className="text-gray-900">{model.auc.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${model.auc * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Predictions Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg col-span-2">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Predictions
                    </h3>
                    <button
                      className="text-sm text-teal-600 hover:text-teal-800"
                      onClick={() => setActiveTab('predictions')}
                    >
                      View all
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
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
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {model.recentPredictions.map((prediction) => (
                          <tr key={prediction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{prediction.patientName}</div>
                                  <div className="text-sm text-gray-500">{prediction.patientId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className={`inline-block w-12 h-3 rounded-full ${
                                  prediction.risk > 0.7 ? 'bg-red-500' :
                                  prediction.risk > 0.4 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}></div>
                                <span className="ml-2">{(prediction.risk * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                prediction.outcome === 'Readmitted' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {prediction.outcome}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDateTime(prediction.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Risk Distribution Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Risk Distribution
                    </h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="h-48 relative">
                      {model.predictionDistribution.map((item, index) => {
                        const maxCount = Math.max(...model.predictionDistribution.map(d => d.count));
                        const height = (item.count / maxCount) * 100;
                        const isHighRisk = index > 5; // 50%+ risk
                        
                        return (
                          <div 
                            key={index} 
                            className="absolute bottom-0 w-1/10 border-r border-white" 
                            style={{ 
                              left: `${index * 10}%`, 
                              height: `${height}%`, 
                              backgroundColor: isHighRisk ? `rgba(239, 68, 68, ${0.5 + (index - 5) / 10})` : `rgba(34, 197, 94, ${0.7 - index / 10})` 
                            }}
                          >
                            <div className="absolute bottom-full left-0 text-xs text-gray-500 -mb-5">
                              {item.risk}
                            </div>
                            <div className="absolute -top-5 left-0 right-0 text-xs text-gray-600 text-center">
                              {item.count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-10 text-xs text-gray-500 text-center">
                      Risk Percentage
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature Importance */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Feature Importance
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-3">
                    {model.features.map((feature, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-900">{feature.name}</span>
                          <div>
                            <span className="text-gray-500 mr-2">
                              {(feature.importance * 100).toFixed(0)}%
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              feature.type === 'clinical' ? 'bg-blue-100 text-blue-800' : 
                              feature.type === 'demographic' ? 'bg-purple-100 text-purple-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {feature.type}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${feature.importance * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Hyperparameters */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Hyperparameters
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parameter
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {model.hyperparameters.map((param, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {param.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <code className="px-2 py-1 bg-gray-100 rounded text-gray-800">
                              {param.value}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Environment Details */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Environment Details
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Framework</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {model.environmentDetails.framework} {model.environmentDetails.version}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Python Version</dt>
                      <dd className="mt-1 text-sm text-gray-900">{model.environmentDetails.pythonVersion}</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Dependencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.environmentDetails.dependencies.map((dep, index) => (
                        <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">
                          {dep.name} {dep.version}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Confusion Matrix */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Confusion Matrix
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-2 h-48">
                    <div className="bg-green-100 flex flex-col items-center justify-center text-center p-3">
                      <div className="text-lg font-bold text-green-800">
                        {model.confusionMatrix.truePositive}
                      </div>
                      <div className="text-sm font-medium text-green-700">True Positive</div>
                      <div className="text-xs text-green-600 mt-1">
                        Correctly predicted readmission
                      </div>
                    </div>
                    <div className="bg-red-100 flex flex-col items-center justify-center text-center p-3">
                      <div className="text-lg font-bold text-red-800">
                        {model.confusionMatrix.falsePositive}
                      </div>
                      <div className="text-sm font-medium text-red-700">False Positive</div>
                      <div className="text-xs text-red-600 mt-1">
                        Incorrectly predicted readmission
                      </div>
                    </div>
                    <div className="bg-red-100 flex flex-col items-center justify-center text-center p-3">
                      <div className="text-lg font-bold text-red-800">
                        {model.confusionMatrix.falseNegative}
                      </div>
                      <div className="text-sm font-medium text-red-700">False Negative</div>
                      <div className="text-xs text-red-600 mt-1">
                        Missed actual readmission
                      </div>
                    </div>
                    <div className="bg-green-100 flex flex-col items-center justify-center text-center p-3">
                      <div className="text-lg font-bold text-green-800">
                        {model.confusionMatrix.trueNegative}
                      </div>
                      <div className="text-sm font-medium text-green-700">True Negative</div>
                      <div className="text-xs text-green-600 mt-1">
                        Correctly predicted no readmission
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
                    <div>Actual: Readmitted</div>
                    <div>Actual: Not Readmitted</div>
                  </div>
                  <div className="mt-1 mb-2 grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
                    <div>Predicted: Readmitted</div>
                    <div>Predicted: Not Readmitted</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Detailed Metrics
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col border border-gray-200 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-500">Accuracy</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{model.accuracy.toFixed(2)}</dd>
                      <dd className="mt-2 text-xs text-gray-500">Proportion of correct predictions</dd>
                    </div>
                    <div className="flex flex-col border border-gray-200 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-500">Precision</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{model.precision.toFixed(2)}</dd>
                      <dd className="mt-2 text-xs text-gray-500">True positives / predicted positives</dd>
                    </div>
                    <div className="flex flex-col border border-gray-200 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-500">Recall</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{model.recall.toFixed(2)}</dd>
                      <dd className="mt-2 text-xs text-gray-500">True positives / actual positives</dd>
                    </div>
                    <div className="flex flex-col border border-gray-200 rounded-lg p-4">
                      <dt className="text-sm font-medium text-gray-500">F1 Score</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{model.f1Score.toFixed(2)}</dd>
                      <dd className="mt-2 text-xs text-gray-500">Harmonic mean of precision and recall</dd>
                    </div>
                    <div className="flex flex-col border border-gray-200 rounded-lg p-4 col-span-2">
                      <dt className="text-sm font-medium text-gray-500">AUC (Area Under Curve)</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">{model.auc.toFixed(2)}</dd>
                      <dd className="mt-2 text-xs text-gray-500">Area under the ROC curve, indicating model's ability to discriminate between classes</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Predictions
                </h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="Search patient or ID..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-700">Filter by:</span>
                  <select className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500">
                    <option>All outcomes</option>
                    <option>Readmitted</option>
                    <option>Not Readmitted</option>
                  </select>
                  <select className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500">
                    <option>All risk levels</option>
                    <option>High risk ({'>'}70%)</option>
                    <option>Medium risk (40-70%)</option>
                    <option>Low risk ({'<'}40%)</option>
                  </select>
                  <div className="relative">
                    <input
                      type="date"
                      className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
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
                      Timestamp
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Expanded rows for more predictions */}
                  {[...model.recentPredictions, 
                    { id: 6, patientId: 'P-10572', patientName: 'Jessica Lee', risk: 0.35, outcome: 'Not Readmitted', timestamp: '2025-08-09T14:20:00' },
                    { id: 7, patientId: 'P-10573', patientName: 'David Smith', risk: 0.78, outcome: 'Readmitted', timestamp: '2025-08-09T11:30:00' },
                    { id: 8, patientId: 'P-10574', patientName: 'Amanda Taylor', risk: 0.42, outcome: 'Not Readmitted', timestamp: '2025-08-09T10:15:00' },
                    { id: 9, patientId: 'P-10575', patientName: 'John Reynolds', risk: 0.89, outcome: 'Readmitted', timestamp: '2025-08-08T16:45:00' },
                    { id: 10, patientId: 'P-10576', patientName: 'Maria Garcia', risk: 0.15, outcome: 'Not Readmitted', timestamp: '2025-08-08T14:10:00' }
                  ].map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{prediction.patientName}</div>
                            <div className="text-sm text-gray-500">{prediction.patientId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className={`inline-block w-16 h-3 rounded-full ${
                            prediction.risk > 0.7 ? 'bg-red-500' :
                            prediction.risk > 0.4 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="ml-2">{(prediction.risk * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          prediction.outcome === 'Readmitted' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {prediction.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(prediction.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-teal-600 hover:text-teal-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{model.predictionCount}</span> predictions
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-teal-50 text-sm font-medium text-teal-600 hover:bg-teal-100">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        55
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Version History
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <ol className="relative border-l border-gray-200">
                    {[...model.versions, 
                      { version: 'v1.5.2', date: '2024-10-15', changes: 'Added additional clinical features and implemented SMOTE for class imbalance' },
                      { version: 'v1.0.0', date: '2024-06-01', changes: 'Initial release using random forest classifier with basic features' }
                    ].map((version, index) => (
                      <li key={index} className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full -left-3 ring-8 ring-white">
                          <svg className="w-3 h-3 text-teal-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                          {version.version}
                          {index === 0 && <span className="bg-teal-100 text-teal-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">{formatDate(version.date)}</time>
                        <p className="text-base font-normal text-gray-500">{version.changes}</p>
                        
                        {index !== model.versions.length - 1 && (
                          <div className="flex mt-4 space-x-3 md:mt-6">
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-teal-700 rounded-lg hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300">
                              Compare with current
                            </button>
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200">
                              Download
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
