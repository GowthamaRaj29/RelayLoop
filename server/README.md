# RelayLoop Backend API

A comprehensive hospital management system backend built with NestJS, PostgreSQL (Supabase), and TypeORM. This backend perfectly matches your frontend requirements with role-based access control for Nurses, Doctors, and Administrators.

## 🚀 Features

### **Nurse Workflow**
- Record patient vital signs (temperature, heart rate, blood pressure, etc.)
- Add patient notes and observations
- View patients in their assigned department
- Manage patient medications (nurse-added)
- Access patient history and records

### **Doctor Workflow**
- View all patients in their department
- Access complete patient medical history
- Review vital signs recorded by nurses
- Add diagnoses and treatment plans
- Prescribe medications
- Add medical assessments and notes

### **Admin Workflow**
- Comprehensive dashboard with analytics
- View all departments and patients
- User management and statistics
- System-wide reporting
- Department performance metrics

### **Technical Features**
- **Role-Based Access Control (RBAC)**: Secure access based on user roles
- **Department Isolation**: Users can only access patients in their department
- **Supabase Integration**: Seamless authentication and data storage
- **Real-time Data**: Instant updates across the system
- **Scalable Architecture**: Clean, maintainable code structure
- **API Documentation**: Auto-generated Swagger documentation
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input validation and sanitization

## 🏗️ Architecture

```
src/
├── modules/
│   ├── auth/                 # Authentication & authorization
│   ├── patient/              # Patient management
│   ├── vital-sign/           # Vital signs recording
│   ├── user/                 # User management
│   ├── department/           # Department operations
│   ├── supabase/             # Supabase integration
│   └── common/               # Shared utilities
├── config/                   # Configuration
└── main.ts                   # Application entry point
```

## 📦 Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the environment example file:
```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project-id.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Supabase Setup

#### Create the following tables in your Supabase database:

```sql
-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mrn VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    department VARCHAR(100) NOT NULL,
    attending_doctor VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(255),
    address TEXT,
    insurance VARCHAR(100),
    room VARCHAR(20),
    medical_conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    last_admission DATE,
    last_visit DATE,
    status VARCHAR(50) DEFAULT 'Active',
    notes TEXT,
    risk_score DECIMAL(5,2),
    risk_level VARCHAR(50),
    prediction_factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vital signs table
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    temperature DECIMAL(4,1),
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    blood_glucose DECIMAL(5,1),
    notes TEXT,
    recorded_by VARCHAR(100) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient notes table
CREATE TABLE patient_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'Observation' CHECK (type IN ('Observation', 'Assessment', 'Medication', 'General')),
    content TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    instructions TEXT,
    added_by VARCHAR(100) DEFAULT 'Doctor',
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Discontinued', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (for role and department management)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse')),
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Set up Row Level Security (RLS):

```sql
-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for department-based access
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

-- Similar policies for other tables
CREATE POLICY "Users can access vital signs for patients in their department" 
ON vital_signs FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

CREATE POLICY "Users can access notes for patients in their department" 
ON patient_notes FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

CREATE POLICY "Users can access medications for patients in their department" 
ON medications FOR ALL 
USING (
    patient_id IN (
        SELECT p.id FROM patients p 
        INNER JOIN user_profiles up ON up.id = auth.uid()
        WHERE p.department = up.department OR up.role = 'admin'
    )
);

CREATE POLICY "Users can read their own profile" 
ON user_profiles FOR SELECT 
USING (id = auth.uid());
```

### 4. Run the Application

#### Development Mode:
```bash
npm run start:dev
```

#### Production Mode:
```bash
npm run build
npm run start:prod
```

## 🔗 API Endpoints

The backend provides comprehensive REST APIs matching your frontend requirements:

### **Authentication**
- `GET /api/v1/auth/profile` - Get current user profile
- `GET /api/v1/auth/validate` - Validate authentication token

### **Patients** (Role-based access)
- `GET /api/v1/patients` - List patients (filtered by department for nurses/doctors)
- `POST /api/v1/patients` - Create new patient
- `GET /api/v1/patients/:id` - Get patient details
- `PATCH /api/v1/patients/:id` - Update patient
- `DELETE /api/v1/patients/:id` - Delete patient (admin only)
- `POST /api/v1/patients/:id/medications` - Add medication
- `POST /api/v1/patients/:id/notes` - Add patient note
- `GET /api/v1/patients/stats` - Get patient statistics

### **Vital Signs** (Nurse primary access)
- `POST /api/v1/vital-signs` - Record vital signs (nurses)
- `GET /api/v1/vital-signs/patient/:patientId` - Get patient's vital signs
- `GET /api/v1/vital-signs/patient/:patientId/latest` - Get latest vital signs
- `GET /api/v1/vital-signs/:id` - Get specific vital sign record
- `PATCH /api/v1/vital-signs/:id` - Update vital signs (nurses)
- `DELETE /api/v1/vital-signs/:id` - Delete vital signs (admin only)
- `GET /api/v1/vital-signs/stats` - Get vital signs statistics

### **Departments**
- `GET /api/v1/departments` - List all departments
- `GET /api/v1/departments/stats` - All department statistics (admin only)
- `GET /api/v1/departments/:id/stats` - Specific department stats

### **Users** (Admin access)
- `GET /api/v1/users/stats` - User statistics (admin only)

## 📚 API Documentation

Once the server is running, visit:
```
http://localhost:3001/api/docs
```

This provides interactive Swagger documentation with all endpoints, request/response schemas, and authentication requirements.

## 🔐 Authentication Flow

The backend integrates seamlessly with your frontend's Supabase authentication:

1. **Frontend** authenticates users with Supabase
2. **Frontend** sends JWT token in Authorization header: `Bearer <token>`
3. **Backend** verifies token with Supabase
4. **Backend** fetches user role and department
5. **Backend** applies role-based access control

## 🏥 Data Flow

### **Nurse Workflow:**
1. Nurse logs in → Frontend gets JWT token
2. Frontend calls `/api/v1/patients` → Backend returns patients in nurse's department
3. Nurse records vitals → Frontend calls `/api/v1/vital-signs` → Backend saves to Supabase
4. Data immediately available to doctors in the same department

### **Doctor Workflow:**
1. Doctor accesses patient → Frontend calls `/api/v1/patients/:id`
2. Backend returns patient with all vital signs recorded by nurses
3. Doctor adds diagnosis → Frontend calls `/api/v1/patients/:id/notes`
4. Doctor prescribes medication → Frontend calls `/api/v1/patients/:id/medications`

### **Admin Workflow:**
1. Admin accesses dashboard → Frontend calls multiple stats endpoints
2. Backend aggregates data across all departments
3. Real-time analytics and reporting available

## 🚀 Deployment

### Using PM2 (Production):
```bash
npm install -g pm2
npm run build
pm2 start dist/main.js --name "relayloop-backend"
```

### Using Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
```

## 🔧 Configuration

The backend is highly configurable through environment variables:

- **PORT**: Server port (default: 3001)
- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_SERVICE_ROLE_KEY**: Service role key for server-side operations
- **JWT_SECRET**: Secret for JWT token validation
- **FRONTEND_URL**: Frontend URL for CORS configuration

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Monitoring

The backend includes comprehensive logging and error handling:

- Structured logging with timestamps
- Error tracking and reporting
- Performance monitoring
- Health check endpoint: `GET /api/v1/health`

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Issues**:
   - Verify Supabase credentials in `.env`
   - Check if Supabase project is active
   - Ensure database URL format is correct

2. **Authentication Failures**:
   - Verify JWT secret matches frontend configuration
   - Check if user has proper role in `user_profiles` table
   - Ensure Supabase RLS policies are correctly configured

3. **CORS Issues**:
   - Update `FRONTEND_URL` in `.env`
   - Check if frontend is running on correct port

## 📈 Performance

The backend is optimized for high performance:

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching**: Strategic caching of frequently accessed data
- **Pagination**: All list endpoints support pagination
- **Role-based Filtering**: Database-level filtering for security and performance

## 🛡️ Security

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission system
- **Department Isolation**: Users can only access their department's data
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: TypeORM protects against SQL injection
- **Rate Limiting**: Protection against abuse (configurable)

This backend provides a robust, scalable foundation for your hospital management system that perfectly matches your frontend requirements while maintaining high security and performance standards.
