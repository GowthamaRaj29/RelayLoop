-- ==================================================
-- RelayLoop Hospital Management System
-- Setup User Profiles for Existing Users
-- ==================================================

-- Run this in your Supabase SQL Editor to set up user profiles
-- for the existing users visible in your dashboard

-- ==================================================
-- STEP 1: Check existing users and their metadata
-- ==================================================

SELECT 
    id, 
    email, 
    raw_user_meta_data,
    created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- ==================================================
-- STEP 2: Create user profiles (if user_profiles table exists)
-- ==================================================

-- First, let's check what users actually exist
SELECT 
    'Existing Auth Users:' as info,
    id, 
    email, 
    created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Delete any existing profiles first (if needed)
-- DELETE FROM user_profiles WHERE id IN (
--     '4a6b964b-6934-47bf-a168-9bf0e46c00bc',
--     'bacb095d-c05b-4f96-b376-6f2f0b08f764',
--     'c43f6d6c-5264-4703-8644-1fa5943b4bd0',
--     'dc9452d6-d0b7-4e54-8aae-a02389ea1374',
--     '60a40dd5-d3f1-464e-a933-974d885c3ff1'
-- );

-- Insert user profiles with role assignments
-- Using your actual user IDs and updated assignments
INSERT INTO user_profiles (id, email, role, department, first_name, last_name, phone, is_active) VALUES

-- Admin Users
('60a40dd5-d3f1-464e-a933-97a4885c3ff1', 'dhayananth2805@gmail.com', 'admin', NULL, 'Dhayananth', 'E', '(555) 000-0001', true),
('b165c474-c91c-4e8a-be24-bd686473376a', 'gowthamaraj04@gmail.com', 'admin', NULL, 'Gowthama', 'Raj', '(555) 000-0002', true),

-- Cardiology Department
('dc9452d6-d0b7-4e54-8aae-a2289ee13741', 'liduapril18@gmail.com', 'doctor', 'Cardiology', 'Infant', 'Lidwina', '(555) 001-0001', true),
('bacb09f3-c05b-4f96-b37c-8f2f0b08f764', 'rajkumar101104@gmail.com', 'nurse', 'Cardiology', 'Raj', 'Kumar', '(555) 001-0002', true),

-- Neurology Department  
('c43f06dc-5264-4703-8544-1fa5943b4bd0', 'brathikaramesh@gmail.com', 'doctor', 'Neurology', 'Brathika', 'Ramesh', '(555) 002-0001', true),

-- Oncology Department
('4a6b964b-6934-47bf-a168-9bf0e46c00bc', 'rithika6808@gmail.com', 'nurse', 'Oncology', 'Rithika', 'S', '(555) 002-0002', true);

-- ==================================================
-- STEP 3: Verify the setup
-- ==================================================

-- Check all user profiles with their auth data
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

-- ==================================================
-- STEP 4: Test department access
-- ==================================================

-- Test Cardiology department access
SELECT 
    'Cardiology Department Users' as section,
    up.first_name || ' ' || up.last_name as full_name,
    up.role,
    up.email
FROM user_profiles up 
WHERE up.department = 'Cardiology'
ORDER BY up.role;

-- Test Neurology department access
SELECT 
    'Neurology Department Users' as section,
    up.first_name || ' ' || up.last_name as full_name,
    up.role,
    up.email
FROM user_profiles up 
WHERE up.department = 'Neurology'
ORDER BY up.role;

-- Test Admin users
SELECT 
    'Admin Users' as section,
    up.first_name || ' ' || up.last_name as full_name,
    up.role,
    up.email
FROM user_profiles up 
WHERE up.role = 'admin'
ORDER BY up.first_name;

-- ==================================================
-- STEP 5: Update departments table with your users
-- ==================================================

-- Update departments with actual head doctors
UPDATE departments SET head_doctor = 'Dr. Infant Lidwina' WHERE name = 'Cardiology';
UPDATE departments SET head_doctor = 'Dr. Brathika Ramesh' WHERE name = 'Neurology';
UPDATE departments SET head_doctor = 'Dr. Emily Davis' WHERE name = 'General Medicine';
UPDATE departments SET head_doctor = 'Dr. David Lee' WHERE name = 'Pediatrics';
UPDATE departments SET head_doctor = 'Dr. Jennifer Brown' WHERE name = 'Oncology';

-- Check department assignments
SELECT 
    d.name as department_name,
    d.head_doctor,
    COUNT(up.id) as staff_count,
    array_agg(up.first_name || ' ' || up.last_name) as staff_members
FROM departments d
LEFT JOIN user_profiles up ON up.department = d.name
GROUP BY d.name, d.head_doctor
ORDER BY d.name;

-- ==================================================
-- STEP 6: Success message
-- ==================================================

SELECT 
    'User profiles setup completed successfully!' as status,
    COUNT(*) as total_profiles_created
FROM user_profiles;
