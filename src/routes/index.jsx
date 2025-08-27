import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import SystemSettings from '../pages/admin/Settings';
import Patients from '../pages/admin/Patients';
import PatientDetails from '../pages/admin/PatientDetails';
import Departments from '../pages/admin/Departments';
import Predictions from '../pages/admin/Predictions';
import PredictionDetails from '../pages/admin/PredictionDetails';
import Models from '../pages/admin/Models';
import ModelDetails from '../pages/admin/ModelDetails';
import BatchJobs from '../pages/admin/BatchJobs';
import AuditLogs from '../pages/admin/AuditLogs';
import Analytics from '../pages/admin/Analytics';
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
          <Route path="dashboardnew" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:patientId" element={<PatientDetails />} />
          <Route path="departments" element={<Departments />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="predictions/:predictionId" element={<PredictionDetails />} />
          <Route path="models" element={<Models />} />
          <Route path="models/:id" element={<ModelDetails />} />
          <Route path="batch-jobs" element={<BatchJobs />} />
          <Route path="audit-logs" element={<AuditLogs />} />
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
      {/* Fallback routes */}
      {/* Root redirect based on role */}
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
