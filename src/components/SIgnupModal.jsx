import React from 'react';

const SignupModal = ({ setShowSignup }) => (
  <div className="modal is-active">
    <div className="modal-background" onClick={() => setShowSignup(false)}></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">Sign Up</p>
        <button className="delete" aria-label="close" onClick={() => setShowSignup(false)}></button>
      </header>
      <section className="modal-card-body">
        <form>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input className="input" type="text" placeholder="Enter username" required />
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input className="input" type="email" placeholder="Enter email" required />
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input className="input" type="password" placeholder="Enter password" required />
            </div>
          </div>

          <button className="button is-primary">Sign Up</button>
        </form>
      </section>
    </div>
  </div>
);

export default SignupModal;
