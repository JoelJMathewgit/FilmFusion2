import React from 'react';

const LoginModal = ({
  loginUsername,
  loginPassword,
  setLoginUsername,
  setLoginPassword,
  handleLoginSubmit,
  setShowLogin
}) => (
  <div className="modal is-active">
    <div className="modal-background" onClick={() => setShowLogin(false)}></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">Login</p>
        <button className="delete" aria-label="close" onClick={() => setShowLogin(false)}></button>
      </header>
      <section className="modal-card-body">
        <form onSubmit={handleLoginSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Enter username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="button is-primary" type="submit">Login</button>
        </form>
      </section>
    </div>
  </div>
);

export default LoginModal;
