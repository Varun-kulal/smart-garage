import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SOSAlertBanner from './components/SOSAlertBanner';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';

import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import StaffLogin from './pages/auth/StaffLogin';
import StaffRegister from './pages/auth/StaffRegister';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import Services from './pages/user/Services';
import ServiceBooking from './pages/user/ServiceBooking';
import VehicleList from './pages/user/VehicleList';
import ServiceHistory from './pages/user/ServiceHistory';
import UserProfile from './pages/user/UserProfile';
import PartShop from './pages/user/PartShop';
import AboutUs from './pages/user/AboutUs';
import PartnerWithUs from './pages/user/PartnerWithUs';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffServices from './pages/staff/StaffServices';
import StaffTeam from './pages/staff/StaffTeam';
import StaffGarageManagement from './pages/staff/StaffGarageManagement';
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffVehicles from './pages/staff/StaffVehicles';
import StaffNotifications from './pages/staff/StaffNotifications';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VehicleManagement from './pages/admin/VehicleManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import ServiceRequests from './pages/admin/ServiceRequests';
import Notifications from './pages/admin/Notifications';
import GarageManagement from './pages/admin/GarageManagement';
import PartnerRequests from './pages/admin/PartnerRequests';
import AdminEmergencies from './pages/admin/AdminEmergencies';
import StaffEmergencies from './pages/staff/StaffEmergencies';

// ================= PRIVATE ROUTE GUARDS =================

// Protect routes for standard registered users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If admin tries to access user page, let's redirect them to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isStaff) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return <UserLayout>{children}</UserLayout>;
};

// Protect routes for administrators
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Protect routes for staff
const StaffRoute = ({ children }) => {
  const { isAuthenticated, loading, isStaff, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isStaff && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <StaffLayout>{children}</StaffLayout>;
};

// Default Route Redirector
const DefaultRouteRedirect = () => {
  const { isAuthenticated, isAdmin, isStaff, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (isStaff) return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Navigate to="/auth/login" replace />;
};

// ================= APP ROOT =================

function App() {
  return (
    <AuthProvider>
      <Router>
        <SOSAlertBanner />
        <Routes>

          <Route path="/auth/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/register" element={<StaffRegister />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          {/* Legacy Auth Paths for backward compatibility */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Customer Routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/user/vehicles" element={<ProtectedRoute><VehicleList /></ProtectedRoute>} />
          <Route path="/user/service-booking" element={<ProtectedRoute><ServiceBooking /></ProtectedRoute>} />
          <Route path="/user/history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
          <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/user/shop" element={<ProtectedRoute><PartShop /></ProtectedRoute>} />
          <Route path="/user/partner" element={<ProtectedRoute><PartnerWithUs /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />

          {/* Protected Staff Routes */}
          <Route path="/staff/dashboard" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
          <Route path="/staff/services" element={<StaffRoute><StaffServices /></StaffRoute>} />
          <Route path="/staff/emergencies" element={<StaffRoute><StaffEmergencies /></StaffRoute>} />
          <Route path="/staff/customers" element={<StaffRoute><StaffCustomers /></StaffRoute>} />
          <Route path="/staff/vehicles" element={<StaffRoute><StaffVehicles /></StaffRoute>} />
          <Route path="/staff/team" element={<StaffRoute><StaffTeam /></StaffRoute>} />
          <Route path="/staff/garages" element={<StaffRoute><StaffGarageManagement /></StaffRoute>} />
          <Route path="/staff/notifications" element={<StaffRoute><StaffNotifications /></StaffRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/emergencies" element={<AdminRoute><AdminEmergencies /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/vehicles" element={<AdminRoute><VehicleManagement /></AdminRoute>} />
          <Route path="/admin/inventory" element={<AdminRoute><InventoryManagement /></AdminRoute>} />
          <Route path="/admin/services" element={<AdminRoute><ServiceRequests /></AdminRoute>} />
          <Route path="/admin/garages" element={<AdminRoute><GarageManagement /></AdminRoute>} />
          <Route path="/admin/partner-requests" element={<AdminRoute><PartnerRequests /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><Notifications /></AdminRoute>} />

          {/* Fallback Redirection */}
          <Route path="*" element={<DefaultRouteRedirect />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
