import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import DocumentViewer from './pages/DocumentViewer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/document/:id" element={
        <ProtectedRoute>
          <DocumentViewer />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />
      } />
    </Routes>
  );
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-black text-white mb-4 tracking-wide">Welcome to ISDocHub</h1>
          <p className="text-xl text-blue-100 mb-8 font-body">Family Document Management System</p>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;