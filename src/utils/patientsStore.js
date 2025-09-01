// Simple localStorage-backed patients store for demo purposes
// Provides get/add/update helpers and initializes with sample data

const STORAGE_KEY = 'relayloop_patients_v1';

function load()
{
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function seedData() {
  const seed = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      dob: '1980-05-15',
      gender: 'Male',
      mrn: 'MRN12345',
      last_admission: '2023-07-20',
      attending_doctor: 'Dr. Smith',
      department: 'Cardiology',
      email: 'john.doe@example.com',
      phone: '(555) 987-6543',
      address: '123 Main St, Anytown, CA',
      medical_conditions: ['Coronary Artery Disease', 'Hypertension'],
      last_visit: '2023-08-20',
      notes: 'Patient reports chest pain during physical activity.',
      insurance: 'Blue Cross Blue Shield',
      room: '205-A',
      vitals: [],
      medications: [],
      notes_history: []
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      dob: '1975-11-08',
      gender: 'Female',
      mrn: 'MRN12346',
      last_admission: '2023-08-05',
      attending_doctor: 'Dr. Johnson',
      department: 'Neurology',
      email: 'jane.smith@example.com',
      phone: '(555) 456-7890',
      address: '789 Oak St, Riverdale, NY',
      medical_conditions: ['Migraine', 'Anxiety'],
      last_visit: '2023-07-25',
      notes: 'Patient reports reduced frequency of migraines with new medication.',
      insurance: 'Aetna',
      room: '310-A',
      vitals: [],
      medications: [],
      notes_history: []
    },
    {
      id: '3',
      first_name: 'Robert',
      last_name: 'Williams',
      dob: '1990-03-22',
      gender: 'Male',
      mrn: 'MRN12347',
      last_admission: '2023-08-15',
      attending_doctor: 'Dr. Davis',
      department: 'General Medicine',
      email: 'robert.williams@example.com',
      phone: '(555) 234-5678',
      address: '567 Pine St, Westfield, MA',
      medical_conditions: ['Seasonal Allergies'],
      last_visit: '2023-08-10',
      notes: 'Annual check-up completed.',
      insurance: 'Medicare',
      room: '102-B',
      vitals: [],
      medications: [],
      notes_history: []
    },
    {
      id: '4',
      first_name: 'Maria',
      last_name: 'Garcia',
      dob: '1985-08-12',
      gender: 'Female',
      mrn: 'MRN12348',
      last_admission: '2023-09-01',
      attending_doctor: 'Dr. Smith',
      department: 'Cardiology',
      email: 'maria.garcia@example.com',
      phone: '(555) 123-9876',
      address: '890 Elm St, Springfield, IL',
      medical_conditions: ['Arrhythmia', 'Diabetes Type 2'],
      last_visit: '2023-09-01',
      notes: 'Follow-up on arrhythmia medication efficacy.',
      insurance: 'United Healthcare',
      room: '208-B',
      vitals: [],
      medications: [],
      notes_history: []
    }
  ];
  save(seed);
  return seed;
}

function ensure()
{
  let data = load();
  if (!data || !Array.isArray(data)) {
    data = seedData();
  }
  // Normalize records to ensure expected arrays exist
  let mutated = false;
  const normalized = data.map((p) => {
    const np = { ...p };
    if (!Array.isArray(np.vitals)) { np.vitals = []; mutated = true; }
    if (!Array.isArray(np.medications)) { np.medications = []; mutated = true; }
    if (!Array.isArray(np.notes_history)) { np.notes_history = []; mutated = true; }
    if (typeof np.room !== 'string') { np.room = ''; mutated = true; }
    return np;
  });
  if (mutated) save(normalized);
  return mutated ? normalized : data;
}

export function getAllPatients() {
  return ensure();
}

export function getPatientsByDepartment(dept) {
  return ensure().filter(p => p.department === dept);
}

export function getPatientById(id) {
  return ensure().find(p => String(p.id) === String(id));
}

export function addPatient(patient) {
  const data = ensure();
  const id = String(Date.now());
  const record = {
    id,
    vitals: [],
    medications: [],
    notes_history: [],
    room: '',
    ...patient,
  };
  data.push(record);
  save(data);
  return record;
}

export function updatePatient(id, updates) {
  const data = ensure();
  const idx = data.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  const updated = { ...data[idx], ...updates, id: String(id) };
  data[idx] = updated;
  save(data);
  return updated;
}

// Append a vitals entry (latest first)
export function appendVitals(id, vitalsEntry) {
  const data = ensure();
  const idx = data.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  const entry = {
    id: String(Date.now()),
    date: new Date().toISOString(),
    ...vitalsEntry,
  };
  const updated = { ...data[idx], vitals: [entry, ...(data[idx].vitals || [])] };
  data[idx] = updated;
  save(data);
  return updated;
}

// Add a note entry
export function addNote(id, noteEntry) {
  const data = ensure();
  const idx = data.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  const entry = {
    id: String(Date.now()),
    date: new Date().toISOString(),
    ...noteEntry,
  };
  const updated = { ...data[idx], notes_history: [entry, ...(data[idx].notes_history || [])] };
  data[idx] = updated;
  save(data);
  return updated;
}

// Add a medication entry
export function addMedication(id, medEntry) {
  const data = ensure();
  const idx = data.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  const entry = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    ...medEntry,
  };
  const meds = Array.isArray(data[idx].medications) ? data[idx].medications : [];
  const updated = { ...data[idx], medications: [...meds, entry] };
  data[idx] = updated;
  save(data);
  return updated;
}
