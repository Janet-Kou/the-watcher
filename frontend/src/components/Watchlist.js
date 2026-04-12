import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Watchlist</h2>
        {/* FILTER DROPDOWN */}
        <select 
          className="form-select w-25" 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Movies</option>
          <option value="plan_to_watch">Plan to Watch</option>
          <option value="watched">Watched</option>
        </select>
      </div>

      {movies.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <div className="row">
          {movies
            .filter(item => filter === 'all' || item.status === filter) // Logic for filtering
            .map((item) => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <h6 className="card-title text-truncate">{item.title}</h6>
                  
                  {/* WATCH STATUS BADGE */}
                  <span className="badge bg-primary mb-2 d-block" style={{ textTransform: 'capitalize' }}>
                    {item.status.replace(/_/g, ' ')}
                  </span>

                  {/* TOGGLE STATUS BUTTON */}
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

                  {/* RATING INPUT */}
                  <input 
                    type="number" 
                    min="1" max="5" 
                    placeholder="Rating (1-5)"
                    className="form-control form-control-sm mb-2"
                    defaultValue={item.rating || ''}
                    onBlur={(e) => updateRating(item.id, e.target.value)}
                  />

                  {/* REMOVE BUTTON */}
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