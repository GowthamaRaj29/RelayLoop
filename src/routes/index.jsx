import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';

// Placeholder dashboard components
const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <p>Welcome to the admin dashboard!</p>
  </div>
);

const DoctorPatients = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Doctor - Patients</h1>
    <p>Patient management for doctors.</p>
  </div>
);

const NursePatients = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Nurse - Patients</h1>
    <p>Patient management for nurses.</p>
  </div>
);

const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p>Welcome to RelayLoop!</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
      
      <Route element={<PrivateRoute allowedRoles={['doctor']} />}>
        <Route path="/doctor/patients" element={<DoctorPatients />} />
      </Route>
      
      <Route element={<PrivateRoute allowedRoles={['nurse']} />}>
        <Route path="/nurse/patients" element={<NursePatients />} />
      </Route>
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}