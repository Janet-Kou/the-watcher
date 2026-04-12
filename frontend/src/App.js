import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import MovieSearch from './components/MovieSearch';
import MovieDetails from './components/MovieDetails';
import Watchlist from './components/Watchlist';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '20px', backgroundColor: '#282c34', color: 'white' }}>
          <h1 style={{ margin: 0 }}>The Watcher</h1>
          <div style={{ marginTop: '10px' }}>
            <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
            <Link to="/login" style={{ color: 'white', marginRight: '15px' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', marginRight: '15px' }}>Register</Link>
            <Link to="/watchlist" style={{ color: 'white' }}>Watchlist</Link>
          </div>
        </nav>

        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MovieSearch />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;