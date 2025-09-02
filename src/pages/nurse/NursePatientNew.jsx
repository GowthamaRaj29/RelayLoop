import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import PatientForm from '../common/PatientForm';
import { patientAPI } from '../../services/api';

export default function NursePatientNew() {
  const navigate = useNavigate();
  const [currentDepartment] = useOutletContext();

  const handleSubmit = async (payload) => {
    try {
      // Prepare patient data for the API - match backend DTO exactly
      const patientData = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        dob: payload.dob,
        gender: payload.gender,
        mrn: payload.mrn,
        department: currentDepartment, // Use 'department' not 'department_id'
        attending_doctor: payload.attending_doctor,
        phone: payload.phone || '',
        email: payload.email || '', // Ensure email is not undefined
        address: payload.address || '',
        insurance: payload.insurance || '',
        room: payload.room || '',
        medical_conditions: Array.isArray(payload.medical_conditions) 
          ? payload.medical_conditions 
          : payload.medical_conditions?.split(',').map(c => c.trim()).filter(c => c) || [],
        notes: payload.notes || ''
        // Remove emergency_contact fields as they don't exist in DTO
      };

      // Remove email if it's empty to avoid validation error
      if (!patientData.email) {
        delete patientData.email;
      }

      // Save to backend/Supabase
      const response = await patientAPI.createPatient(patientData);
      console.log('Patient created:', response);
      
      alert('Patient added successfully and saved to database!');
      navigate('/nurse/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
      alert(`Failed to create patient: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/relyloop.svg" alt="RelyLoop" className="h-8 w-auto" />
          <h1 className="ml-3 text-2xl font-semibold text-gray-900">Add New Patient</h1>
        </div>
        <Link to="/nurse/patients" className="text-blue-700 hover:text-blue-800">Back to Patients</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <PatientForm department={currentDepartment} onCancel={() => navigate('/nurse/patients')} onSubmit={handleSubmit} submitLabel="Add Patient" />
      </div>
    </div>
  );
}
