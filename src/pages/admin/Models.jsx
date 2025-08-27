import React, { useState, useEffect } from 'react';

export default function Models() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('active');
  const [showModelModal, setShowModelModal] = useState(false);
  
  // Fetch models data
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockModels = [
          {
            id: 1,
            version: 'v2.3.1',
            name: 'Readmission Predictor',
            status: 'active',
            accuracy: 0.85,
            precision: 0.82,
            recall: 0.79,
            f1Score: 0.80,
            createdBy: 'Dr. Jane Smith',
            createdDate: '2025-07-01',
            lastUsed: '2025-08-10',
            predictionCount: 548,
            description: 'Latest production model with enhanced feature engineering and improved handling of time-series data.'
          },
          {
            id: 2,
            version: 'v2.2.0',
            name: 'Readmission Predictor',
            status: 'available',
            accuracy: 0.82,
            precision: 0.79,
            recall: 0.77,
            f1Score: 0.78,
            createdBy: 'Dr. Jane Smith',
            createdDate: '2025-05-15',
            lastUsed: '2025-07-01',
            predictionCount: 1245,
            description: 'Previous production model with gradient boosting classifier.'
          },
          {
            id: 3,
            version: 'v2.1.5',
            name: 'Readmission Predictor',
            status: 'available',
            accuracy: 0.79,
            precision: 0.76,
            recall: 0.75,
            f1Score: 0.75,
            createdBy: 'Dr. Robert Chen',
            createdDate: '2025-03-10',
            lastUsed: '2025-05-15',
            predictionCount: 2354,
            description: 'Model with additional feature selection and hyperparameter tuning.'
          },
          {
            id: 4,
            version: 'v2.0.0',
            name: 'Readmission Predictor',
            status: 'archived',
            accuracy: 0.75,
            precision: 0.73,
            recall: 0.72,
            f1Score: 0.72,
            createdBy: 'Dr. Robert Chen',
            createdDate: '2025-01-20',
            lastUsed: '2025-03-10',
            predictionCount: 1876,
            description: 'First version with enhanced neural network architecture.'
          },
          {
            id: 5,
            version: 'v1.5.2',
            name: 'Readmission Predictor',
            status: 'archived',
            accuracy: 0.72,
            precision: 0.70,
            recall: 0.68,
            f1Score: 0.69,
            createdBy: 'Dr. Sarah Wilson',
            createdDate: '2024-10-15',
            lastUsed: '2025-01-20',
            predictionCount: 3421,
            description: 'Improved version with additional clinical features.'
          },
          {
            id: 6,
            version: 'v1.0.0',
            name: 'Readmission Predictor',
            status: 'archived',
            accuracy: 0.68,
            precision: 0.65,
            recall: 0.63,
            f1Score: 0.64,
            createdBy: 'Dr. Sarah Wilson',
            createdDate: '2024-06-01',
            lastUsed: '2024-10-15',
            predictionCount: 2189,
            description: 'Initial production model using random forest.'
          }
        ];
        
        setModels(mockModels);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load models. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter models based on selected tab
  const filteredModels = models.filter(model => {
    if (selectedTab === 'active') return model.status === 'active';
    if (selectedTab === 'available') return model.status === 'available';
    if (selectedTab === 'archived') return model.status === 'archived';
    return true; // 'all' tab
  });
  
  // Calculate model counts
  const activeCounts = models.filter(model => model.status === 'active').length;
  const availableCounts = models.filter(model => model.status === 'available').length;
  const archivedCounts = models.filter(model => model.status === 'archived').length;
  
  // Handle model actions
  const handleActivateModel = (id) => {
    const updatedModels = models.map(model => {
      if (model.id === id) {
        return { ...model, status: 'active' };
      } else if (model.status === 'active') {
        return { ...model, status: 'available' };
      }
      return model;
    });
    setModels(updatedModels);
  };
  
  const handleArchiveModel = (id) => {
    const updatedModels = models.map(model => 
      model.id === id ? { ...model, status: 'archived' } : model
    );
    setModels(updatedModels);
  };
  
  const handleRestoreModel = (id) => {
    const updatedModels = models.map(model => 
      model.id === id ? { ...model, status: 'available' } : model
    );
    setModels(updatedModels);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Models</h1>
          <div className="mt-6 animate-pulse">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                {['active', 'available', 'archived', 'all'].map((tab, index) => (
                  <div key={index} className="h-8 bg-gray-200 rounded w-24"></div>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map(i => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          <h1 className="text-2xl font-semibold text-gray-900">Models</h1>
          <div className="mt-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading models</h3>
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
          <h1 className="text-2xl font-semibold text-gray-900">Models</h1>
          <button
            onClick={() => setShowModelModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h3a1 1 0 110 2h-3v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h3V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Model
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                selectedTab === 'active'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setSelectedTab('active')}
            >
              Active
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-teal-100 text-teal-800">{activeCounts}</span>
            </button>
            <button
              className={`${
                selectedTab === 'available'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setSelectedTab('available')}
            >
              Available
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-800">{availableCounts}</span>
            </button>
            <button
              className={`${
                selectedTab === 'archived'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setSelectedTab('archived')}
            >
              Archived
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-800">{archivedCounts}</span>
            </button>
            <button
              className={`${
                selectedTab === 'all'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setSelectedTab('all')}
            >
              All Models
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-800">{models.length}</span>
            </button>
          </nav>
        </div>
        
        {/* Models list */}
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedTab === 'active' && 'Active Model'}
                {selectedTab === 'available' && 'Available Models'}
                {selectedTab === 'archived' && 'Archived Models'}
                {selectedTab === 'all' && 'All Models'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {selectedTab === 'active' && 'The currently active model used for predictions'}
                {selectedTab === 'available' && 'Models available for use in predictions'}
                {selectedTab === 'archived' && 'Older models that are no longer in use'}
                {selectedTab === 'all' && 'All models in the system'}
              </p>
            </div>
            <div className="border-t border-gray-200">
              {filteredModels.length === 0 ? (
                <div className="px-4 py-5 sm:px-6 text-center text-sm text-gray-500">
                  No models found.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metrics
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredModels.map((model) => (
                      <tr key={model.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                model.status === 'active' ? 'bg-teal-100 text-teal-800' : 
                                model.status === 'available' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center text-sm font-medium text-gray-900">
                                {model.version}
                                {model.status === 'active' && (
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-800">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {model.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <div className="text-xs">
                              <span className="text-gray-500">Accuracy:</span> 
                              <span className="ml-1 text-gray-900 font-medium">{model.accuracy.toFixed(2)}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Precision:</span> 
                              <span className="ml-1 text-gray-900 font-medium">{model.precision.toFixed(2)}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Recall:</span> 
                              <span className="ml-1 text-gray-900 font-medium">{model.recall.toFixed(2)}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">F1 Score:</span> 
                              <span className="ml-1 text-gray-900 font-medium">{model.f1Score.toFixed(2)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(model.createdDate)}</div>
                          <div className="text-sm text-gray-500">{model.createdBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{model.predictionCount.toLocaleString()} predictions</div>
                          <div className="text-sm text-gray-500">Last used: {formatDate(model.lastUsed)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {model.status === 'active' ? (
                            <button
                              onClick={() => handleArchiveModel(model.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Archive
                            </button>
                          ) : model.status === 'available' ? (
                            <div className="space-x-4">
                              <button
                                onClick={() => handleActivateModel(model.id)}
                                className="text-teal-600 hover:text-teal-900"
                              >
                                Activate
                              </button>
                              <button
                                onClick={() => handleArchiveModel(model.id)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Archive
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRestoreModel(model.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Restore
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Model Modal */}
      {showModelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add New Model</h2>
              <button
                onClick={() => setShowModelModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Model Version</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g. v2.4.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model Description</label>
                <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} placeholder="Brief description of the model"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model File</label>
                <div className="mt-1 flex items-center">
                  <input type="file" className="sr-only" id="model-file" />
                  <label htmlFor="model-file" className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                    Choose file
                  </label>
                  <p className="ml-3 text-sm text-gray-500">No file selected</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Accuracy</label>
                  <input type="number" step="0.01" min="0" max="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precision</label>
                  <input type="number" step="0.01" min="0" max="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recall</label>
                  <input type="number" step="0.01" min="0" max="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">F1 Score</label>
                  <input type="number" step="0.01" min="0" max="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Status</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option>Available</option>
                  <option>Active (replaces current active model)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  Add Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
