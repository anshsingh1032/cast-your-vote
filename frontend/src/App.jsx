import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; 
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import ElectionResults from './pages/ElectionResults';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/" />;
};
const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/" />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />; 
  return children;
};

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* Add this line */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <ElectionResults />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;