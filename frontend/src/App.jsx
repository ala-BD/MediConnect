import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectDoctor from './pages/SelectDoctor';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import PatientBooking from './pages/PatientBooking';
import Patients from './pages/Patients';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import AdminMedecins from './pages/AdminMedecins';
import AdminSubscriptions from './pages/AdminSubscriptions';
import AdminNotifications from './pages/AdminNotifications';

import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />
        
        {/* Portail Public (Patient) */}
        <Route path="/choisir-medecin" element={<SelectDoctor />} />
        <Route path="/prendre-rdv" element={<SelectDoctor />} />
        <Route path="/prendre-rdv/:cabinetId" element={<PatientBooking />} />
        
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Espace Médecin / Secrétaire */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['medecin', 'secretaire']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="patients" element={<Patients />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Espace Administrateur SaaS */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="medecins" element={<AdminMedecins />} />
          <Route path="abonnements" element={<AdminSubscriptions />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
