import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ loggedInUser, setShowLogin, setShowSignup, handleLogout }) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const navigate = useNavigate();

  // Determine what to display: if loggedInUser is an object, show email or displayName; otherwise, use it directly.
  const displayUser =
    loggedInUser && typeof loggedInUser === 'object'
      ? loggedInUser.displayName || loggedInUser.email
      : loggedInUser;

  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img 
            src="/film-fusion-logo.png" 
            alt="Film Fusion Logo" 
            style={{ height: '500px' }} 
          />
        </Link>

        <button
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={() => {
            document.querySelector('.navbar-menu').classList.toggle('is-active');
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/">Home</Link>
          <Link className="navbar-item" to="/movies">Movies</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {loggedInUser ? (
                <div className={`dropdown ${dropdownActive ? 'is-active' : ''}`}>
                  <div className="dropdown-trigger">
                    <button 
                      className="button" 
                      aria-haspopup="true" 
                      aria-controls="dropdown-menu"
                      onClick={() => setDropdownActive(!dropdownActive)}
                      style={{ 
                        backgroundColor: '#E1544B', 
                        borderColor: '#E1544B', 
                        color: 'white',
                      }}
                    >
                      <span><strong>{displayUser}</strong></span>
                      <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <a
                        href="#"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                          setDropdownActive(false);
                          navigate('/');
                        }}
                      >
                        Logout
                      </a>
                      <a
                        href="#"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownActive(false);
                          navigate('/favorites');
                        }}
                      >
                        Favorite Movies
                      </a>  
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    className="button is-light"
                    onClick={() => setShowLogin(true)}
                  >
                    Log in
                  </button>
                  <button 
                    className="button"
                    style={{ 
                      backgroundColor: '#E1544B', 
                      borderColor: '#E1544B', 
                      color: 'white',
                    }}
                    onClick={() => setShowSignup(true)}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
