import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToWatchlist } from '../services/api'; 

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Use your TMDB Key here
        const API_KEY = '1664d90cf01e2096cc12e14b3a7a7623'; 
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        setMovie(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToWatchlist = async () => {
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

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
  if (!movie) return <div style={{ color: 'white', padding: '20px' }}>Movie not found.</div>;

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#141414', minHeight: '100vh' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        ← Back to Search
      </button>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          style={{ width: '300px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
        />
        
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1>{movie.title}</h1>
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#bbb' }}>{movie.tagline}</p>
          
          <div style={{ margin: '20px 0' }}>
            <button 
              onClick={handleAddToWatchlist} 
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#e50914', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                cursor: 'pointer' 
              }}
            >
              + Add to Watchlist
            </button>
          </div>

          <h3>Overview</h3>
          <p style={{ lineHeight: '1.6', maxWidth: '600px' }}>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;