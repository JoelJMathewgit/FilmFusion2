import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
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
        <Route path="/" element={<MoviesPage />} />
        <Route path="/home" element={<HomePage />} />
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
