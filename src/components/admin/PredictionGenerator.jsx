import { useState } from 'react';

/**
 * PredictionGenerator component allows admins to generate readmission predictions
 * either manually by selecting patients or automatically within a time range
 */
export default function PredictionGenerator({ 
  isOpen, 
  onClose, 
  selectedPatients, 
  isPredicting,
  setIsPredicting,
  onPatientSelectionChange
}) {
  const [mode, setMode] = useState('manual'); // 'manual' or 'automatic'
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [status, setStatus] = useState(null);
  const [autoScheduleActive, setAutoScheduleActive] = useState(false);

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setStatus(null); // Reset status when changing modes
  };

  // Handle patient selection in manual mode
  const handlePatientSelection = (patientIds) => {
    onPatientSelectionChange(patientIds);
  };

  // Handle date range selection in automatic mode
  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  // Generate predictions based on mode
  const generatePredictions = async () => {
    setIsPredicting(true);
    setStatus({ type: 'info', message: 'Generating predictions...' });    try {
      if (mode === 'manual' && selectedPatients.length === 0) {
        throw new Error('Please select at least one patient');
      }
      
      if (mode === 'automatic' && (!dateRange.start || !dateRange.end)) {
        throw new Error('Please select start and end dates');
      }
      
      // In a real app, this would make an API call to your backend service
      // that handles the ML prediction process
      
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would make API calls to generate predictions
        
        // Example success response
        if (mode === 'manual') {
          setStatus({
            type: 'success',
            message: `Successfully generated predictions for ${selectedPatients.length} patients.`,
            details: {
              total: selectedPatients.length,
              highRisk: Math.floor(Math.random() * selectedPatients.length * 0.3),
              mediumRisk: Math.floor(Math.random() * selectedPatients.length * 0.4),
              lowRisk: Math.floor(Math.random() * selectedPatients.length * 0.3)
            }
          });
        } else {
          const totalPatients = Math.floor(Math.random() * 50) + 10;
          setStatus({
            type: 'success',
            message: `Successfully generated predictions for ${totalPatients} patients in the date range.`,
            details: {
              total: totalPatients,
              highRisk: Math.floor(Math.random() * totalPatients * 0.3),
              mediumRisk: Math.floor(Math.random() * totalPatients * 0.4),
              lowRisk: Math.floor(Math.random() * totalPatients * 0.3)
            }
          });
        }
        
        setIsPredicting(false);
      }, 2500);    } catch (error) {
      console.error('Error generating predictions:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Failed to generate predictions'
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Toggle the automatic schedule
  const toggleAutoSchedule = () => {
    if (autoScheduleActive) {
      setAutoScheduleActive(false);
      setStatus({
        type: 'info',
        message: 'Automatic prediction generation disabled.'
      });
    } else {
      if (!dateRange.start || !dateRange.end) {
        setStatus({
          type: 'error',
          message: 'Please select start and end dates before enabling automatic mode.'
        });
        return;
      }
      
      setAutoScheduleActive(true);
      setStatus({
        type: 'success',
        message: 'Automatic prediction generation enabled. System will generate predictions daily.'
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Readmission Prediction Generator</h2>
      
      {/* Mode selector tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => handleModeChange('manual')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            mode === 'manual'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Manual Selection
        </button>
        <button
          onClick={() => handleModeChange('automatic')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            mode === 'automatic'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Automatic Schedule
        </button>
      </div>
      
      {/* Manual selection mode */}
      {mode === 'manual' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patients
            </label>
            {/* Placeholder for patient selection - would be a searchable multi-select component */}
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              multiple
              onChange={(e) => handlePatientSelection(Array.from(e.target.selectedOptions, option => option.value))}
              size="5"
            >
              <option value="1">John Doe (ID: 12345)</option>
              <option value="2">Jane Smith (ID: 12346)</option>
              <option value="3">Robert Johnson (ID: 12347)</option>
              <option value="4">Emily Davis (ID: 12348)</option>
              <option value="5">Michael Wilson (ID: 12349)</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Select multiple patients by holding Ctrl (or Cmd) while clicking
            </p>
          </div>
          
          <div>
            <button
              type="button"
              onClick={generatePredictions}
              disabled={isPredicting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isPredicting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPredicting ? 'Generating...' : 'Generate Predictions'}
            </button>
          </div>
        </div>
      )}
      
      {/* Automatic mode */}
      {mode === 'automatic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start"
                value={dateRange.start}
                onChange={handleDateRangeChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={autoScheduleActive}
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end"
                value={dateRange.end}
                onChange={handleDateRangeChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={autoScheduleActive}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={generatePredictions}
              disabled={isPredicting || autoScheduleActive}
              className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                (isPredicting || autoScheduleActive) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPredicting ? 'Generating...' : 'Generate Once'}
            </button>
            
            <button
              type="button"
              onClick={toggleAutoSchedule}
              disabled={isPredicting}
              className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                autoScheduleActive 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isPredicting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {autoScheduleActive ? 'Disable Auto Schedule' : 'Enable Auto Schedule'}
            </button>
          </div>
          
          {autoScheduleActive && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Automatic generation is active. System will process data daily within the selected date range.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Status message */}
      {status && (
        <div className={`mt-4 rounded-md p-4 ${
          status.type === 'success' ? 'bg-green-50 text-green-800' :
          status.type === 'error' ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          <p className="text-sm">{status.message}</p>
        </div>
      )}
    </div>
  );
}
