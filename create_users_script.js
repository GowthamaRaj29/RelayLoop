// ==================================================
// RelayLoop Hospital Management System
// Automated User Creation Script
// ==================================================

import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project details
const SUPABASE_URL = 'your-supabase-url'
const SUPABASE_SERVICE_KEY = 'your-service-role-key' // NOT anon key!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ==================================================
// User Data Configuration
// ==================================================

const usersToCreate = [
  // Admin Users
  {
    email: 'admin@relayloop.com',
    password: 'RelayLoop2024!',
    role: 'admin',
    department: null,
    first_name: 'System',
    last_name: 'Administrator',
    phone: '(555) 000-0001'
  },
  {
    email: 'superadmin@relayloop.com', 
    password: 'RelayLoop2024!',
    role: 'admin',
    department: null,
    first_name: 'Super',
    last_name: 'Admin',
    phone: '(555) 000-0002'
  },

  // Cardiology Department
  {
    email: 'dr.wilson@relayloop.com',
    password: 'Doctor2024!',
    role: 'doctor',
    department: 'Cardiology',
    first_name: 'Sarah',
    last_name: 'Wilson',
    phone: '(555) 001-0001'
  },
  {
    email: 'nurse.cardio1@relayloop.com',
    password: 'Nurse2024!',
    role: 'nurse', 
    department: 'Cardiology',
    first_name: 'Emily',
    last_name: 'Johnson',
    phone: '(555) 001-0002'
  },
  {
    email: 'nurse.cardio2@relayloop.com',
    password: 'Nurse2024!',
    role: 'nurse',
    department: 'Cardiology', 
    first_name: 'Michael',
    last_name: 'Davis',
    phone: '(555) 001-0003'
  },

  // Neurology Department
  {
    email: 'dr.johnson@relayloop.com',
    password: 'Doctor2024!',
    role: 'doctor',
    department: 'Neurology',
    first_name: 'Michael', 
    last_name: 'Johnson',
    phone: '(555) 002-0001'
  },
  {
    email: 'nurse.neuro1@relayloop.com',
    password: 'Nurse2024!',
    role: 'nurse',
    department: 'Neurology',
    first_name: 'Lisa',
    last_name: 'Brown', 
    phone: '(555) 002-0002'
  },
  {
    email: 'nurse.neuro2@relayloop.com',
    password: 'Nurse2024!',
    role: 'nurse',
    department: 'Neurology',
    first_name: 'David',
    last_name: 'Martinez',
    phone: '(555) 002-0003'
  },

  // General Medicine Department  
  {
    email: 'dr.davis@relayloop.com',
    password: 'Doctor2024!',
    role: 'doctor',
    department: 'General Medicine',
    first_name: 'Emily',
    last_name: 'Davis',
    phone: '(555) 003-0001'
  },
  {
    email: 'nurse.gmed1@relayloop.com',
    password: 'Nurse2024!',
    role: 'nurse',
    department: 'General Medicine',
    first_name: 'Jennifer',
    last_name: 'Wilson',
    phone: '(555) 003-0002'
  },
  {
    email: 'nurse.gmed2@relayloop.com', 
    password: 'Nurse2024!',
    role: 'nurse',
    department: 'General Medicine',
    first_name: 'Robert',
    last_name: 'Taylor',
    phone: '(555) 003-0003'
  },

  // Pediatrics Department
  {
    email: 'dr.lee@relayloop.com',
    password: 'Doctor2024!',
    role: 'doctor',
    department: 'Pediatrics',
    first_name: 'David',
    last_name: 'Lee',
    phone: '(555) 004-0001'
  },
  {
    email: 'nurse.peds1@relayloop.com',
    password: 'Nurse2024!', 
    role: 'nurse',
    department: 'Pediatrics',
    first_name: 'Amanda',
    last_name: 'Garcia',
    phone: '(555) 004-0002'
  },

  // Oncology Department
  {
    email: 'dr.brown@relayloop.com',
    password: 'Doctor2024!',
    role: 'doctor',
    department: 'Oncology',
    first_name: 'Jennifer',
    last_name: 'Brown',
    phone: '(555) 005-0001'
  },
  {
    email: 'nurse.onco1@relayloop.com',
    password: 'Nurse2024!',
    role: 'nurse',
    department: 'Oncology',
    first_name: 'Christopher', 
    last_name: 'Anderson',
    phone: '(555) 005-0002'
  }
]

// ==================================================
// User Creation Functions
// ==================================================

async function createUserAndProfile(userData) {
  try {
    console.log(`Creating user: ${userData.email}...`)
    
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: userData.role,
        department: userData.department,
        first_name: userData.first_name,
        last_name: userData.last_name
      }
    })

    if (authError) {
      console.error(`Error creating auth user ${userData.email}:`, authError.message)
      return { success: false, error: authError.message }
    }

    console.log(`✅ Auth user created: ${userData.email} (ID: ${authData.user.id})`)

    // Step 2: Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        is_active: true
      }])

    if (profileError) {
      console.error(`Error creating profile for ${userData.email}:`, profileError.message)
      return { success: false, error: profileError.message }
    }

    console.log(`✅ Profile created: ${userData.first_name} ${userData.last_name}`)
    
    return { 
      success: true, 
      userId: authData.user.id,
      email: userData.email,
      role: userData.role,
      department: userData.department
    }

  } catch (error) {
    console.error(`Unexpected error for ${userData.email}:`, error)
    return { success: false, error: error.message }
  }
}

async function createAllUsers() {
  console.log('🚀 Starting user creation process...')
  
  const results = []
  
  for (const userData of usersToCreate) {
    const result = await createUserAndProfile(userData)
    results.push(result)
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Summary
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log('\n📊 CREATION SUMMARY:')
  console.log(`✅ Successful: ${successful.length}`)
  console.log(`❌ Failed: ${failed.length}`)
  
  if (successful.length > 0) {
    console.log('\n✅ Successfully created users:')
    successful.forEach(user => {
      const departmentInfo = user.department ? ` - ${user.department}` : ''
      console.log(`  - ${user.email} (${user.role}${departmentInfo})`)
    })
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed to create users:')
    failed.forEach(result => {
      console.log(`  - ${result.email}: ${result.error}`)
    })
  }
  
  return results
}

// ==================================================
// Run the creation process
// ==================================================

createAllUsers()
  .then(() => {
    console.log('\n🎉 User creation process completed!')
  })
  .catch(error => {
    console.error('💥 Fatal error during user creation:', error)
  })
