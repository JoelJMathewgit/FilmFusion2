/**
 * App Component
 * ----------------
 * Main entry point of the Film Fusion application.
 * Handles:
 * - Routing across pages
 * - Authentication state (login/signup modals)
 * - Header navigation and user session management
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './styles.css';

function App() {
  // User session state
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Modal visibility
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Temporary login form input state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  /**
   * handleLoginSubmit
   * ------------------
   * Signs in a user with Firebase authentication.
   * Updates app state and hides the login modal on success.
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginUsername, loginPassword);
      const user = userCredential.user;
      setLoggedInUser(user);
      setShowLogin(false);
      setLoginUsername('');
      setLoginPassword('');
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * handleLogout
   * -------------
   * Clears the current user session.
   */
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      {/* Top Navigation */}
      <Header 
        loggedInUser={loggedInUser} 
        setShowLogin={setShowLogin} 
        setShowSignup={setShowSignup} 
        handleLogout={handleLogout} 
      />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage user={loggedInUser} />} />
        <Route path="/movies" element={<MoviesPage user={loggedInUser} />} />
        <Route path="/favorites" element={<FavoritesPage user={loggedInUser} />} />
      </Routes>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          loginUsername={loginUsername}
          loginPassword={loginPassword}
          setLoginUsername={setLoginUsername}
          setLoginPassword={setLoginPassword}
          handleLoginSubmit={handleLoginSubmit}
          setShowLogin={setShowLogin}
          setLoggedInUser={setLoggedInUser}
        />
      )}

      {/* Signup Modal */}
      {showSignup && <SignupModal setShowSignup={setShowSignup} />}
    </Router>
  );
}

export default App;
