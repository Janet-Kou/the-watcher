import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      // Direct call for speed, or use your Django proxy
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=1664d90cf01e2096cc12e14b3a7a7623`);
      setMovie(res.data);
    };
    fetchDetails();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{width: '300px'}} />
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p>{movie.overview}</p>
    </div>
  );
}

export default MovieDetails;