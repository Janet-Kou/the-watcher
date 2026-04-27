import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', credentials.username);
      if (onLogin) onLogin();
      navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <h3 className="mb-4 text-center fw-bold">Login</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>
        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-muted small">Forgot your password?</Link>
        </div>
        <hr />
        <p className="text-center text-muted small mb-0">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;