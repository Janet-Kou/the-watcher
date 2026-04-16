import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Recommendations from './Recommendations';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/watchlist/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this movie from your watchlist?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/watchlist/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setMovies(movies.filter(movie => movie.id !== itemId));
      alert("Removed successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'plan_to_watch' ? 'watched' : 'plan_to_watch';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/watchlist/${item.id}/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMovies(movies.map(m => m.id === item.id ? { ...m, status: newStatus } : m));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const updateRating = async (itemId, newRating) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:8000/api/watchlist/${itemId}/`, 
        { rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to save rating");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading your movies...</div>;

  return (
  <div className="container mt-4">
    {/* CENTERED HEADER SECTION */}
    <div className="text-center mb-5">
      <h2 className="fw-bold">My Watchlist</h2>
      <div className="d-flex justify-content-center mt-3">
        <select 
          className="form-select w-auto" 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Movies</option>
          <option value="plan_to_watch">Plan to Watch</option>
          <option value="watched">Watched</option>
        </select>
      </div>
    </div>

    {/* MOVIES GRID */}
    {movies.length === 0 ? (
      <p className="text-center mt-5">Your watchlist is empty. Go search for some movies!</p>
    ) : (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {movies
          .filter(item => filter === 'all' || item.status === filter)
          .map((item) => (
            <div key={item.id} className="col">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h6 className="card-title text-truncate">{item.title}</h6>
                  
                  {/* Status Badge */}
                  <span className="badge bg-primary mb-2 d-inline-block" style={{ textTransform: 'capitalize' }}>
                    {item.status.replace(/_/g, ' ')}
                  </span>

                  {/* Toggle Button */}
                  <button 
                    onClick={() => toggleStatus(item)}
                    className="btn btn-sm w-100 mb-2"
                    style={{ 
                      backgroundColor: item.status === 'watched' ? '#28a745' : 'transparent', 
                      color: item.status === 'watched' ? 'white' : '#007bff',
                      border: `1px solid ${item.status === 'watched' ? '#28a745' : '#007bff'}`
                    }}
                  >
                    {item.status === 'watched' ? '✓ Watched' : 'Mark as Watched'}
                  </button>

                  {/* Rating Input */}
                  <input 
                    type="number" 
                    min="1" max="5" 
                    placeholder="Rating (1-5)"
                    className="form-control form-control-sm mb-2"
                    defaultValue={item.rating || ''}
                    onBlur={(e) => updateRating(item.id, e.target.value)}
                  />

                  {/* Remove Link */}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-sm btn-link text-danger w-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
  );
};

export default Watchlist;