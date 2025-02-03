// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/forgot-password';
import ResetPassword from './components/ResetPassword/reset-password';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import UsersStatus from './components/UsersStatus/UsersStatus';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Unauthorized from './components/Unauthorized/Unauthorized';
import ErrorPage from './components/ErrorPage/ErrorPage';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/validate-token', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.user?.role) {
          const userData = {
            email: response.data.user.email,
            role: response.data.user.role,
            name: response.data.user.name,
            id: response.data.user.id
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [location.pathname]);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLogin = (token, userData) => {
    if (!userData?.role) {
      console.error('Invalid user data received');
      return;
    }
    
    const validatedUser = {
      email: userData.email,
      role: userData.role,
      name: userData.name,
      id: userData.id
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(validatedUser));
    setUser(validatedUser);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { state: { from: 'logout' }, replace: true });
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <div className="app-container">
      {user && <Sidebar user={user} onLogout={handleLogout} />}
      
      <main className={`main-content ${user ? 'authenticated' : 'public'}`}>
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Added allowedRoles={[]} to default routes */}
          <Route path="/" element={
            <ProtectedRoute user={user} allowedRoles={[]}>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }/>

          <Route path="/dashboard" element={
            <ProtectedRoute user={user} allowedRoles={[]}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }/>

          <Route path="/admin-dashboard" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }/>

          <Route path="/users-status" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <UsersStatus user={user} />
            </ProtectedRoute>
          }/>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;