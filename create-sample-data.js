// Test script to add sample patients to the database
const API_BASE_URL = 'http://localhost:3002/api/v1';

async function createSamplePatients() {
  const patients = [
    {
      first_name: 'Gowthamaraj',
      last_name: 'M S',
      dob: '1995-01-15',
      gender: 'Male',
      mrn: 'MRN12345',
      email: 'gowthamaraj@example.com',
      phone: '555-123-4567',
      address: '123 Main St, Anytown, CA',
      department_id: 'oncology', // Matches your frontend department
      attending_doctor: 'Dr. Dhaya',
      medical_conditions: ['Regular checkup'],
      allergies: [],
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-987-6543',
      room: '101-A'
    },
    {
      first_name: 'Dhaya',
      last_name: 'E',
      dob: '1990-08-12',
      gender: 'Male',
      mrn: 'MRN12345',
      email: 'dhaya@example.com',
      phone: '555-234-5678',
      address: '456 Oak St, Springfield, IL',
      department_id: 'oncology',
      attending_doctor: 'Dr. Smith',
      medical_conditions: ['Routine examination'],
      allergies: ['Latex'],
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-876-5432',
      room: '102-B'
    },
    {
      first_name: 'Gowthamaraj',
      last_name: 'Doe',
      dob: '1985-03-22',
      gender: 'Male',
      mrn: 'MRN13345',
      email: 'gowthamaraj.doe@example.com',
      phone: '555-345-6789',
      address: '789 Pine St, Westfield, MA',
      department_id: 'oncology',
      attending_doctor: 'Dr. Raj',
      medical_conditions: ['Follow-up appointment'],
      allergies: [],
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-765-4321',
      room: '103-C'
    },
    {
      first_name: 'Gowthamaraj',
      last_name: 'M S',
      dob: '1992-11-08',
      gender: 'Male',
      mrn: 'MRN12348',
      email: 'gowthamaraj.ms@example.com',
      phone: '555-456-7890',
      address: '321 Elm St, Riverside, CA',
      department_id: 'oncology',
      attending_doctor: 'Dr. Dhaya',
      medical_conditions: ['Consultation'],
      allergies: [],
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-654-3210',
      room: '104-D'
    },
    {
      first_name: 'Admin',
      last_name: 'E',
      dob: '1988-07-25',
      gender: 'Male',
      mrn: 'MRN12345',
      email: 'admin@example.com',
      phone: '555-567-8901',
      address: '654 Maple St, Brookfield, WI',
      department_id: 'oncology',
      attending_doctor: 'Dr. Raj',
      medical_conditions: ['Annual physical'],
      allergies: ['Shellfish'],
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-543-2109',
      room: '105-E'
    },
    {
      first_name: 'Kavi',
      last_name: 'V',
      dob: '1975-12-03',
      gender: 'Male',
      mrn: 'MRN12348',
      email: 'kavi@example.com',
      phone: '555-678-9012',
      address: '987 Cedar St, Fairfield, OH',
      department_id: 'oncology',
      attending_doctor: 'Dr. Dhaya',
      medical_conditions: ['Preventive care'],
      allergies: [],
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '555-432-1098',
      room: '106-F'
    }
  ];

  for (const patientData of patients) {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`Created patient: ${patientData.first_name} ${patientData.last_name}`, result);
      } else {
        const error = await response.json();
        console.error(`Failed to create patient ${patientData.first_name} ${patientData.last_name}:`, error);
      }
    } catch (error) {
      console.error(`Error creating patient ${patientData.first_name} ${patientData.last_name}:`, error);
    }
  }
}

// Call the function
createSamplePatients().then(() => {
  console.log('Finished creating sample patients');
}).catch(error => {
  console.error('Error in sample creation:', error);
});
