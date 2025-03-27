import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ loggedInUser, setShowLogin, setShowSignup, handleLogout }) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <svg width="120" height="30" viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 110L10 40L50 0L100 50L70 80L110 120L50 160L0 110Z" fill="#00D1B2"/>
          </svg>
          <strong>Film Fusion</strong>
        </Link>

        {/* Mobile Navbar Toggle */}
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

      {/* Navbar Menu */}
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/">Home</Link>
          <Link className="navbar-item" to="/movies">Movies</Link>
        </div>

        {/* Right Side - Login & Sign Up */}
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {loggedInUser ? (
                <div className={`dropdown ${dropdownActive ? 'is-active' : ''}`}>
                  <div className="dropdown-trigger">
                    <button 
                      className="button is-primary" 
                      aria-haspopup="true" 
                      aria-controls="dropdown-menu"
                      onClick={() => setDropdownActive(!dropdownActive)}
                    >
                      <span><strong>{loggedInUser}</strong></span>
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
                          navigate('/favorites')
                        }}
                      >
                        Favorite Movies
                      </a>  
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button className="button is-light" onClick={() => setShowLogin(true)}>
                    Log in
                  </button>
                  <button className="button is-primary" onClick={() => setShowSignup(true)}>
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
