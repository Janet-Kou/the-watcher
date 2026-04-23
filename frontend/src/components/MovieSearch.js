import React, { useEffect, useState } from 'react';
import { searchMovies, getTrendingMovies, getSuggestedMovies } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeSections = async () => {
      try {
        const [trendingRes, suggestedRes] = await Promise.all([
          getTrendingMovies(),
          getSuggestedMovies(),
        ]);
        setTrending(trendingRes.data.results || []);
        setSuggested(suggestedRes.data.results || []);
      } catch (err) {
        console.error('Failed to load home sections', err);
        setError('Unable to load suggested and trending movies.');
      }
    };

    fetchHomeSections();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchMovies(query);
      const data = response.data.results || [];
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (e, movie) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/watchlist/', {
        movie_id: movie.tmdb_id || movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Added to watchlist!');
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.detail || JSON.stringify(err.response.data);
        alert(errorMsg);
      } else {
        alert('Could not add to watchlist. Please make sure you are logged in.');
      }
    }
  };

  const renderMovieCard = (movie) => {
    const movieId = movie.tmdb_id || movie.id;

    return (
      <div key={movieId} className="col-6 col-md-4 col-lg-3 mb-4">
        <div className="card h-100 shadow-sm">
          <Link to={`/movie/${movieId}`} className="text-decoration-none text-dark">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                className="card-img-top"
                alt={movie.title}
                style={{ height: '320px', objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '320px' }}>
                No image available
              </div>
            )}
          </Link>
          <div className="card-body">
            <h5 className="card-title small mb-2">{movie.title}</h5>
            <p className="card-text text-muted mb-1">
              {movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown Year'}
            </p>
            <p className="card-text mb-2"><small>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</small></p>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={(e) => addToWatchlist(e, movie)}
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSearch} className="mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search for a movie in our catalog..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ms-2">Search</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {query.trim() ? (
        <>
          {loading && <div className="text-center text-muted">Searching...</div>}
          {!loading && results.length === 0 && <div className="text-center text-muted">No movies found for "{query}".</div>}
          <div className="row">
            {results.map((movie) => renderMovieCard(movie))}
          </div>
        </>
      ) : (
        <>
          <section className="mb-5">
            <h2>Suggested for you</h2>
            <div className="row">
              {suggested.length > 0 ? (
                suggested.map((movie) => renderMovieCard(movie))
              ) : (
                <div className="text-muted">Loading suggested movies...</div>
              )}
            </div>
          </section>

          <section>
            <h2>Trending right now</h2>
            <div className="row">
              {trending.length > 0 ? (
                trending.map((movie) => renderMovieCard(movie))
              ) : (
                <div className="text-muted">Loading trending movies...</div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieSearch;
