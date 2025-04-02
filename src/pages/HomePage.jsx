/**
 * HomePage Component
 * ------------------
 * This is the landing page of the Film Fusion application.
 * It displays a hero section with branding, the top 5 rated movies,
 * and the latest 8 releases from the Firestore database.
 *
 * Props:
 * - user: The currently authenticated user object.
 */

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';

function HomePage({ user }) {
  // State to hold top-rated movies
  const [topMovies, setTopMovies] = useState([]);

  // State to hold latest released movies
  const [latestMovies, setLatestMovies] = useState([]);

  // State to track which movie is selected (for the modal)
  const [selectedMovie, setSelectedMovie] = useState(null);

  /**
   * useEffect - Fetches movie data on component mount.
   * It retrieves all movies from the database, then sorts them:
   * - By rating (top 5)
   * - By release date (latest 8)
   */
  useEffect(() => {
    const fetchMovies = async () => {
      const movieCollection = collection(db, 'movies');
      const movieSnapshot = await getDocs(movieCollection);

      // Convert Firestore documents to usable JS objects
      const movieList = movieSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get top 5 movies by rating
      const sortedByRating = [...movieList]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      // Get latest 8 movies by release date
      const sortedByDate = [...movieList]
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 8);

      setTopMovies(sortedByRating);
      setLatestMovies(sortedByDate);
    };

    fetchMovies();
  }, []);

  return (
    <>
      {/* Hero Section with branding and subtitle */}
      <div
        style={{
          backgroundImage: 'url("/hero-background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%'
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            textAlign: 'left',
            paddingLeft: '10vw'
          }}
        >
          {/* Hero Logo */}
          <img
            src="/film-fusion-hero-logo.png"
            alt="Film Fusion Hero Logo"
            style={{ maxWidth: '600px', width: '100%', display: 'block' }}
          />
          {/* Subtitle */}
          <p
            className="subtitle has-text-white mt-6"
            style={{ fontSize: '1.5rem' }}
          >
            Your ultimate source for high-rated movies, latest releases, and everything in between.
          </p>
        </div>
      </div>

      {/* Main Content: Top Rated Movies */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <h2 className="title is-3 has-text-black">Top 5 Rated Movies</h2>
        <div className="columns">
          {topMovies.map(movie => (
            <div className="column is-one-fifth" key={movie.id}>
              <MovieCard 
                movie={movie} 
                handleClick={() => setSelectedMovie(movie)} 
              />
            </div>
          ))}
        </div>

        {/* Main Content: Latest Movies */}
        <h2 className="title is-3 has-text-black">Latest 8 Movies</h2>
        <div className="columns is-multiline">
          {latestMovies.map(movie => (
            <div className="column is-one-quarter" key={movie.id}>
              <MovieCard 
                movie={movie} 
                handleClick={() => setSelectedMovie(movie)} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal to display movie details */}
      <MovieDetailsModal 
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        user={user}
      />
    </>
  );
}

export default HomePage;
