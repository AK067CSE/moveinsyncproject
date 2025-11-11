import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Vendors from './pages/Vendors';
import Employees from './pages/Employees';
import Trips from './pages/Trips';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

import { PERMISSIONS, getUserRole, ROLES } from "./utils/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar />}
        <div className={isAuthenticated ? "main-content" : ""}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to={getUserRole() === ROLES.ADMIN ? "/dashboard" : "/reports"} />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ALL_CLIENTS}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_VENDORS}>
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ALL_EMPLOYEES}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_TRIPS}>
                  <Trips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BILLING}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/billing-config"
              element={isAuthenticated ? <BillingConfiguration /> : <Navigate to="/login" />}
            /> */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_REPORTS}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated
                  ? <Navigate to={getUserRole() === ROLES.ADMIN ? "/dashboard" : "/reports"} />
                  : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
