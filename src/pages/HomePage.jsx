import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';

function HomePage({ user }) {  // Accept the user prop here
  const [topMovies, setTopMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const movieCollection = collection(db, 'movies');
      const movieSnapshot = await getDocs(movieCollection);
      const movieList = movieSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const sortedByRating = [...movieList]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
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
      {/* Hero Section */}
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
          padding: 0,
          margin: 0,
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
          <img
            src="/film-fusion-hero-logo.png"
            alt="Film Fusion Hero Logo"
            style={{ maxWidth: '600px', width: '100%', display: 'block' }}
          />
          <p
            className="subtitle has-text-white mt-6"
            style={{ fontSize: '1.5rem' }}
          >
            Your ultimate source for high-rated movies, latest releases, and everything in between.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <h2 className="title is-3 has-text-black">Top 5 Rated Movies</h2>
        <div className="columns">
          {topMovies.map(movie => (
            <div className="column is-one-fifth" key={movie.id}>
              <MovieCard movie={movie} handleClick={() => setSelectedMovie(movie)} />
            </div>
          ))}
        </div>

        <h2 className="title is-3 has-text-black">Latest 8 Movies</h2>
        <div className="columns is-multiline">
          {latestMovies.map(movie => (
            <div className="column is-one-quarter" key={movie.id}>
              <MovieCard movie={movie} handleClick={() => setSelectedMovie(movie)} />
            </div>
          ))}
        </div>
      </div>

      {/* Pass the user prop to the modal */}
      <MovieDetailsModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)}
        user={user}
      />
    </>
  );
}

export default HomePage;
