import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '20px', backgroundColor: '#282c34', color: 'white' }}>
          <h1 style={{ margin: 0 }}>The Watcher</h1>
          <div style={{ marginTop: '10px' }}>
            <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
            <Link to="/login" style={{ color: 'white', marginRight: '15px' }}>Login</Link>
            <Link to="/watchlist" style={{ color: 'white' }}>Watchlist</Link>
          </div>
        </nav>

        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<h2>Movie Search coming soon...</h2>} />
            <Route path="/login" element={<h2>Login Page coming soon...</h2>} />
            <Route path="/watchlist" element={<h2>Your Watchlist coming soon...</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;