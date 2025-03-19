import React from 'react';

const Header = ({ loggedInUser, setShowLogin }) => (
  <header style={{ position: 'relative' }}>
    <h1>Film Fusion</h1>
    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
      {loggedInUser ? (
        <button>{loggedInUser}</button>
      ) : (
        <button onClick={() => setShowLogin(true)}>Login</button>
      )}
    </div>
  </header>
);

export default Header;