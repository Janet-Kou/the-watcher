import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCatalogMovies } from '../services/api';

const MovieCatalog = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await getCatalogMovies();
        setMovies(response.data.results || []);
      } catch (err) {
        console.error('Catalog fetch failed', err);
        setError('Unable to load the movie catalog.');
      }
    };

    fetchCatalog();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Movie Catalog</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {movies.length === 0 && !error ? (
        <div className="text-center text-muted">Loading movies...</div>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <Link to={`/movie/${movie.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm">
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
                  <div className="card-body">
                    <h5 className="card-title small mb-2">{movie.title}</h5>
                    <p className="card-text text-muted mb-1">
                      {movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown Year'}
                    </p>
                    <p className="card-text mb-0"><small>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</small></p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCatalog;
