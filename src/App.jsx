import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import Pagination from './components/Pagination';
import LoginModal from './components/LoginModal';
import './styles.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 18;
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoggedInUser(loginUsername);
    setShowLogin(false);
    setLoginUsername('');
    setLoginPassword('');
  };

  let content;
  if (isLoading) {
    content = <p>Loading movies...</p>;
  } else if (filteredMovies.length > 0) {
    content = currentMovies.map(movie => (
      <MovieCard
        key={movie.id}
        movie={movie}
        selectedMovieId={selectedMovieId}
        handleClick={handleClick}
      />
    ));
  } else {
    content = <p>No movies found.</p>;
  }

  return (
    <div>
      <Header loggedInUser={loggedInUser} setShowLogin={setShowLogin} />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid-container">
        {content}
      </div>
      {!isLoading && filteredMovies.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      )}
      {showLogin && (
        <LoginModal
          loginUsername={loginUsername}
          loginPassword={loginPassword}
          setLoginUsername={setLoginUsername}
          setLoginPassword={setLoginPassword}
          handleLoginSubmit={handleLoginSubmit}
          setShowLogin={setShowLogin}
        />
      )}
    </div>
  );
}

export default App;