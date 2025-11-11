import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole, hasPermission } from '../utils/auth';

function ProtectedRoute({ children, requiredPermission }) {
  const token = sessionStorage.getItem('token');
  const userRole = getUserRole();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return (
      <div className="table-card" style={{ margin: '40px', textAlign: 'center', padding: '60px' }}>
        <h2 style={{ color: 'var(--error-red)', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          You don't have permission to access this page.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px' }}>
          Your role: <strong style={{ color: 'var(--primary-teal)' }}>{userRole}</strong>
        </p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
