import React, { useState } from 'react';
import { searchMovies } from '../services/api';
import { Link } from 'react-router-dom';

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

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search for a movie..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>
          Search
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {results.map((movie) => (
          <Link 
            to={`/movie/${movie.id}`} 
            key={movie.id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ 
              width: '200px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <img 
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                  : 'https://via.placeholder.com/200x300?text=No+Poster'} 
                alt={movie.title} 
                style={{ width: '100%', borderRadius: '4px' }} 
              />
              <h3 style={{ fontSize: '1.1rem', margin: '10px 0' }}>{movie.title}</h3>
              <p>⭐ {movie.vote_average}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;