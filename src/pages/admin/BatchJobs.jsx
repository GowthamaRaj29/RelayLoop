import React, { useState, useEffect } from 'react';

export default function BatchJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  
  // Fetch batch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock jobs data
        const mockJobs = [
          {
            id: 1,
            name: 'Daily Patient Risk Scoring',
            status: 'completed',
            type: 'prediction',
            schedule: 'Daily at 02:00',
            lastRun: '2025-08-10T02:00:00',
            duration: '12m 48s',
            processedItems: 532,
            errors: 0,
            createdBy: 'System',
            description: 'Runs risk assessment on all active patients'
          },
          {
            id: 2,
            name: 'Weekly Model Performance Report',
            status: 'completed',
            type: 'report',
            schedule: 'Weekly on Monday at 01:00',
            lastRun: '2025-08-05T01:00:00',
            duration: '5m 23s',
            processedItems: 3,
            errors: 0,
            createdBy: 'Dr. Jane Smith',
            description: 'Generates performance metrics for all active models'
          },
          {
            id: 3,
            name: 'Monthly Data Archiving',
            status: 'scheduled',
            type: 'maintenance',
            schedule: 'Monthly on 1st at 03:00',
            lastRun: '2025-07-01T03:00:00',
            duration: '32m 15s',
            processedItems: 12489,
            errors: 0,
            createdBy: 'System',
            description: 'Archives old patient data and predictions'
          },
          {
            id: 4,
            name: 'High-Risk Patients Notification',
            status: 'running',
            type: 'notification',
            schedule: 'Daily at 08:00',
            lastRun: '2025-08-10T08:00:00',
            duration: 'Running...',
            processedItems: 189,
            errors: 0,
            createdBy: 'System',
            description: 'Sends notifications for high-risk patients to department staff'
          },
          {
            id: 5,
            name: 'Data Quality Check',
            status: 'failed',
            type: 'validation',
            schedule: 'Weekly on Sunday at 22:00',
            lastRun: '2025-08-04T22:00:00',
            duration: '2m 12s',
            processedItems: 5423,
            errors: 17,
            createdBy: 'System',
            description: 'Validates data integrity and reports inconsistencies'
          },
          {
            id: 6,
            name: 'Model Retraining - Readmission Predictor',
            status: 'scheduled',
            type: 'model-training',
            schedule: 'Quarterly',
            lastRun: '2025-06-15T04:00:00',
            duration: '3h 45m',
            processedItems: 24567,
            errors: 0,
            createdBy: 'Dr. Robert Chen',
            description: 'Retrains the readmission prediction model with latest data'
          },
          {
            id: 7,
            name: 'System Backup',
            status: 'completed',
            type: 'maintenance',
            schedule: 'Daily at 00:00',
            lastRun: '2025-08-10T00:00:00',
            duration: '8m 36s',
            processedItems: null,
            errors: 0,
            createdBy: 'System',
            description: 'Creates full system backup'
          }
        ];
        
        setJobs(mockJobs);
      } catch (err) {
        console.error('Error loading batch jobs:', err);
        setError('Failed to load batch jobs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Format datetime helper
  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Get status badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get job type badge color
  const getJobTypeBadgeClass = (type) => {
    switch (type) {
      case 'prediction':
        return 'bg-teal-100 text-teal-800';
      case 'report':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      case 'notification':
        return 'bg-yellow-100 text-yellow-800';
      case 'validation':
        return 'bg-indigo-100 text-indigo-800';
      case 'model-training':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filter jobs based on active tab
  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'all') return true;
    return job.status === activeTab;
  });
  
  // Job counts by status
  const counts = {
    all: jobs.length,
    running: jobs.filter(job => job.status === 'running').length,
    scheduled: jobs.filter(job => job.status === 'scheduled').length,
    completed: jobs.filter(job => job.status === 'completed').length,
    failed: jobs.filter(job => job.status === 'failed').length,
  };
  
  // Handle job actions
  const handleRunJob = (id) => {
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, status: 'running', lastRun: new Date().toISOString(), duration: 'Running...' } : job
    );
    setJobs(updatedJobs);
  };
  
  const handleCancelJob = (id) => {
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, status: 'cancelled', duration: 'Cancelled' } : job
    );
    setJobs(updatedJobs);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Batch Jobs</h1>
          <div className="mt-6 animate-pulse">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                {['all', 'running', 'scheduled', 'completed', 'failed'].map((tab, index) => (
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                      <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map(i => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded w-36 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div>
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
          <h1 className="text-2xl font-semibold text-gray-900">Batch Jobs</h1>
          <div className="mt-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading batch jobs</h3>
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
          <h1 className="text-2xl font-semibold text-gray-900">Batch Jobs</h1>
          <button
            onClick={() => setShowNewJobModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h3a1 1 0 110 2h-3v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h3V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Job
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'all'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('all')}
            >
              All Jobs
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs bg-gray-100 text-gray-800">{counts.all}</span>
            </button>
            <button
              className={`${
                activeTab === 'running'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('running')}
            >
              Running
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs bg-blue-100 text-blue-800">{counts.running}</span>
            </button>
            <button
              className={`${
                activeTab === 'scheduled'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('scheduled')}
            >
              Scheduled
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs bg-purple-100 text-purple-800">{counts.scheduled}</span>
            </button>
            <button
              className={`${
                activeTab === 'completed'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs bg-green-100 text-green-800">{counts.completed}</span>
            </button>
            <button
              className={`${
                activeTab === 'failed'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('failed')}
            >
              Failed
              <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs bg-red-100 text-red-800">{counts.failed}</span>
            </button>
          </nav>
        </div>
        
        {/* Jobs List */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {activeTab === 'all' && 'All Batch Jobs'}
                {activeTab === 'running' && 'Running Jobs'}
                {activeTab === 'scheduled' && 'Scheduled Jobs'}
                {activeTab === 'completed' && 'Completed Jobs'}
                {activeTab === 'failed' && 'Failed Jobs'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {activeTab === 'all' && 'All system batch jobs'}
                {activeTab === 'running' && 'Jobs currently in progress'}
                {activeTab === 'scheduled' && 'Jobs scheduled to run in the future'}
                {activeTab === 'completed' && 'Jobs that completed successfully'}
                {activeTab === 'failed' && 'Jobs that failed to complete'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Search jobs..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <select 
                className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
              >
                <option>All job types</option>
                <option>Prediction</option>
                <option>Report</option>
                <option>Maintenance</option>
                <option>Notification</option>
                <option>Validation</option>
                <option>Model Training</option>
              </select>
            </div>
          </div>
          {filteredJobs.length === 0 ? (
            <div className="px-4 py-8 sm:px-6 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">There are no jobs matching your criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Run
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{job.name}</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getJobTypeBadgeClass(job.type)}`}>
                            {job.type.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {job.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.schedule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(job.lastRun)}</div>
                      <div className="text-sm text-gray-500">Duration: {job.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        {job.status === 'scheduled' && (
                          <button
                            onClick={() => handleRunJob(job.id)}
                            className="text-teal-600 hover:text-teal-900"
                          >
                            Run now
                          </button>
                        )}
                        {job.status === 'running' && (
                          <button
                            onClick={() => handleCancelJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Create New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Create New Batch Job</h2>
              <button
                onClick={() => setShowNewJobModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter job name..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option>Prediction</option>
                  <option>Report</option>
                  <option>Maintenance</option>
                  <option>Notification</option>
                  <option>Validation</option>
                  <option>Model Training</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Schedule</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option>One-time</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Run At</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  <input type="time" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parameters</label>
                <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} placeholder="Enter job parameters (JSON)"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={2} placeholder="Enter job description..."></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
