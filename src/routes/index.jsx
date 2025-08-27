import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'; // Generic dashboard for users with undefined roles
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import SystemSettings from '../pages/admin/Settings';
import Patients from '../pages/admin/Patients';
import Analytics from '../pages/admin/Analytics';
import Unauthorized from '../pages/common/Unauthorized';
import NotFound from '../pages/common/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="login" element={<Login />} />
      
      {/* Protected admin routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="patients" element={<Patients />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
      
      {/* Protected doctor routes */}
      <Route element={<PrivateRoute allowedRoles={['doctor']} />}>
        <Route path="/doctor/patients" element={<div>Doctor Patients</div>} />
        <Route path="/doctor/predictions" element={<div>Run Predictions</div>} />
        <Route path="/doctor/analytics" element={<div>Department Analytics</div>} />
      </Route>
      
      {/* Protected nurse routes */}
      <Route element={<PrivateRoute allowedRoles={['nurse']} />}>
        <Route path="/nurse/patients" element={<div>Nurse Patients</div>} />
        <Route path="/nurse/observations" element={<div>Patient Observations</div>} />
      </Route>
      
      {/* Generic dashboard for users with undefined or basic roles */}
      <Route element={<PrivateRoute allowedRoles={['user', 'admin', 'doctor', 'nurse']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      {/* Fallback routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
