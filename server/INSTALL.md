# RelayLoop Backend - Complete Installation Guide

## 🎯 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# Update: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DATABASE_URL
```

### 3. Database Setup
Run the SQL commands in your Supabase SQL editor (see README.md for full SQL schema)

### 4. Start the Server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 5. Test the API
Visit: http://localhost:3001/api/docs

## 🔧 Project Structure

```
server/
├── src/
│   ├── modules/
│   │   ├── patient/          # Patient management
│   │   │   ├── entities/     # Database entities
│   │   │   ├── dto/          # Data transfer objects
│   │   │   ├── patient.controller.ts
│   │   │   ├── patient.service.ts
│   │   │   └── patient.module.ts
│   │   ├── vital-sign/       # Vital signs recording
│   │   ├── auth/             # Authentication
│   │   ├── user/             # User management
│   │   ├── department/       # Department operations
│   │   ├── supabase/         # Supabase integration
│   │   └── common/           # Shared utilities
│   ├── config/               # Configuration
│   ├── main.ts               # Application entry
│   └── app.module.ts         # Root module
├── package.json
├── .env.example
└── README.md
```

## 📊 API Endpoints Summary

### Core Endpoints for Frontend Integration:

**Authentication:**
- `GET /api/v1/auth/profile` - User profile
- `GET /api/v1/auth/validate` - Token validation

**Patients (Nurse → Doctor → Admin flow):**
- `GET /api/v1/patients` - List patients (department filtered)
- `POST /api/v1/patients` - Create patient
- `GET /api/v1/patients/:id` - Patient details
- `PATCH /api/v1/patients/:id` - Update patient
- `POST /api/v1/patients/:id/medications` - Add medication
- `POST /api/v1/patients/:id/notes` - Add note

**Vital Signs (Nurse primary):**
- `POST /api/v1/vital-signs` - Record vitals
- `GET /api/v1/vital-signs/patient/:patientId` - Patient vitals
- `GET /api/v1/vital-signs/patient/:patientId/latest` - Latest vitals

**Analytics (Admin):**
- `GET /api/v1/patients/stats` - Patient statistics
- `GET /api/v1/vital-signs/stats` - Vital signs stats
- `GET /api/v1/departments/stats` - Department stats
- `GET /api/v1/users/stats` - User statistics

## 🔐 Security Features

- **JWT Authentication**: Supabase token validation
- **Role-Based Access Control**: Admin, Doctor, Nurse roles
- **Department Isolation**: Users see only their department
- **Input Validation**: Comprehensive request validation
- **Database Security**: Row Level Security (RLS) in Supabase

## 🚀 Ready for Production

The backend is production-ready with:
- Error handling and logging
- API documentation (Swagger)
- Environment-based configuration
- Database connection pooling
- CORS configuration
- Health check endpoint

## 📱 Frontend Integration

Your frontend can immediately connect by:

1. **Setting API base URL**: `http://localhost:3001/api/v1`
2. **Adding authentication headers**: `Authorization: Bearer <supabase-jwt-token>`
3. **Using the existing data structures** - all DTOs match your frontend models

## 🎉 Success!

Your backend is now ready to handle:
- ✅ Nurse vital signs recording
- ✅ Doctor patient management
- ✅ Admin analytics and reporting
- ✅ Secure role-based access
- ✅ Real-time data synchronization
- ✅ Scalable architecture

Visit http://localhost:3001/api/docs for interactive API documentation!
