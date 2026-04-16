import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Recommendations = () => {
    const [sections, setSections] = useState([]); // Array of { title, movies }
    const API_KEY = "1664d90cf01e2096cc12e14b3a7a7623";

    useEffect(() => {
        const fetchAllRecs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://127.0.0.1:8000/api/recommendations/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.type === "personalized") {
                    // Fetch "Similar" movies for every top-rated movie found
                    const sectionPromises = res.data.sources.map(async (source) => {
                        const tmdbRes = await axios.get(
                            `https://api.themoviedb.org/3/movie/${source.tmdb_id}/similar?api_key=${API_KEY}`
                        );
                        return {
                            title: `Because you liked ${source.title}`,
                            movies: tmdbRes.data.results.slice(0, 6)
                        };
                    });
                    const allSections = await Promise.all(sectionPromises);
                    setSections(allSections);
                } else {
                    // Fallback to Trending
                    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
                    setSections([{
                        title: "Trending Movies for You",
                        movies: tmdbRes.data.results.slice(0, 6)
                    }]);
                }
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
            }
        };
        fetchAllRecs();
    }, []);

    return (
        <div className="container mt-4">
            {sections.map((section, index) => (
                <div key={index} className="mb-5 p-4 bg-light rounded shadow-sm">
                    <h5 className="mb-3 fw-bold text-primary">✨ {section.title}</h5>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
                        {section.movies.map(movie => (
                            <div key={movie.id} className="col">
                                <Link to={`/movie/${movie.id}`} className="text-decoration-none text-dark">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                            className="card-img-top rounded" 
                                            alt={movie.title} 
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="p-2 text-center">
                                            <p className="small fw-bold mb-0 text-truncate">{movie.title}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Recommendations;