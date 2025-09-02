// Quick test to verify the patient update validation fix
const API_BASE_URL = 'http://localhost:3002';
const TEST_PATIENT_ID = 'be7e7a9c-c4d2-46ef-b34b-ee817a0806ca'; // Bob Wilson

async function testPatientUpdateValidation() {
  console.log('🧪 Testing Patient Update Validation Fix...');
  
  try {
    // 1. Get patient data
    console.log('📋 Fetching patient data...');
    const response = await fetch(`${API_BASE_URL}/patients/${TEST_PATIENT_ID}`);
    const patient = await response.json();
    console.log('✅ Patient data retrieved:', { name: `${patient.first_name} ${patient.last_name}`, department: patient.department });
    
    // 2. Test with the OLD way (should fail) - includes disallowed fields
    console.log('\n❌ Testing with DISALLOWED fields (should fail):');
    const badData = {
      first_name: patient.first_name,
      last_name: patient.last_name,
      phone: '555-UPDATED',
      // These fields should cause validation errors:
      emergency_contact_name: 'Test Contact',
      emergency_contact_phone: '555-EMERGENCY',  
      emergency_contact_relation: 'Spouse',
      blood_type: 'O+',
      bed: 'A-101'
    };
    
    const badResponse = await fetch(`${API_BASE_URL}/patients/${TEST_PATIENT_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(badData)
    });
    
    if (!badResponse.ok) {
      const errorText = await badResponse.text();
      console.log('❌ Expected validation error:', errorText);
    } else {
      console.log('⚠️ Unexpected: Bad request succeeded');
    }
    
    // 3. Test with the NEW way (should succeed) - only allowed fields
    console.log('\n✅ Testing with ALLOWED fields only (should succeed):');
    const goodData = {
      first_name: patient.first_name,
      last_name: patient.last_name,
      mrn: patient.mrn,
      dob: patient.dob,
      gender: patient.gender,
      phone: '555-FIXED-UPDATE',
      email: patient.email,
      address: patient.address,
      department: patient.department,
      attending_doctor: patient.attending_doctor,
      room: patient.room,
      medical_conditions: patient.medical_conditions,
      allergies: patient.allergies,
      last_admission: patient.last_admission,
      last_visit: patient.last_visit,
      status: patient.status,
      notes: patient.notes
    };
    
    const goodResponse = await fetch(`${API_BASE_URL}/patients/${TEST_PATIENT_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goodData)
    });
    
    if (goodResponse.ok) {
      const updatedPatient = await goodResponse.json();
      console.log('✅ Update successful! Phone updated to:', updatedPatient.phone);
      
      // Revert the change
      const revertData = { ...goodData, phone: patient.phone };
      await fetch(`${API_BASE_URL}/patients/${TEST_PATIENT_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revertData)
      });
      console.log('🔄 Reverted phone back to original value');
      
    } else {
      const errorText = await goodResponse.text();
      console.log('❌ Unexpected: Good request failed:', errorText);
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('💥 Test error:', error);
  }
}

// Run the test
testPatientUpdateValidation();
