import React from 'react';

const Header = ({ loggedInUser, setShowLogin }) => {
  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        {/* Logo / Branding */}
        <a className="navbar-item" href="/">
          <svg width="120" height="30" viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 110L10 40L50 0L100 50L70 80L110 120L50 160L0 110Z" fill="#00D1B2"/>
          </svg>
          <strong>Film Fusion</strong>
        </a>

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

      {/* Navbar Items */}
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/">Home</a>
          <a className="navbar-item" href="/movies">Movies</a>

          {/* Dropdown Example */}
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">More</a>
            <div className="navbar-dropdown">
              <a className="navbar-item" href="/about">About</a>
              <a className="navbar-item" href="/jobs">Jobs</a>
              <a className="navbar-item" href="/contact">Contact</a>
              <hr className="navbar-divider" />
              <a className="navbar-item" href="/report">Report an Issue</a>
            </div>
          </div>
        </div>

        {/* Right Side Login Button */}
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {loggedInUser ? (
                <a className="button is-primary">
                  <strong>{loggedInUser}</strong>
                </a>
              ) : (
                <button className="button is-light" onClick={() => setShowLogin(true)}>
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
