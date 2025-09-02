import { useNavigate, Link, useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PatientForm from '../common/PatientForm';
import { patientAPI } from '../../services/api';

export default function NursePatientEdit() {
  const navigate = useNavigate();
  const [currentDepartment] = useOutletContext();
  const { patientId } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await patientAPI.getPatient(patientId);
        const patient = response.data || response;
        
        console.log('Loaded patient for editing:', patient);
        
        // Transform the data for the form
        setInitialValues({
          ...patient,
          medical_conditions: Array.isArray(patient.medical_conditions) 
            ? patient.medical_conditions.join(', ') 
            : (patient.medical_conditions || ''),
          allergies: Array.isArray(patient.allergies) 
            ? patient.allergies.join(', ') 
            : (patient.allergies || ''),
        });
        
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError(`Failed to load patient: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const handleSubmit = async (formData) => {
    try {
      console.log('Submitting patient update:', formData);
      
      // Filter out readonly/computed fields that shouldn't be updated
      // Only include fields that are defined in CreatePatientDto
      const allowedFields = [
        'first_name', 'last_name', 'mrn', 'dob', 'gender', 'phone', 'email', 'address',
        'insurance', 'medical_conditions', 'allergies', 'department',
        'attending_doctor', 'room', 'last_admission', 'last_visit', 'status', 'notes'
      ];
      
      // Transform form data back to API format and filter allowed fields
      const filteredData = {};
      allowedFields.forEach(field => {
        if (field in formData && formData[field] !== undefined) {
          filteredData[field] = formData[field];
        }
      });
      
      // Handle special field transformations
      if (formData.medical_conditions) {
        filteredData.medical_conditions = typeof formData.medical_conditions === 'string' 
          ? formData.medical_conditions.split(',').map(s => s.trim()).filter(Boolean)
          : formData.medical_conditions;
      }
      
      if (formData.allergies) {
        filteredData.allergies = typeof formData.allergies === 'string'
          ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) 
          : formData.allergies;
      }
      
      console.log('Filtered update data:', filteredData);
      
      const response = await patientAPI.updatePatient(patientId, filteredData);
      console.log('Patient updated successfully:', response);
      
      alert('Patient updated successfully');
      navigate(`/nurse/patients/${patientId}`);
      
    } catch (err) {
      console.error('Error updating patient:', err);
      alert(`Failed to update patient: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">Loading patient data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <h2 className="text-red-800 font-medium">Error Loading Patient</h2>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={() => navigate('/nurse/patients')}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">Patient not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/relyloop.svg" alt="RelyLoop" className="h-8 w-auto" />
          <h1 className="ml-3 text-2xl font-semibold text-gray-900">Edit Patient</h1>
        </div>
        <Link to={`/nurse/patients/${patientId}`} className="text-blue-700 hover:text-blue-800">Back to Details</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <PatientForm 
          initialValues={initialValues} 
          department={currentDepartment} 
          onCancel={() => navigate(-1)} 
          onSubmit={handleSubmit} 
          submitLabel="Save Changes" 
        />
      </div>
    </div>
  );
}
