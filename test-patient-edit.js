// Test script to verify patient editing functionality
const API_BASE_URL = 'http://localhost:3002';

async function testPatientEdit() {
  console.log('🧪 Testing patient edit functionality...');
  
  try {
    // First, get a list of patients
    const patientsResponse = await fetch(`${API_BASE_URL}/patients`);
    const patientsData = await patientsResponse.json();
    
    console.log(`📊 Found ${patientsData.patients.length} patients`);
    
    if (patientsData.patients.length === 0) {
      console.log('❌ No patients found to test with');
      return;
    }
    
    // Get the first patient's full details
    const testPatientId = patientsData.patients[0].id;
    console.log(`🔍 Testing with patient ID: ${testPatientId}`);
    
    const patientResponse = await fetch(`${API_BASE_URL}/patients/${testPatientId}`);
    const patientData = await patientResponse.json();
    
    console.log('📋 Original patient data:', JSON.stringify(patientData, null, 2));
    
    // Simulate the field filtering that we implemented in the frontend
    const allowedFields = [
      'first_name', 'last_name', 'mrn', 'dob', 'gender', 'phone', 'email', 
      'address', 'department', 'attending_doctor', 'room', 'medical_conditions', 
      'allergies', 'blood_type', 'admission_date', 'last_admission', 'last_visit', 
      'discharge_date', 'status', 'admission_type', 'notes', 'insurance', 
      'insurance_id', 'emergency_contact_name', 'emergency_contact_phone', 
      'emergency_contact_relation', 'risk_score', 'risk_level', 'prediction_factors'
    ];
    
    // Filter the patient data to only include allowed fields
    const filteredPatientData = {};
    allowedFields.forEach(field => {
      if (Object.hasOwn(patientData, field)) {
        filteredPatientData[field] = patientData[field];
      }
    });
    
    // Make a small modification to test the update
    filteredPatientData.phone = '555-TEST-EDIT';
    
    console.log('🔄 Filtered patient data for update:', JSON.stringify(filteredPatientData, null, 2));
    
    // Try to update the patient
    const updateResponse = await fetch(`${API_BASE_URL}/patients/${testPatientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filteredPatientData)
    });
    
    if (updateResponse.ok) {
      const updatedPatient = await updateResponse.json();
      console.log('✅ Patient update successful!');
      console.log('📱 Updated phone number:', updatedPatient.phone);
      
      // Revert the change
      filteredPatientData.phone = patientData.phone;
      const revertResponse = await fetch(`${API_BASE_URL}/patients/${testPatientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filteredPatientData)
      });
      
      if (revertResponse.ok) {
        console.log('🔄 Successfully reverted test change');
      }
    } else {
      const errorData = await updateResponse.text();
      console.log('❌ Patient update failed:', errorData);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error);
  }
}

// Run the test
testPatientEdit();
