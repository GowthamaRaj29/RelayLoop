import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function VitalSignsForm({ onSubmit, initialData = {} }) {
  const [vitalSigns, setVitalSigns] = useState({
    temperature: initialData.temperature || '',
    bloodPressureSystolic: initialData.bloodPressureSystolic || '',
    bloodPressureDiastolic: initialData.bloodPressureDiastolic || '',
    heartRate: initialData.heartRate || '',
    respiratoryRate: initialData.respiratoryRate || '',
    oxygenSaturation: initialData.oxygenSaturation || '',
    bloodGlucose: initialData.bloodGlucose || '',
    notes: initialData.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitalSigns(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vitalSigns);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            name="temperature"
            id="temperature"
            value={vitalSigns.temperature}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="37.0"
          />
        </div>

        <div>
          <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
            Blood Pressure (mmHg)
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="number"
              name="bloodPressureSystolic"
              id="bloodPressureSystolic"
              value={vitalSigns.bloodPressureSystolic}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="120"
            />
            <span className="inline-flex items-center text-gray-500">/</span>
            <input
              type="number"
              name="bloodPressureDiastolic"
              id="bloodPressureDiastolic"
              value={vitalSigns.bloodPressureDiastolic}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="80"
            />
          </div>
        </div>

        <div>
          <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
            Heart Rate (bpm)
          </label>
          <input
            type="number"
            name="heartRate"
            id="heartRate"
            value={vitalSigns.heartRate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="75"
          />
        </div>

        <div>
          <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
            Respiratory Rate (breaths/min)
          </label>
          <input
            type="number"
            name="respiratoryRate"
            id="respiratoryRate"
            value={vitalSigns.respiratoryRate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="16"
          />
        </div>

        <div>
          <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
            Oxygen Saturation (%)
          </label>
          <input
            type="number"
            name="oxygenSaturation"
            id="oxygenSaturation"
            value={vitalSigns.oxygenSaturation}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="98"
          />
        </div>

        <div>
          <label htmlFor="bloodGlucose" className="block text-sm font-medium text-gray-700">
            Blood Glucose (mg/dL)
          </label>
          <input
            type="number"
            name="bloodGlucose"
            id="bloodGlucose"
            value={vitalSigns.bloodGlucose}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="100"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={vitalSigns.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any additional observations..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Vitals
        </button>
      </div>
    </form>
  );
}

VitalSignsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    temperature: PropTypes.string,
    bloodPressureSystolic: PropTypes.string,
    bloodPressureDiastolic: PropTypes.string,
    heartRate: PropTypes.string,
    respiratoryRate: PropTypes.string,
    oxygenSaturation: PropTypes.string,
    bloodGlucose: PropTypes.string,
    notes: PropTypes.string
  })
};
