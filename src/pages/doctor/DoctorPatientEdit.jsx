import { useNavigate, Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientForm from '../common/PatientForm';
import { getPatientById, updatePatient } from '../../utils/patientsStore';
import { useAuth } from '../../hooks/useAuth';

export default function DoctorPatientEdit(){
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { department } = useAuth();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(()=>{
    const p = getPatientById(patientId);
    if(!p){
      alert('Patient not found');
      navigate('/doctor/patients');
      return;
    }
    setInitialValues({
      ...p,
      medical_conditions: Array.isArray(p.medical_conditions) ? p.medical_conditions.join(', ') : (p.medical_conditions || ''),
    });
  },[patientId, navigate]);

  const handleSubmit = (payload) => {
    updatePatient(patientId, payload);
    alert('Patient updated successfully');
    navigate(`/doctor/patients`);
  };

  if(!initialValues) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/relyloop.svg" alt="RelyLoop" className="h-8 w-auto" />
          <h1 className="ml-3 text-2xl font-semibold text-gray-900">Edit Patient</h1>
        </div>
        <Link to="/doctor/patients" className="text-green-700 hover:text-green-800">Back to Patients</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <PatientForm initialValues={initialValues} department={department} onCancel={()=>navigate(-1)} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
