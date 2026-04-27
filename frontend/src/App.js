import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import MovieSearch from './components/MovieSearch';
import MovieDetails from './components/MovieDetails';
import Watchlist from './components/Watchlist';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ onLogout }) {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold fs-4" to="/">🎬 The Watcher</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {token && (
            <li className="nav-item">
              <Link className="nav-link" to="/watchlist">Watchlist</Link>
            </li>
          )}
        </ul>
        <ul className="navbar-nav ms-auto align-items-center">
          {token ? (
            <>
              <li className="nav-item me-3">
                <span className="navbar-text text-light">
                  Logged in as <strong>{username}</strong>
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  const [, forceUpdate] = useState(0);
  const handleAuthChange = useCallback(() => forceUpdate(n => n + 1), []);

  return (
    <Router>
      <div className="App">
        <Navbar onLogout={handleAuthChange} />
        <div className="container-fluid px-4 py-4">
          <Routes>
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/register" element={<Register onRegister={handleAuthChange} />} />
            <Route path="/login" element={<Login onLogin={handleAuthChange} />} />
            <Route path="/" element={<MovieSearch />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;