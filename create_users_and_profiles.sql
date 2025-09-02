-- ==================================================
-- RelayLoop Hospital Management System
-- User Creation and Profile Setup
-- ==================================================

-- ==================================================
-- STEP 1: Create Auth Users (Run in Supabase SQL Editor)
-- ==================================================

-- First, create auth users using Supabase Auth API or Dashboard
-- Then run this query to see the created user IDs
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- ==================================================
-- STEP 2: Insert User Profiles for Existing Users
-- ==================================================

-- Using your actual user IDs from the Auth table
-- Based on the emails visible in your Supabase dashboard

-- First, let's see what users we have and their metadata
SELECT 
    id, 
    email, 
    raw_user_meta_data,
    created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Insert user profiles based on your existing users
-- Update the role and department assignments as needed

INSERT INTO user_profiles (id, email, role, department, first_name, last_name, phone, is_active) VALUES

-- Your existing users - assign appropriate roles
('4a6b964b-6934-47bf-a168-9bf0e46c00bc', 'rithikae808@gmail.com', 'admin', NULL, 'Rithika', 'Admin', '(555) 000-0001', true),
('bacb095d-c05b-4f96-b376-6f2f0b08f764', 'rajkumar10114@gmail.com', 'doctor', 'Cardiology', 'Raj', 'Kumar', '(555) 001-0001', true),
('c43f6d6c-5264-4703-8644-1fa5943b4bd0', 'brathikaramesh@gmail.com', 'nurse', 'Cardiology', 'Brathika', 'Ramesh', '(555) 001-0002', true),
('dc9452d6-d0b7-4e54-8aae-a02389ea1374', 'liduaprill8@gmail.com', 'doctor', 'Neurology', 'Lidu', 'April', '(555) 002-0001', true),
('60a40dd5-d3f1-464e-a933-974d885c3ff1', 'dhayananthx805@gmail.com', 'nurse', 'Neurology', 'Dhaya', 'Nanth', '(555) 002-0002', true),
('bf66c474-c91c-4e8a-ba24-bd6864733f6a', 'gowthamaraj04@gmail.com', 'admin', NULL, 'Gowthama', 'Raj', '(555) 000-0002', true);

-- Alternative: Update existing user profiles if they already exist
-- Run this if the INSERT above gives you duplicate key errors
/*
-- Update user roles and departments
UPDATE user_profiles SET 
    role = 'admin',
    department = NULL,
    first_name = 'Rithika',
    last_name = 'Admin',
    phone = '(555) 000-0001'
WHERE id = '4a6b964b-6934-47bf-a168-9bf0e46c00bc';

UPDATE user_profiles SET 
    role = 'doctor',
    department = 'Cardiology',
    first_name = 'Raj',
    last_name = 'Kumar',
    phone = '(555) 001-0001'
WHERE id = 'bacb095d-c05b-4f96-b376-6f2f0b08f764';

UPDATE user_profiles SET 
    role = 'nurse',
    department = 'Cardiology',
    first_name = 'Brathika',
    last_name = 'Ramesh',
    phone = '(555) 001-0002'
WHERE id = 'c43f6d6c-5264-4703-8644-1fa5943b4bd0';

UPDATE user_profiles SET 
    role = 'doctor',
    department = 'Neurology',
    first_name = 'Lidu',
    last_name = 'April',
    phone = '(555) 002-0001'
WHERE id = 'dc9452d6-d0b7-4e54-8aae-a02389ea1374';

UPDATE user_profiles SET 
    role = 'nurse',
    department = 'Neurology',
    first_name = 'Dhaya',
    last_name = 'Nanth',
    phone = '(555) 002-0002'
WHERE id = '60a40dd5-d3f1-464e-a933-974d885c3ff1';

UPDATE user_profiles SET 
    role = 'admin',
    department = NULL,
    first_name = 'Gowthama',
    last_name = 'Raj',
    phone = '(555) 000-0002'
WHERE id = 'bf66c474-c91c-4e8a-ba24-bd6864733f6a';
*/

-- ==================================================
-- STEP 3: Verify User Profiles Created Successfully
-- ==================================================

-- Check all user profiles
SELECT 
    up.email,
    up.role,
    up.department,
    up.first_name,
    up.last_name,
    up.is_active,
    au.created_at as auth_created_at
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
ORDER BY up.role, up.department, up.last_name;

-- Count users by role and department
SELECT 
    role,
    department,
    COUNT(*) as user_count
FROM user_profiles 
GROUP BY role, department
ORDER BY role, department;

-- ==================================================
-- STEP 4: Test Authentication and Access
-- ==================================================

-- Test department-based access (example)
SELECT 
    p.mrn,
    p.first_name,
    p.last_name,
    p.department,
    p.attending_doctor
FROM patients p
WHERE p.department = 'Cardiology'
ORDER BY p.last_name;

-- ==================================================
-- STEP 5: Sample Test Queries
-- ==================================================

-- Get all doctors
SELECT 
    first_name || ' ' || last_name as doctor_name,
    email,
    department,
    phone
FROM user_profiles 
WHERE role = 'doctor'
ORDER BY department, last_name;

-- Get all nurses by department
SELECT 
    department,
    first_name || ' ' || last_name as nurse_name,
    email,
    phone
FROM user_profiles 
WHERE role = 'nurse'
ORDER BY department, last_name;

-- Get admin users
SELECT 
    first_name || ' ' || last_name as admin_name,
    email,
    phone,
    created_at
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at;
