-- Create a schema for our application
CREATE SCHEMA IF NOT EXISTS relayloop;

-- Create users table to extend auth.users with input validation
CREATE TABLE IF NOT EXISTS relayloop.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT CHECK (length(full_name) <= 100), -- Prevent overlong names
  department TEXT CHECK (length(department) <= 50), -- Limit department length
  avatar_url TEXT CHECK (avatar_url ~ '^https?://.*' OR avatar_url IS NULL), -- Ensure URL format
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add an index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON relayloop.user_profiles(department);

-- Set up Row Level Security (RLS)
ALTER TABLE relayloop.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create more specific RLS policies with additional security checks
-- Admins can see and manage all users - make role check more secure
CREATE POLICY "Admins can read user profiles" ON relayloop.user_profiles 
  FOR SELECT USING ((auth.jwt() ->> 'role'::text) = 'admin');
  
CREATE POLICY "Admins can insert user profiles" ON relayloop.user_profiles 
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin');
  
CREATE POLICY "Admins can update user profiles" ON relayloop.user_profiles 
  FOR UPDATE USING ((auth.jwt() ->> 'role'::text) = 'admin');
  
CREATE POLICY "Admins can delete user profiles" ON relayloop.user_profiles 
  FOR DELETE USING ((auth.jwt() ->> 'role'::text) = 'admin');

-- Users can read their own profile - more explicit with operation type
CREATE POLICY "Users can read own profile" ON relayloop.user_profiles 
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile but not change the ID
CREATE POLICY "Users can update own profile" ON relayloop.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- Allow doctors to view profiles in their department
CREATE POLICY "Doctors can view department profiles" ON relayloop.user_profiles
  FOR SELECT 
  USING ((auth.jwt() ->> 'role'::text) = 'doctor' AND 
         department = (SELECT department FROM relayloop.user_profiles WHERE id = auth.uid()));

-- Create function with additional security measures for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile() 
RETURNS trigger AS $$
BEGIN
  -- Basic input validation
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Check if a profile already exists (prevent duplicates)
  IF EXISTS (SELECT 1 FROM relayloop.user_profiles WHERE id = NEW.id) THEN
    RETURN NEW; -- Profile already exists, do nothing
  END IF;
  
  -- Get department from user metadata if available
  DECLARE
    user_department TEXT := NEW.raw_user_meta_data->>'department';
  BEGIN
    INSERT INTO relayloop.user_profiles (id, department)
    VALUES (NEW.id, user_department);
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't expose details to clients
    RAISE LOG 'Error in handle_new_user_profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set proper search_path to prevent search_path attack
REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC;
ALTER FUNCTION public.handle_new_user_profile() SET search_path = pg_catalog, pg_temp;

-- Trigger for new user creation with better commenting
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();

-- Add an updated_at trigger function to automatically update timestamps
CREATE OR REPLACE FUNCTION relayloop.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set proper search_path for this function too
ALTER FUNCTION relayloop.set_updated_at() SET search_path = pg_catalog, pg_temp;

-- Create trigger for automatically updating updated_at timestamp
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON relayloop.user_profiles
  FOR EACH ROW EXECUTE FUNCTION relayloop.set_updated_at();

-- Replace with your user's ID - Admins
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'::jsonb
)
WHERE email IN ('gowthamaraj04@gmail.com','dhayananth2805@gmail.com');

-- Doctors with specific departments
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"doctor"'::jsonb
  ),
  '{department}',
  '"Cardiology"'::jsonb
)
WHERE email = 'liduapril18@gmail.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"doctor"'::jsonb
  ),
  '{department}',
  '"Neurology"'::jsonb
)
WHERE email = 'brathikaramesh@gmail.com';

-- Nurses with specific departments
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"nurse"'::jsonb
  ),
  '{department}',
  '"Cardiology"'::jsonb
)
WHERE email = 'rajkumar101104@gmail.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"nurse"'::jsonb
  ),
  '{department}',
  '"Oncology"'::jsonb
)
WHERE email = 'rithika6808@gmail.com';
