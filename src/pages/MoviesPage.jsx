import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // Store entire movie object

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

  // Filter by search term
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="container">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading ? (
        <p>Loading movies...</p>
      ) : filteredMovies.length > 0 ? (
        <>
          <div className="grid-container">
            {currentMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                handleClick={() => setSelectedMovie(movie)} // Open modal with movie data
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={setCurrentPage}
          />
        </>
      ) : (
        <p>No movies found.</p>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setSelectedMovie(null)}></div>
          <div className="modal-content box">
            <h2 className="title">{selectedMovie.title || "No Title Available"}</h2>
            <p><strong>Rating:</strong> {selectedMovie.rating || "N/A"}</p>
            <p><strong>Release Year:</strong> {selectedMovie.releaseDate || "Unknown"}</p>
            <p><strong>Plot:</strong> {selectedMovie.plot || "No description available."}</p>
            <button className="button is-danger" onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
