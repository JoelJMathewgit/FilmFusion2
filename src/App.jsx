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
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginUsername, loginPassword);
      const user = userCredential.user;
      // Store the entire user object (with uid)
      setLoggedInUser(user); 
      setShowLogin(false);
      setLoginUsername('');
      setLoginPassword('');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Header 
        loggedInUser={loggedInUser} 
        setShowLogin={setShowLogin} 
        setShowSignup={setShowSignup} 
        handleLogout={handleLogout} 
      />

      <Routes>
        <Route path="/" element={<HomePage user={loggedInUser}/>} />
        <Route path="/movies" element={<MoviesPage user={loggedInUser} />} />
        <Route path="/favorites" element={<FavoritesPage user={loggedInUser} />} />
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
          setLoggedInUser={setLoggedInUser} 
        />
      )}
      {showSignup && <SignupModal setShowSignup={setShowSignup} />}
    </Router>
  );
}

export default App;
