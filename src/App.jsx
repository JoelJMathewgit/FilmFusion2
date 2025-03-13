import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './styles.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 18;

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const movieCollection = collection(db, 'movies');
      const movieSnapshot = await getDocs(movieCollection);
      const movieList = movieSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovies(movieList);
      setIsLoading(false);
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleClick = (movie) => {
    if (selectedMovieId === movie.id) {
      setSelectedMovieId(null);
    } else {
      setSelectedMovieId(movie.id);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  let content;
  if (isLoading) {
    content = <p>Loading movies...</p>;
  } else if (filteredMovies.length > 0) {
    content = currentMovies.map((movie) => {
      let movieContent;
      if (selectedMovieId === movie.id) {
        let plotText;
        if (movie.plot) {
          plotText = movie.plot;
        } else {
          plotText = "No additional information available.";
        }

        movieContent = (
          <div className="movie-details">
            <h3>{movie.title} ({movie.year})</h3>
            <img src={movie.poster} alt={movie.title} />
            <p>{plotText}</p>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <button onClick={() => setSelectedMovieId(null)}>Back</button>
          </div>
        );
      } else {
        movieContent = (
          <div>
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
            <button onClick={() => handleClick(movie)}>Show Details</button>
          </div>
        );
      }
      return (
        <div className="movie-card" key={movie.id}>
          {movieContent}
        </div>
      );
    });
  } else {
    content = <p>No movies found.</p>;
  }

  return (
    <div>
      <header>
        <h1>Film Fusion</h1>
      </header>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid-container">
        {content}
      </div>
      {!isLoading && filteredMovies.length > 0 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;