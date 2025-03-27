import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginModal from './components/LoginModal'; // Import Login Modal
import SignupModal from './components/SignupModal'; // Import Signup Modal
import './styles.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoggedInUser(loginUsername); // Simulated login
    setShowLogin(false);
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Header loggedInUser={loggedInUser} setShowLogin={setShowLogin} setShowSignup={setShowSignup} handleLogout={handleLogout}/>

      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>

      {/* Login & Sign Up Modals */}
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
      {showSignup && (
        <SignupModal setShowSignup={setShowSignup} />
      )}
    </Router>
  );
}

export default App;
