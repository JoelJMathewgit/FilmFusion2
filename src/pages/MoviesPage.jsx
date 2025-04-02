import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import MovieDetailsModal from '../components/MovieDetailsModal';

function MoviesPage({ user }) {  // Accept the user prop here
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortMethod, setSortMethod] = useState(null);
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
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  // Filter movies by search term
  let filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort movies based on the chosen method
  if (sortMethod === 'az') {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMethod === 'za') {
    filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortMethod === 'earliest') {
    filteredMovies.sort((a, b) => Number(a.year) - Number(b.year));
  } else if (sortMethod === 'latest') {
    filteredMovies.sort((a, b) => Number(b.year) - Number(a.year));
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="container">
      {/* Search Bar */}
      <div className="field" style={{ marginBottom: '1rem' }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Filter Button */}
      <div className="grid-container" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <button
              className="button"
              style={{ 
                backgroundColor: '#6B7280', 
                borderColor: '#6B7280', 
                color: 'white'
              }}
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

      {/* Pass the user prop to the modal */}
      <MovieDetailsModal 
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        user={user}
      />
    </div>
  );
}

export default MoviesPage;
