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
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortMethod, setSortMethod] = useState(null);

  // For dropdown toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle sorting
  const handleSort = (method) => {
    setSortMethod(method);
    setIsDropdownOpen(false); // Close dropdown after selection
    setCurrentPage(1);        // Reset to page 1 when sorting changes
  };

  // 1) Filter by search term
  let filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) Sort based on the chosen method
  if (sortMethod === 'az') {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMethod === 'za') {
    filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortMethod === 'earliest') {
    filteredMovies.sort((a, b) => Number(a.year) - Number(b.year)); // Earliest to Latest
  } else if (sortMethod === 'latest') {
    filteredMovies.sort((a, b) => Number(b.year) - Number(a.year)); // Latest to Earliest
  }

  // 3) Pagination
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleToggleMovie = (movie) => {
    if (selectedMovie && selectedMovie.id === movie.id){
      setSelectedMovie(null)
    }
    else{
      setSelectedMovie(movie);
    }
  }

  return (
    <div className="container">
      {/* Search Bar (bigger, above) */}
      <div className="field" style={{ marginBottom: '1rem' }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Filter Button (below search bar, aligned right) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <button
              className="button is-medium"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={toggleDropdown}
            >
              <span>Filter</span>
              <span className="icon is-small">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <button className="dropdown-item" onClick={() => handleSort('az')}>
                A–Z
              </button>
              <button className="dropdown-item" onClick={() => handleSort('za')}>
                Z–A
              </button>
              <button className="dropdown-item" onClick={() => handleSort('earliest')}>
                Earliest to Latest
              </button>
              <button className="dropdown-item" onClick={() => handleSort('latest')}>
                Latest to Earliest
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p>Loading movies...</p>
      ) : filteredMovies.length > 0 ? (
        <>
          <div className="grid-container">
            {currentMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                selectedMovieId={selectedMovie ? selectedMovie.id : null}
                handleClick={() => setSelectedMovie(movie)}
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
      {selectedMovie && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setSelectedMovie(null)}></div>
          <div className="modal-content box">
            <h2 className="title has-text-black">
              {selectedMovie.title || "No Title Available"}
            </h2>
            <p><strong>Rating:</strong> {selectedMovie.rating || "N/A"}</p>
            <p><strong>Year:</strong> {selectedMovie.year || "Unknown"}</p>
            <p><strong>Plot:</strong> {selectedMovie.plot || "No description available."}</p>
            <button className="button is-danger" onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
