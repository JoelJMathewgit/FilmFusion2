import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';

function HomePage() {
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

      const sortedByRating = [...movieList].sort((a, b) => b.rating - a.rating).slice(0, 5);
      const sortedByDate = [...movieList].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 8);

      setTopMovies(sortedByRating);
      setLatestMovies(sortedByDate);
    };
    fetchMovies();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero is-large is-info">
        <div className="hero-body">
          <p className="title has-text-black">Film Fusion</p>
          <p className="subtitle has-text-black">
            Your ultimate source for high-rated movies, latest releases, and everything in between.
          </p>
        </div>
      </section>

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

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setSelectedMovie(null)}></div>
          <div className="modal-content box">
            <h2 className="title has-text-black">{selectedMovie.title || "No Title Available"}</h2>
            <p><strong>Rating:</strong> {selectedMovie.rating || "N/A"}</p>
            <p><strong>Release Year:</strong> {selectedMovie.releaseDate || "Unknown"}</p>
            <p><strong>Plot:</strong> {selectedMovie.plot || "No description available."}</p>
            <button className="button is-danger" onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
