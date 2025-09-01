import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function PatientForm({ initialValues, department, onCancel, onSubmit, submitLabel = 'Save Patient' }) {
  const [form, setForm] = useState(() => ({
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    mrn: '',
  room: '',
    attending_doctor: '',
    email: '',
    phone: '',
    address: '',
    medical_conditions: '',
    insurance: '',
    notes: '',
    ...initialValues,
  }));

  useEffect(() => {
    setForm(prev => ({ ...prev, department }));
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      department,
      medical_conditions: form.medical_conditions
        ? form.medical_conditions.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name*</label>
          <input id="first_name" name="first_name" required value={form.first_name} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700">Room</label>
          <input id="room" name="room" value={form.room} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name*</label>
          <input id="last_name" name="last_name" required value={form.last_name} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth*</label>
          <input type="date" id="dob" name="dob" required value={form.dob} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">MRN*</label>
          <input id="mrn" name="mrn" required value={form.mrn} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <input id="department" name="department" value={department || ''} disabled
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm" />
          <p className="mt-1 text-xs text-gray-500">Based on your current department</p>
        </div>
        <div>
          <label htmlFor="attending_doctor" className="block text-sm font-medium text-gray-700">Attending Doctor*</label>
          <input id="attending_doctor" name="attending_doctor" required value={form.attending_doctor} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
          <input id="insurance" name="insurance" value={form.insurance} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input id="address" name="address" value={form.address} onChange={handleChange}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>
      <div className="mt-4">
        <label htmlFor="medical_conditions" className="block text sm font-medium text-gray-700">Medical Conditions (comma separated)</label>
        <input id="medical_conditions" name="medical_conditions" value={form.medical_conditions} onChange={handleChange}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>
      <div className="mt-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
        <button type="button" onClick={onCancel}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

PatientForm.propTypes = {
  initialValues: PropTypes.object,
  department: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
};
