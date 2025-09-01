import { useNavigate, Link } from 'react-router-dom';
import PatientForm from '../common/PatientForm';
import { addPatient } from '../../utils/patientsStore';
import { useAuth } from '../../hooks/useAuth';

export default function DoctorPatientNew(){
  const navigate = useNavigate();
  const { department } = useAuth();
  const handleSubmit = (payload) => {
    addPatient(payload);
    alert('Patient added successfully');
    navigate('/doctor/patients');
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/relyloop.svg" alt="RelyLoop" className="h-8 w-auto" />
          <h1 className="ml-3 text-2xl font-semibold text-gray-900">Add New Patient</h1>
        </div>
        <Link to="/doctor/patients" className="text-blue-700 hover:text-blue-800">Back to Patients</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <PatientForm department={department} onCancel={()=>navigate('/doctor/patients')} onSubmit={handleSubmit} submitLabel="Add Patient" />
      </div>
    </div>
  );
}
