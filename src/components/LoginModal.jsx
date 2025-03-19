import React from 'react';

const LoginModal = ({
  loginUsername,
  loginPassword,
  setLoginUsername,
  setLoginPassword,
  handleLoginSubmit,
  setShowLogin
}) => (
  <div className="login-modal">
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setShowLogin(false)}>Cancel</button>
    </div>
  </div>
);

export default LoginModal;