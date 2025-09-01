import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import AdminLayout from '../components/layout/AdminLayout';
import NurseLayout from '../components/layout/NurseLayout';
import DoctorLayout from '../components/layout/DoctorLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import SystemSettings from '../pages/admin/Settings';
import AdminProfile from '../pages/admin/Profile';
import PatientsNew from '../pages/admin/PatientsNew';
import PatientDetails from '../pages/admin/PatientDetails';
import Departments from '../pages/admin/Departments';
import Predictions from '../pages/admin/Predictions';
import PredictionDetails from '../pages/admin/PredictionDetails';
import Models from '../pages/admin/Models';
import ModelDetails from '../pages/admin/ModelDetails';
import BatchJobs from '../pages/admin/BatchJobs';
import AuditLogs from '../pages/admin/AuditLogs';
import Analytics from '../pages/admin/Analytics';
import NursePatients from '../pages/nurse/NursePatients';
import NursePatientNew from '../pages/nurse/NursePatientNew';
import NursePatientDetails from '../pages/nurse/NursePatientDetails';
import NursePatientEdit from '../pages/nurse/NursePatientEdit';
import NurseVitals from '../pages/nurse/NurseVitals';
import NotFound from '../pages/common/NotFound';
import DoctorPatientNew from '../pages/doctor/DoctorPatientNew';
import DoctorPatientEdit from '../pages/doctor/DoctorPatientEdit';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorPatients from '../pages/doctor/DoctorPatients';
import DoctorPatientDetails from '../pages/doctor/DoctorPatientDetails';
import DoctorPredictions from '../pages/doctor/DoctorPredictions';

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
          <Route path="profile" element={<AdminProfile />} />
          <Route path="patients" element={<PatientsNew />} />
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
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patients/:patientId" element={<DoctorPatientDetails />} />
          <Route path="patients/:patientId/edit" element={<DoctorPatientEdit />} />
          <Route path="patients/new" element={<DoctorPatientNew />} />
          <Route path="predictions" element={<DoctorPredictions />} />
          <Route path="analytics" element={<DoctorPredictions />} />
          <Route path="" element={<Navigate to="/doctor/patients" replace />} />
        </Route>
      </Route>
      
      {/* Protected nurse routes */}
      <Route element={<PrivateRoute allowedRoles={['nurse']} />}>
        <Route path="/nurse" element={<NurseLayout />}>
          <Route path="patients" element={<NursePatients />} />
          <Route path="patients/new" element={<NursePatientNew />} />
          <Route path="patients/:patientId" element={<NursePatientDetails />} />
          <Route path="patients/:patientId/edit" element={<NursePatientEdit />} />
          <Route path="vitals" element={<NurseVitals />} />
          <Route path="" element={<Navigate to="/nurse/patients" replace />} />
        </Route>
      </Route>
      {/* Fallback routes */}
      {/* Root redirect based on role */}
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
