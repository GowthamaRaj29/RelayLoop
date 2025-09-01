import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function AddPatientForm({ onSubmit, department }) {
  const [patientData, setPatientData] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    mrn: '',
    email: '',
    phone: '',
    address: '',
    medical_conditions: '',
    attending_doctor: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format medical conditions as array before submitting
    const formattedData = {
      ...patientData,
      department,
      medical_conditions: patientData.medical_conditions
        .split(',')
        .map(condition => condition.trim())
        .filter(condition => condition)
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            value={patientData.first_name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            required
            value={patientData.last_name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={patientData.gender}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            id="dob"
            required
            value={patientData.dob}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="mrn" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Record Number (MRN)
          </label>
          <input
            type="text"
            name="mrn"
            id="mrn"
            required
            value={patientData.mrn}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="MRN12350"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={patientData.email}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={patientData.phone}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={patientData.address}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Conditions (comma-separated)
          </label>
          <input
            type="text"
            name="medical_conditions"
            id="medical_conditions"
            value={patientData.medical_conditions}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Diabetes, Hypertension, etc."
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="attending_doctor" className="block text-sm font-medium text-gray-700 mb-1">
            Attending Doctor
          </label>
          <input
            type="text"
            name="attending_doctor"
            id="attending_doctor"
            required
            value={patientData.attending_doctor}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Dr. Smith"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={patientData.notes}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Patient
        </button>
      </div>
    </form>
  );
}

AddPatientForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  department: PropTypes.string.isRequired
};
