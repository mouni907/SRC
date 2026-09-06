import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClearanceProvider } from './context/ClearanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/student/StudentDashboard';
import ClearanceDetails from './pages/student/ClearanceDetails';
import Certificate from './pages/student/Certificate';
import Notifications from './pages/student/Notifications';
import StudentProfile from './pages/student/StudentProfile';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import DepartmentPortalLayout from './pages/department/DepartmentPortalLayout';
import DepartmentRequests from './pages/department/DepartmentRequests';
import RequestDetails from './pages/department/RequestDetails';
import MyDepartment from './pages/department/MyDepartment';
import DepartmentReports from './pages/department/DepartmentReports';
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyCertificate from './pages/VerifyCertificate';

function StudentPortalLayout() {
  const location = useLocation();

  // Determine title and active tab from current route
  let title = 'No-Dues Clearance';
  let activeTab = 'dashboard';

  if (location.pathname.includes('/clearance')) {
    title = 'Clearance Request & Department Status';
    activeTab = 'clearance';
  } else if (location.pathname.includes('/certificate')) {
    title = 'Digital No-Dues Certificate';
    activeTab = 'certificate';
  } else if (location.pathname.includes('/notifications')) {
    title = 'Activity Notifications';
    activeTab = 'notifications';
  } else if (location.pathname.includes('/profile')) {
    title = 'Student Profile & Academic Records';
    activeTab = 'profile';
  }

  return (
    <div id="digiclear-app" className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Static Left Sidebar */}
      <Sidebar activeTab={activeTab} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar 
          category="Academic Services"
          title={title}
        />

        {/* Dynamic Page Routes (Scrolls independently while sidebar remains static) */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="clearance" element={<ClearanceDetails />} />
            <Route path="certificate" element={<Certificate />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user, isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  } else if (user.role === 'department') {
    return <Navigate to="/department/dashboard" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

function DepartmentPortalRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DepartmentDashboard />} />
      <Route path="requests" element={<DepartmentRequests />} />
      <Route path="requests/:requestId" element={<RequestDetails />} />
      <Route path="my-department" element={<MyDepartment />} />
      <Route path="reports" element={<DepartmentReports />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ClearanceProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/:role" element={<Signup />} />

          {/* Public Verification Route */}
          <Route path="/verify/:id" element={<VerifyCertificate />} />

          {/* Protected Student Portal */}
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPortalLayout />
              </ProtectedRoute>
            } 
          />

          {/* Protected Department Portal */}
          <Route 
            path="/department/*" 
            element={
              <ProtectedRoute allowedRoles={['department']}>
                <DepartmentPortalRoutes />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Portal */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Root Redirect: sends to /login or user dashboard */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </ClearanceProvider>
    </AuthProvider>
  );
}
