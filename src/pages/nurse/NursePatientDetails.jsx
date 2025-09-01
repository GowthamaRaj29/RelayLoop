import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import { getPatientById, appendVitals, addNote, addMedication } from '../../utils/patientsStore';

export default function NursePatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [currentDepartment] = useOutletContext();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddVitalsModalOpen, setIsAddVitalsModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [vitalsData, setVitalsData] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    notes: ''
  });
  const [noteData, setNoteData] = useState({
    content: '',
    type: 'Observation'
  });
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [medData, setMedData] = useState({ name: '', dosage: '', frequency: '', startDate: '', instructions: '', addedBy: 'Nurse' });
  
  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        // Prefer locally persisted patients first (added from Add Patient flow)
        const local = getPatientById(patientId);
        if (local) {
          if (local.department !== currentDepartment) {
            setError(`You don't have access to this patient's information. This patient belongs to ${local.department} department.`);
          } else {
            setPatient(local);
            setPatient({
              ...local,
              vitals: Array.isArray(local.vitals) ? local.vitals : [],
              medications: Array.isArray(local.medications) ? local.medications : [],
              notes_history: Array.isArray(local.notes_history) ? local.notes_history : []
            });
          }
          setIsLoading(false);
          return;
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock patient data
        const mockPatients = {
          '1': {
            id: '1',
            mrn: 'MRN12345',
            first_name: 'John',
            last_name: 'Doe',
            dob: '1980-05-15',
            gender: 'Male',
            department: 'Cardiology',
            attending_doctor: 'Dr. Smith',
            phone: '(555) 987-6543',
            email: 'john.doe@example.com',
            address: '123 Main St, Anytown, CA',
            insurance: 'Blue Cross Blue Shield',
            room: '205-A',
            admitDate: '2025-08-28',
            status: 'Stable',
            allergies: ['Penicillin', 'Shellfish'],
            medical_conditions: ['Coronary Artery Disease', 'Hypertension'],
            vitals: [
              { 
                id: 1,
                date: '2025-09-01T08:30:00',
                temperature: '98.6',
                heartRate: '78',
                bloodPressure: '130/85',
                respiratoryRate: '16',
                oxygenSaturation: '97',
                weight: '82',
                height: '180',
                notes: 'Patient rested well overnight.'
              },
              { 
                id: 2,
                date: '2025-08-31T16:45:00',
                temperature: '99.1',
                heartRate: '82',
                bloodPressure: '135/88',
                respiratoryRate: '18',
                oxygenSaturation: '96',
                weight: '82',
                height: '180',
                notes: 'Patient reports mild chest discomfort.'
              },
              { 
                id: 3,
                date: '2025-08-31T08:30:00',
                temperature: '98.8',
                heartRate: '75',
                bloodPressure: '132/85',
                respiratoryRate: '17',
                oxygenSaturation: '98',
                weight: '82',
                height: '180',
                notes: 'Vitals within normal range.'
              }
            ],
            medications: [
              {
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                startDate: '2025-08-28',
                instructions: 'Take in the morning with food'
              },
              {
                name: 'Aspirin',
                dosage: '81mg',
                frequency: 'Once daily',
                startDate: '2025-08-28',
                instructions: 'Take with food'
              },
              {
                name: 'Atorvastatin',
                dosage: '20mg',
                frequency: 'Once daily',
                startDate: '2025-08-28',
                instructions: 'Take in the evening'
              }
            ],
            notes: [
              {
                id: 1,
                date: '2025-09-01T09:15:00',
                author: 'Nurse Johnson',
                type: 'Observation',
                content: 'Patient complains of mild chest pain when breathing deeply. Notified Dr. Smith.'
              },
              {
                id: 2,
                date: '2025-08-31T14:30:00',
                author: 'Dr. Smith',
                type: 'Assessment',
                content: 'ECG shows normal sinus rhythm. Continue monitoring.'
              },
              {
                id: 3,
                date: '2025-08-30T10:45:00',
                author: 'Nurse Williams',
                type: 'Medication',
                content: 'Patient experienced slight dizziness after morning medications. Vitals normal, continued observation recommended.'
              }
            ],
            appointments: [
              {
                id: 1,
                date: '2025-09-02T11:00:00',
                type: 'ECG',
                provider: 'Cardiology Lab',
                status: 'Scheduled'
              },
              {
                id: 2,
                date: '2025-09-03T10:30:00',
                type: 'Consultation',
                provider: 'Dr. Smith',
                status: 'Scheduled'
              }
            ]
          },
          '4': {
            id: '4',
            mrn: 'MRN12348',
            first_name: 'Maria',
            last_name: 'Garcia',
            dob: '1985-08-12',
            gender: 'Female',
            department: 'Cardiology',
            attending_doctor: 'Dr. Smith',
            phone: '(555) 123-9876',
            email: 'maria.garcia@example.com',
            address: '890 Elm St, Springfield, IL',
            insurance: 'United Healthcare',
            room: '208-B',
            admitDate: '2025-08-30',
            status: 'Stable',
            allergies: ['Latex', 'Sulfa drugs'],
            medical_conditions: ['Arrhythmia', 'Diabetes Type 2'],
            vitals: [
              { 
                id: 1,
                date: '2025-09-01T09:15:00',
                temperature: '98.2',
                heartRate: '72',
                bloodPressure: '118/75',
                respiratoryRate: '14',
                oxygenSaturation: '98',
                weight: '65',
                height: '165',
                notes: 'Patient feels well.'
              },
              { 
                id: 2,
                date: '2025-08-31T09:30:00',
                temperature: '98.4',
                heartRate: '75',
                bloodPressure: '120/78',
                respiratoryRate: '16',
                oxygenSaturation: '97',
                weight: '65',
                height: '165',
                notes: 'Blood sugar level: 110 mg/dL'
              }
            ],
            medications: [
              {
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice daily',
                startDate: '2025-08-30',
                instructions: 'Take with meals'
              },
              {
                name: 'Amiodarone',
                dosage: '200mg',
                frequency: 'Once daily',
                startDate: '2025-08-30',
                instructions: 'Take in the morning'
              }
            ],
            notes: [
              {
                id: 1,
                date: '2025-09-01T10:00:00',
                author: 'Nurse Adams',
                type: 'Observation',
                content: 'Patient reports improved energy levels today.'
              },
              {
                id: 2,
                date: '2025-08-31T11:15:00',
                author: 'Dr. Smith',
                type: 'Assessment',
                content: 'Arrhythmia appears controlled. Monitor blood glucose levels.'
              }
            ],
            appointments: [
              {
                id: 1,
                date: '2025-09-02T14:30:00',
                type: 'Blood Work',
                provider: 'Lab',
                status: 'Scheduled'
              }
            ]
          },
          '2': {
            id: '2',
            mrn: 'MRN12346',
            first_name: 'Jane',
            last_name: 'Smith',
            dob: '1975-11-08',
            gender: 'Female',
            department: 'Neurology',
            attending_doctor: 'Dr. Johnson',
            phone: '(555) 456-7890',
            email: 'jane.smith@example.com',
            address: '789 Oak St, Riverdale, NY',
            insurance: 'Aetna',
            room: '310-A',
            admitDate: '2025-08-29',
            status: 'Stable',
            allergies: ['Codeine'],
            medical_conditions: ['Migraine', 'Anxiety'],
            vitals: [
              { 
                id: 1,
                date: '2025-09-01T08:45:00',
                temperature: '98.4',
                heartRate: '68',
                bloodPressure: '115/75',
                respiratoryRate: '14',
                oxygenSaturation: '99',
                weight: '60',
                height: '162',
                notes: 'No headache reported today.'
              }
            ],
            medications: [
              {
                name: 'Sumatriptan',
                dosage: '50mg',
                frequency: 'As needed',
                startDate: '2025-08-29',
                instructions: 'Take at onset of migraine'
              },
              {
                name: 'Propranolol',
                dosage: '40mg',
                frequency: 'Once daily',
                startDate: '2025-08-29',
                instructions: 'Take in the morning'
              }
            ],
            notes: [
              {
                id: 1,
                date: '2025-09-01T09:30:00',
                author: 'Nurse Thompson',
                type: 'Observation',
                content: 'Patient slept well. No migraine symptoms in the past 24 hours.'
              }
            ],
            appointments: [
              {
                id: 1,
                date: '2025-09-03T09:00:00',
                type: 'MRI',
                provider: 'Radiology',
                status: 'Scheduled'
              }
            ]
          }
        };
        
        const selectedPatient = mockPatients[patientId];
        
        if (!selectedPatient) {
          setError(`Patient with ID ${patientId} not found`);
          return;
        }
        
        // Check if patient is in the current department
        if (selectedPatient.department !== currentDepartment) {
          setError(`You don't have access to this patient's information. This patient belongs to ${selectedPatient.department} department.`);
          return;
        }
        
        // Normalize mock patient to ensure arrays exist and notes_history is populated
        setPatient({
          ...selectedPatient,
          vitals: Array.isArray(selectedPatient.vitals) ? selectedPatient.vitals : [],
          medications: Array.isArray(selectedPatient.medications) ? selectedPatient.medications : [],
          notes_history: Array.isArray(selectedPatient.notes_history)
            ? selectedPatient.notes_history
            : (Array.isArray(selectedPatient.notes) ? selectedPatient.notes : [])
        });
        
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, [patientId, currentDepartment]);
  
  const handleGoBack = () => {
    navigate('/nurse/patients');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };
  
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleOpenVitalsModal = () => {
    setIsAddVitalsModalOpen(true);
    setVitalsData({
      temperature: '',
      heartRate: '',
      bloodPressure: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      weight: patient?.vitals?.[0]?.weight || '',
      height: patient?.vitals?.[0]?.height || '',
      notes: ''
    });
  };
  
  const handleCloseVitalsModal = () => {
    setIsAddVitalsModalOpen(false);
  };
  
  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitVitals = (e) => {
    e.preventDefault();
    const updated = appendVitals(patient.id, vitalsData) || patient;
    setPatient(updated);
    handleCloseVitalsModal();
  };

  const handleOpenNoteModal = () => {
    setIsAddNoteModalOpen(true);
    setNoteData({
      content: '',
      type: 'Observation'
    });
  };
  
  const handleCloseNoteModal = () => {
    setIsAddNoteModalOpen(false);
  };
  
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNoteData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitNote = (e) => {
    e.preventDefault();
    const updated = addNote(patient.id, { author: 'Nurse', ...noteData }) || patient;
    setPatient(updated);
    handleCloseNoteModal();
  };

  const handleOpenMedicationModal = () => {
    setIsAddMedicationOpen(true);
    setMedData({ name: '', dosage: '', frequency: '', startDate: '', instructions: '', addedBy: 'Nurse' });
  };
  const handleCloseMedicationModal = () => setIsAddMedicationOpen(false);
  const handleMedChange = (e) => {
    const { name, value } = e.target;
    setMedData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitMedication = (e) => {
    e.preventDefault();
    const updated = addMedication(patient.id, medData) || patient;
    setPatient(updated);
    handleCloseMedicationModal();
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={handleGoBack}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Go Back to Patients
        </button>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="p-4 bg-yellow-50 rounded-md">
        <p className="text-yellow-700">Patient not found.</p>
        <button 
          onClick={handleGoBack}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Go Back to Patients
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Patient header */}
      <div className="mb-6">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="sr-only">Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{patient.first_name} {patient.last_name}</h1>
            <div className="flex flex-wrap items-center mt-1">
              <p className="text-sm text-gray-500 mr-2">{patient.mrn}</p>
              <span className="mr-2">•</span>
              <p className="text-sm text-gray-500 mr-2">
                {patient.gender}, {calculateAge(patient.dob)} years
              </p>
              <span className="mr-2">•</span>
              <p className="text-sm text-gray-500">Room {patient.room}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={handleOpenVitalsModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Record Vitals
          </button>
          <button
            onClick={handleOpenNoteModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Note
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`${
              activeTab === 'vitals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Vitals History
          </button>
          <button
            onClick={() => setActiveTab('medications')}
            className={`${
              activeTab === 'medications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Medications
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Notes
          </button>
        </nav>
      </div>
      
      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Patient summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Patient Information
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.first_name} {patient.last_name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {formatDate(patient.dob)} ({calculateAge(patient.dob)} years)
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">MRN</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.mrn}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.gender}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.address}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.phone}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.email}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {patient.insurance}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Medical Information
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {patient.department}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Attending Doctor</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {patient.attending_doctor}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Room</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {patient.room}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Admit Date</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {formatDate(patient.admitDate)}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                          patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Allergies & Conditions
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies?.map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {allergy}
                        </span>
                      ))}
                      {(!patient.allergies || patient.allergies.length === 0) && (
                        <span className="text-sm text-gray-500">No known allergies</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Medical Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.medical_conditions?.map((condition, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {condition}
                        </span>
                      ))}
                      {(!patient.medical_conditions || patient.medical_conditions.length === 0) && (
                        <span className="text-sm text-gray-500">No medical conditions recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest vitals */}
          {patient.vitals && patient.vitals.length > 0 && (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Latest Vitals
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {formatDateTime(patient.vitals[0].date)}
                  </p>
                </div>
                <button
                  onClick={handleOpenVitalsModal}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Record New
                </button>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Temperature</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{patient.vitals[0].temperature}°F</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Heart Rate</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{patient.vitals[0].heartRate} BPM</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Pressure</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{patient.vitals[0].bloodPressure} mmHg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Respiratory Rate</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{patient.vitals[0].respiratoryRate} br/min</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Oxygen Saturation</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{patient.vitals[0].oxygenSaturation}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weight</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{patient.vitals[0].weight} kg</p>
                  </div>
                </div>
                {patient.vitals[0].notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.vitals[0].notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming appointments */}
          {patient.appointments && patient.appointments.length > 0 && (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upcoming Appointments
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {patient.appointments.map(appointment => (
                    <li key={appointment.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.type} with {appointment.provider}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDateTime(appointment.date)}
                            </div>
                          </div>
                        </div>
                        <div className="ml-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Vitals History Tab Content */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Vitals History</h3>
            <button
              onClick={handleOpenVitalsModal}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Record New Vitals
            </button>
          </div>
          
          {patient.vitals && patient.vitals.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heart Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resp Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      O₂ Sat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.vitals.map((vital) => (
                    <tr key={vital.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(vital.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.temperature}°F
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.heartRate} BPM
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.bloodPressure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.respiratoryRate}/min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.oxygenSaturation}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {vital.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
              <p className="text-gray-500">No vitals history recorded.</p>
              <button
                onClick={handleOpenVitalsModal}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Record First Vitals
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Medications Tab Content */}
      {activeTab === 'medications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Current Medications</h3>
          </div>
          
          {/* Doctor-added current medications */}
          {patient.medications && patient.medications.filter(m => m.addedBy !== 'Nurse').length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.medications.filter(m => m.addedBy !== 'Nurse').map((med) => (
                    <tr key={med.id || med.name + med.startDate}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(med.startDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.addedBy || 'Doctor'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
              <p className="text-gray-500">No current doctor-added medications.</p>
            </div>
          )}

          {/* Past Medications added by Nurse */}
          <div>
            <h4 className="text-md font-medium text-gray-900">Past Medications (history, added by Nurse)</h4>
            {patient.medications && patient.medications.filter(m => m.addedBy === 'Nurse').length > 0 ? (
              <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patient.medications.filter(m => m.addedBy === 'Nurse').map((med) => (
                      <tr key={med.id || med.name + med.startDate}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(med.startDate)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No past medications added by nurse.</p>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={handleOpenMedicationModal}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Medication (past history)
            </button>
          </div>
          
          {/* Allergies Section */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Allergies
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex flex-wrap gap-2">
                {patient.allergies?.map((allergy, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                    {allergy}
                  </span>
                ))}
                {(!patient.allergies || patient.allergies.length === 0) && (
                  <span className="text-gray-500">No known allergies</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Patient Notes</h3>
            <button
              onClick={handleOpenNoteModal}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Note
            </button>
          </div>
          
          {patient.notes_history && patient.notes_history.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {patient.notes_history.map((note) => (
                  <li key={note.id} className="px-4 py-5 sm:px-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {(note.author || 'U').split(' ')[0]?.[0] || 'U'}
                          {note.author?.split(' ')[1] ? note.author.split(' ')[1][0] : ''}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{note.author || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(note.date)}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            note.type === 'Observation' ? 'bg-blue-100 text-blue-800' : 
                            note.type === 'Assessment' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {note.type}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                          {note.content}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
              <p className="text-gray-500">No notes recorded for this patient.</p>
              <button
                onClick={handleOpenNoteModal}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add First Note
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Add Vitals Modal */}
      <Modal open={isAddVitalsModalOpen} onClose={handleCloseVitalsModal} title={`Record Vitals for ${patient?.first_name} ${patient?.last_name}`} size="xl">
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                MRN: {patient?.mrn} | DOB: {formatDate(patient?.dob)}
              </p>
            </div>

            <form onSubmit={handleSubmitVitals} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                    Temperature (°F)*
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    id="temperature"
                    required
                    value={vitalsData.temperature}
                    onChange={handleVitalsChange}
                    placeholder="98.6"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                    Heart Rate (BPM)*
                  </label>
                  <input
                    type="text"
                    name="heartRate"
                    id="heartRate"
                    required
                    value={vitalsData.heartRate}
                    onChange={handleVitalsChange}
                    placeholder="75"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
                    Blood Pressure (mmHg)*
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    id="bloodPressure"
                    required
                    value={vitalsData.bloodPressure}
                    onChange={handleVitalsChange}
                    placeholder="120/80"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
                    Respiratory Rate (breaths/min)*
                  </label>
                  <input
                    type="text"
                    name="respiratoryRate"
                    id="respiratoryRate"
                    required
                    value={vitalsData.respiratoryRate}
                    onChange={handleVitalsChange}
                    placeholder="16"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
                    Oxygen Saturation (%)*
                  </label>
                  <input
                    type="text"
                    name="oxygenSaturation"
                    id="oxygenSaturation"
                    required
                    value={vitalsData.oxygenSaturation}
                    onChange={handleVitalsChange}
                    placeholder="98"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    value={vitalsData.weight}
                    onChange={handleVitalsChange}
                    placeholder="70"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    name="height"
                    id="height"
                    value={vitalsData.height}
                    onChange={handleVitalsChange}
                    placeholder="175"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows="3"
                  value={vitalsData.notes}
                  onChange={handleVitalsChange}
                  placeholder="Additional observations..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseVitalsModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Record Vitals
                </button>
              </div>
            </form>
      </Modal>

      {/* Add Medication Modal */}
      <Modal open={isAddMedicationOpen} onClose={handleCloseMedicationModal} title={`Add Medication for ${patient?.first_name} ${patient?.last_name}`} size="lg">
        <form onSubmit={handleSubmitMedication} className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Medication Name</label>
            <input type="text" id="name" name="name" value={medData.name} onChange={handleMedChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
            <input type="text" id="dosage" name="dosage" value={medData.dosage} onChange={handleMedChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
            <input type="text" id="frequency" name="frequency" value={medData.frequency} onChange={handleMedChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="startDate" name="startDate" value={medData.startDate} onChange={handleMedChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea id="instructions" name="instructions" value={medData.instructions} onChange={handleMedChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2 flex justify-end space-x-3">
            <button type="button" onClick={handleCloseMedicationModal} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Save Medication</button>
          </div>
        </form>
      </Modal>
      
      {/* Add Note Modal */}
      <Modal open={isAddNoteModalOpen} onClose={handleCloseNoteModal} title={`Add Note for ${patient?.first_name} ${patient?.last_name}`} size="lg">
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                MRN: {patient?.mrn} | DOB: {formatDate(patient?.dob)}
              </p>
            </div>

            <form onSubmit={handleSubmitNote} className="mt-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Note Type*
                </label>
                <select
                  name="type"
                  id="type"
                  required
                  value={noteData.type}
                  onChange={handleNoteChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Observation">Observation</option>
                  <option value="Medication">Medication</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mt-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Note Content*
                </label>
                <textarea
                  name="content"
                  id="content"
                  rows="5"
                  required
                  value={noteData.content}
                  onChange={handleNoteChange}
                  placeholder="Enter your observations, findings, or other relevant information..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseNoteModal}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Note
                </button>
              </div>
            </form>
      </Modal>
    </div>
  );
}
