import React, { useState } from 'react';
import { searchMovies } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Recommendations from './Recommendations';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await searchMovies(query);
      setResults(response.data.results);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const addToWatchlist = async (e, movie) => {
    e.preventDefault(); // Prevents the Link from triggering when clicking the button
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/watchlist/', {
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Added to watchlist!");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.detail || JSON.stringify(err.response.data);
        alert(errorMsg);
      } else {
        alert("Could not add to watchlist. Please make sure you are logged in.");
      }
    }
  };

  return (
  <div className="container mt-4">
    {/* SEARCH SECTION */}
    <form onSubmit={handleSearch} className="mb-4 d-flex justify-content-center">
      <input 
        type="text" 
        className="form-control w-50"
        placeholder="Search for a movie..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button type="submit" className="btn btn-primary ms-2">Search</button>
    </form>

    {/* SMART RECOMMENDATIONS - Only show when NOT searching */}
    {results.length === 0 && <Recommendations />}

    {/* SEARCH RESULTS GRID */}
    <div className="row">
      {results.map((movie) => (
        <div key={movie.id} className="col-6 col-md-4 col-lg-3 mb-4">
          {/* ... your existing movie card code ... */}
        </div>
      ))}
    </div>
  </div>
  );
}

export default MovieSearch;