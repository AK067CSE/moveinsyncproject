import React, { useState } from 'react';
import { login } from '../services/api';
import { setUserData, ROLES } from '../utils/auth';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend returns: { token, username, role, userId, email }
      const response = await login({ 
        username: credentials.username, 
        password: credentials.password 
      });
      
      
  // Store token
  sessionStorage.setItem('token', response.token);

  // Store user data from backend response
  setUserData(response.role, response.userId, response.username);

  setIsAuthenticated(true);

  // Redirect based on role: admin -> dashboard, others -> reports
  const redirectPath = response.role === ROLES.ADMIN ? '/dashboard' : '/reports';
  window.location.href = redirectPath;
    } catch (err) {
      // Show a simple, user-friendly error. The axios interceptor no longer forces a reload
      // for login failures, so we can handle the error here and keep the user on the page.
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img
            src="/moveinsync-logo.jpg"
            alt="MoveInSync logo"
            className="moveinsync-logo"
            style={{ maxWidth: '220px', height: 'auto', borderRadius: '10px' }}
          />
          <p>Unified Billing & Reporting Platform</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* <div className="login-demo-info">
          <p>Default credentials:</p>
          <p><strong>admin / admin123</strong></p>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
