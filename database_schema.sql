-- ==================================================
-- RelayLoop Hospital Management System
-- Complete Database Schema for Supabase
-- ==================================================
-- This schema perfectly matches your frontend components 
-- and backend API requirements
-- ==================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================================================
-- DROP EXISTING TABLES (if they exist)
-- ==================================================

-- Drop tables in reverse dependency order to avoid foreign key conflicts
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS lab_results CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS medication_administrations CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS patient_notes CASCADE;
DROP TABLE IF EXISTS vital_signs CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS department_stats CASCADE;
DROP VIEW IF EXISTS patient_summary CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS create_audit_log() CASCADE;
DROP FUNCTION IF EXISTS auto_calculate_bmi() CASCADE;
DROP FUNCTION IF EXISTS calculate_bmi(DECIMAL, DECIMAL) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ==================================================
-- 1. USERS & AUTHENTICATION
-- ==================================================

-- User profiles table for role and department management
-- This extends Supabase auth.users with hospital-specific data
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse')),
    department VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT user_department_required_for_staff 
        CHECK (role = 'admin' OR department IS NOT NULL)
);

-- ==================================================
-- 2. HOSPITAL DEPARTMENTS
-- ==================================================

-- Departments table for standardized department management
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    head_doctor VARCHAR(100),
    total_beds INTEGER DEFAULT 0,
    occupied_beds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert standard departments to match your frontend
INSERT INTO departments (name, code, description, head_doctor, total_beds) VALUES
('Cardiology', 'CARD', 'Heart and cardiovascular system care', 'Dr. Sarah Wilson', 50),
('Neurology', 'NEUR', 'Brain and nervous system care', 'Dr. Michael Johnson', 40),
('General Medicine', 'GMED', 'General medical care and internal medicine', 'Dr. Emily Davis', 80),
('Pediatrics', 'PEDS', 'Children''s healthcare', 'Dr. David Lee', 30),
('Oncology', 'ONCO', 'Cancer treatment and care', 'Dr. Jennifer Brown', 35);

-- ==================================================
-- 3. PATIENTS - Core Entity
-- ==================================================

CREATE TABLE patients (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(20) NOT NULL UNIQUE, -- Medical Record Number
    
    -- Personal information (matches your frontend forms)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    
    -- Hospital assignment
    department VARCHAR(100) NOT NULL,
    attending_doctor VARCHAR(100) NOT NULL,
    room VARCHAR(20),
    bed VARCHAR(20),
    
    -- Contact information
    phone VARCHAR(15),
    email VARCHAR(255),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relation VARCHAR(50),
    
    -- Insurance and billing
    insurance VARCHAR(100),
    insurance_id VARCHAR(50),
    
    -- Medical information
    medical_conditions TEXT[] DEFAULT '{}', -- Array of conditions
    allergies TEXT[] DEFAULT '{}',          -- Array of allergies
    blood_type VARCHAR(5),
    
    -- Admission details
    admission_date DATE,
    last_admission DATE,
    last_visit DATE,
    discharge_date DATE,
    
    -- Status and notes
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Discharged', 'Transferred', 'Deceased')),
    admission_type VARCHAR(50) DEFAULT 'Regular' CHECK (admission_type IN ('Emergency', 'Regular', 'Scheduled', 'Transfer')),
    notes TEXT,
    
    -- Risk assessment (for admin analytics)
    risk_score DECIMAL(5,2),
    risk_level VARCHAR(20) CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    prediction_factors JSONB, -- Stores ML prediction data
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 4. VITAL SIGNS - Nurse Primary Responsibility
-- ==================================================

CREATE TABLE vital_signs (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Vital measurements (matches VitalSignsForm.jsx)
    temperature DECIMAL(4,1), -- Celsius (e.g., 37.2)
    heart_rate INTEGER, -- BPM
    blood_pressure_systolic INTEGER, -- mmHg
    blood_pressure_diastolic INTEGER, -- mmHg
    respiratory_rate INTEGER, -- Breaths per minute
    oxygen_saturation INTEGER, -- Percentage
    
    -- Additional measurements
    weight DECIMAL(5,2), -- kg
    height DECIMAL(5,2), -- cm
    bmi DECIMAL(4,1), -- Calculated BMI
    blood_glucose DECIMAL(5,1), -- mg/dL
    pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 10), -- 0-10 scale
    
    -- Context and notes
    notes TEXT,
    position VARCHAR(50), -- Patient position during measurement
    activity_level VARCHAR(50), -- Rest, Post-exercise, etc.
    
    -- Recording information
    recorded_by VARCHAR(100) NOT NULL, -- Nurse name/ID
    recorded_by_user_id UUID REFERENCES auth.users(id),
    device_used VARCHAR(100), -- Equipment used
    location VARCHAR(100), -- Where recorded (Room, ICU, etc.)
    
    -- Timestamps
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 5. PATIENT NOTES - Multi-user Collaboration
-- ==================================================

CREATE TABLE patient_notes (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Note content
    author VARCHAR(100) NOT NULL, -- Name of person writing note
    author_user_id UUID REFERENCES auth.users(id),
    author_role VARCHAR(20) CHECK (author_role IN ('admin', 'doctor', 'nurse')),
    
    -- Note classification (matches your frontend types)
    type VARCHAR(50) DEFAULT 'Observation' CHECK (type IN (
        'Observation',    -- Nurse observations
        'Assessment',     -- Doctor assessments
        'Medication',     -- Medication notes
        'Procedure',      -- Procedure notes
        'Discharge',      -- Discharge planning
        'General'         -- General notes
    )),
    
    title VARCHAR(200), -- Optional title for the note
    content TEXT NOT NULL,
    
    -- Metadata
    is_confidential BOOLEAN DEFAULT false, -- Restricted access
    is_critical BOOLEAN DEFAULT false,     -- Urgent/critical notes
    tags TEXT[], -- Searchable tags
    
    -- References
    related_vital_sign_id UUID REFERENCES vital_signs(id),
    related_medication_id UUID, -- Will reference medications table
    
    -- Timestamps
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 6. MEDICATIONS - Doctor Prescriptions & Nurse Administration
-- ==================================================

CREATE TABLE medications (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Medication details
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    brand_name VARCHAR(200),
    dosage VARCHAR(100) NOT NULL, -- e.g., "50mg", "10ml"
    unit VARCHAR(20), -- mg, ml, tablets, etc.
    
    -- Administration details
    frequency VARCHAR(100) NOT NULL, -- e.g., "Twice daily", "Every 6 hours"
    route VARCHAR(50) DEFAULT 'Oral', -- Oral, IV, IM, etc.
    instructions TEXT,
    
    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE,
    duration_days INTEGER,
    
    -- Prescription details
    prescribed_by VARCHAR(100) NOT NULL,
    prescribed_by_user_id UUID REFERENCES auth.users(id),
    prescription_date DATE DEFAULT CURRENT_DATE,
    
    -- Administration tracking
    last_administered_at TIMESTAMP WITH TIME ZONE,
    last_administered_by VARCHAR(100),
    next_due_at TIMESTAMP WITH TIME ZONE,
    total_doses_prescribed INTEGER,
    doses_administered INTEGER DEFAULT 0,
    
    -- Status and classification
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN (
        'Active',         -- Currently being administered
        'Paused',         -- Temporarily stopped
        'Completed',      -- Course completed
        'Discontinued',   -- Stopped by doctor
        'Expired'         -- Past end date
    )),
    
    category VARCHAR(50), -- Antibiotic, Painkiller, etc.
    added_by VARCHAR(100) DEFAULT 'Doctor',
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Critical')),
    
    -- Side effects and allergies
    known_side_effects TEXT[],
    contraindications TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 7. MEDICATION ADMINISTRATION LOG
-- ==================================================

CREATE TABLE medication_administrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Administration details
    administered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    administered_by VARCHAR(100) NOT NULL,
    administered_by_user_id UUID REFERENCES auth.users(id),
    
    -- Dose details
    dose_given VARCHAR(100) NOT NULL,
    route_used VARCHAR(50),
    
    -- Patient response
    patient_response TEXT,
    side_effects_observed TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
    
    -- Status
    status VARCHAR(50) DEFAULT 'Completed' CHECK (status IN (
        'Completed',
        'Partially_Given',
        'Refused',
        'Missed',
        'Delayed'
    )),
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 8. APPOINTMENTS & SCHEDULING
-- ==================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Appointment details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    
    -- Type and provider
    type VARCHAR(100) NOT NULL, -- Consultation, Lab Test, Procedure, etc.
    provider VARCHAR(100) NOT NULL, -- Doctor name or department
    provider_user_id UUID REFERENCES auth.users(id),
    department VARCHAR(100),
    location VARCHAR(100), -- Room or facility
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN (
        'Scheduled',
        'Confirmed',
        'In_Progress',
        'Completed',
        'Cancelled',
        'No_Show',
        'Rescheduled'
    )),
    
    -- Notes and instructions
    purpose TEXT,
    preparation_instructions TEXT,
    notes TEXT,
    
    -- Results (for completed appointments)
    results TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 9. LAB RESULTS & DIAGNOSTICS
-- ==================================================

CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    
    -- Test details
    test_name VARCHAR(200) NOT NULL,
    test_code VARCHAR(50),
    test_category VARCHAR(100), -- Blood, Urine, Imaging, etc.
    
    -- Results
    result_value VARCHAR(500),
    result_unit VARCHAR(50),
    reference_range VARCHAR(100),
    status VARCHAR(50) CHECK (status IN ('Normal', 'Abnormal', 'Critical', 'Pending')),
    
    -- Lab information
    lab_name VARCHAR(200),
    technician VARCHAR(100),
    reviewed_by VARCHAR(100), -- Doctor who reviewed
    reviewed_by_user_id UUID REFERENCES auth.users(id),
    
    -- Timestamps
    test_date DATE NOT NULL,
    result_date DATE,
    reviewed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 10. AUDIT LOG - For Admin Tracking
-- ==================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and action
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255),
    user_role VARCHAR(20),
    
    -- Action details
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW, etc.
    entity_type VARCHAR(50) NOT NULL, -- patient, vital_signs, medication, etc.
    entity_id UUID,
    
    -- Context
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Changes (for UPDATE actions)
    old_values JSONB,
    new_values JSONB,
    
    -- Metadata
    department VARCHAR(100),
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')),
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================

-- Patient indexes
CREATE INDEX idx_patients_department ON patients(department);
CREATE INDEX idx_patients_attending_doctor ON patients(attending_doctor);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_last_name ON patients(last_name);
CREATE INDEX idx_patients_admission_date ON patients(admission_date);

-- Vital signs indexes
CREATE INDEX idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX idx_vital_signs_recorded_at ON vital_signs(recorded_at DESC);
CREATE INDEX idx_vital_signs_recorded_by ON vital_signs(recorded_by);

-- Notes indexes
CREATE INDEX idx_patient_notes_patient_id ON patient_notes(patient_id);
CREATE INDEX idx_patient_notes_date ON patient_notes(date DESC);
CREATE INDEX idx_patient_notes_type ON patient_notes(type);
CREATE INDEX idx_patient_notes_author ON patient_notes(author);

-- Medication indexes
CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medications_start_date ON medications(start_date);
CREATE INDEX idx_medications_prescribed_by ON medications(prescribed_by);

-- Appointment indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_provider ON appointments(provider);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_administrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON user_profiles FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Patient Policies (Department-based access)
CREATE POLICY "Users can access patients in their department" 
ON patients FOR ALL 
USING (
    department IN (
        SELECT up.department FROM user_profiles up 
        WHERE up.id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM user_profiles up 
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

-- Vital Signs Policies
CREATE POLICY "Users can access vital signs for patients in their department" 
ON vital_signs FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

-- Patient Notes Policies
CREATE POLICY "Users can access notes for patients in their department" 
ON patient_notes FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

-- Medications Policies
CREATE POLICY "Users can access medications for patients in their department" 
ON medications FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

-- Medication Administration Policies
CREATE POLICY "Users can access medication administration for patients in their department" 
ON medication_administrations FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

-- Appointments Policies
CREATE POLICY "Users can access appointments for patients in their department" 
ON appointments FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

-- Lab Results Policies
CREATE POLICY "Users can access lab results for patients in their department" 
ON lab_results FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

-- Audit Logs Policies (Admin only)
CREATE POLICY "Only admins can access audit logs" 
ON audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ==================================================
-- FUNCTIONS AND TRIGGERS
-- ==================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_notes_updated_at 
    BEFORE UPDATE ON patient_notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at 
    BEFORE UPDATE ON medications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION calculate_bmi(height_cm DECIMAL, weight_kg DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF height_cm IS NULL OR weight_kg IS NULL OR height_cm = 0 THEN
        RETURN NULL;
    END IF;
    RETURN ROUND((weight_kg / POWER(height_cm / 100, 2))::DECIMAL, 1);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate BMI on vital signs
CREATE OR REPLACE FUNCTION auto_calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.height IS NOT NULL AND NEW.weight IS NOT NULL THEN
        NEW.bmi = calculate_bmi(NEW.height, NEW.weight);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_calculate_bmi
    BEFORE INSERT OR UPDATE ON vital_signs
    FOR EACH ROW EXECUTE FUNCTION auto_calculate_bmi();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    current_user_profile user_profiles%ROWTYPE;
BEGIN
    -- Get current user profile
    SELECT * INTO current_user_profile 
    FROM user_profiles 
    WHERE id = auth.uid();
    
    -- Insert audit log
    INSERT INTO audit_logs (
        user_id, 
        user_email, 
        user_role, 
        action, 
        entity_type, 
        entity_id,
        description,
        old_values,
        new_values,
        department
    ) VALUES (
        auth.uid(),
        current_user_profile.email,
        current_user_profile.role,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP || ' on ' || TG_TABLE_NAME,
        CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        current_user_profile.department
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_vital_signs
    AFTER INSERT OR UPDATE OR DELETE ON vital_signs
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_medications
    AFTER INSERT OR UPDATE OR DELETE ON medications
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ==================================================
-- SAMPLE DATA FOR TESTING
-- ==================================================

-- Insert sample user profiles (you'll need to create these users in Supabase Auth first)
-- These are examples - replace with actual user IDs from your auth.users table
/*
INSERT INTO user_profiles (id, email, role, department, first_name, last_name) VALUES
-- Replace these UUIDs with actual user IDs from auth.users
('00000000-0000-0000-0000-000000000001', 'admin@relayloop.com', 'admin', NULL, 'System', 'Administrator'),
('00000000-0000-0000-0000-000000000002', 'doctor.cardiology@relayloop.com', 'doctor', 'Cardiology', 'Sarah', 'Wilson'),
('00000000-0000-0000-0000-000000000003', 'nurse.cardiology@relayloop.com', 'nurse', 'Cardiology', 'Emily', 'Johnson'),
('00000000-0000-0000-0000-000000000004', 'doctor.neurology@relayloop.com', 'doctor', 'Neurology', 'Michael', 'Johnson'),
('00000000-0000-0000-0000-000000000005', 'nurse.neurology@relayloop.com', 'nurse', 'Neurology', 'Lisa', 'Brown');
*/

-- Sample patients (matching your frontend mock data)
INSERT INTO patients (
    mrn, first_name, last_name, dob, gender, department, attending_doctor,
    phone, email, address, insurance, room, medical_conditions, allergies,
    admission_date, status
) VALUES
('MRN12345', 'John', 'Doe', '1980-05-15', 'Male', 'Cardiology', 'Dr. Smith', 
 '(555) 987-6543', 'john.doe@example.com', '123 Main St, Anytown, CA', 
 'Blue Cross Blue Shield', '205-A', 
 ARRAY['Coronary Artery Disease', 'Hypertension'], ARRAY['Penicillin'],
 '2023-07-20', 'Active'),

('MRN12346', 'Jane', 'Smith', '1975-11-08', 'Female', 'Neurology', 'Dr. Johnson',
 '(555) 456-7890', 'jane.smith@example.com', '789 Oak St, Riverdale, NY',
 'Aetna', '310-A',
 ARRAY['Migraine', 'Anxiety'], ARRAY['Latex', 'Sulfa drugs'],
 '2023-08-05', 'Active'),

('MRN12347', 'Robert', 'Williams', '1990-03-22', 'Male', 'General Medicine', 'Dr. Davis',
 '(555) 234-5678', 'robert.williams@example.com', '567 Pine St, Westfield, MA',
 'Medicare', '102-B',
 ARRAY['Seasonal Allergies'], ARRAY[]::TEXT[],
 '2023-08-15', 'Active'),

('MRN12348', 'Maria', 'Garcia', '1985-08-12', 'Female', 'Cardiology', 'Dr. Smith',
 '(555) 123-9876', 'maria.garcia@example.com', '890 Elm St, Springfield, IL',
 'United Healthcare', '208-B',
 ARRAY['Arrhythmia', 'Diabetes Type 2'], ARRAY['Latex'],
 '2023-09-01', 'Active');

-- ==================================================
-- VIEWS FOR COMMON QUERIES
-- ==================================================

-- Patient summary view with latest vitals
CREATE VIEW patient_summary AS
SELECT 
    p.*,
    vs.recorded_at as last_vitals_date,
    vs.temperature as last_temperature,
    vs.heart_rate as last_heart_rate,
    vs.blood_pressure_systolic as last_bp_systolic,
    vs.blood_pressure_diastolic as last_bp_diastolic,
    vs.oxygen_saturation as last_oxygen_sat,
    COUNT(DISTINCT notes.id) as total_notes,
    COUNT(DISTINCT meds.id) as active_medications,
    COUNT(DISTINCT appts.id) as upcoming_appointments
FROM patients p
LEFT JOIN LATERAL (
    SELECT * FROM vital_signs 
    WHERE patient_id = p.id 
    ORDER BY recorded_at DESC 
    LIMIT 1
) vs ON true
LEFT JOIN patient_notes notes ON notes.patient_id = p.id
LEFT JOIN medications meds ON meds.patient_id = p.id AND meds.status = 'Active'
LEFT JOIN appointments appts ON appts.patient_id = p.id 
    AND appts.appointment_date >= CURRENT_DATE 
    AND appts.status IN ('Scheduled', 'Confirmed')
GROUP BY p.id, vs.recorded_at, vs.temperature, vs.heart_rate, 
         vs.blood_pressure_systolic, vs.blood_pressure_diastolic, vs.oxygen_saturation;

-- Department statistics view
CREATE VIEW department_stats AS
SELECT 
    d.name as department_name,
    d.code as department_code,
    COUNT(DISTINCT p.id) as total_patients,
    COUNT(DISTINCT CASE WHEN p.status = 'Active' THEN p.id END) as active_patients,
    COUNT(DISTINCT CASE WHEN p.admission_date >= CURRENT_DATE - INTERVAL '7 days' THEN p.id END) as recent_admissions,
    COUNT(DISTINCT vs.id) as total_vital_readings,
    COUNT(DISTINCT CASE WHEN vs.recorded_at >= CURRENT_DATE - INTERVAL '24 hours' THEN vs.id END) as recent_vitals,
    COUNT(DISTINCT up.id) as staff_count,
    d.total_beds,
    d.occupied_beds,
    ROUND((d.occupied_beds::DECIMAL / NULLIF(d.total_beds, 0) * 100), 1) as occupancy_rate
FROM departments d
LEFT JOIN patients p ON p.department = d.name
LEFT JOIN vital_signs vs ON vs.patient_id = p.id
LEFT JOIN user_profiles up ON up.department = d.name
GROUP BY d.id, d.name, d.code, d.total_beds, d.occupied_beds;

-- ==================================================
-- COMPLETION MESSAGE
-- ==================================================

-- Select final confirmation
SELECT 
    'RelayLoop Database Schema Installed Successfully!' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'user_profiles', 'departments', 'patients', 'vital_signs', 
        'patient_notes', 'medications', 'medication_administrations', 
        'appointments', 'lab_results', 'audit_logs'
    );
