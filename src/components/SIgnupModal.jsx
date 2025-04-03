/**
 * SignupModal Component
 * ----------------------
 * Handles new user registration using Firebase Authentication.
 * Creates a new user, updates display name, and saves user info to Firestore.
 *
 * Props:
 * - setShowSignup: Function to control visibility of the modal.
 */

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, collection, addDoc } from '../firebase';

const SignupModal = ({ setShowSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * handleSignup
   * ------------
   * Registers a new user with Firebase Auth and stores user data in Firestore.
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name
      await updateProfile(user, { displayName: username });
      await user.reload();
      const updatedUser = auth.currentUser;

      // Save user data in Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        username: updatedUser.displayName,
        email: user.email,
        createdAt: new Date()
      });

      setSuccess('Account created successfully!');
      setShowSignup(false); // Close modal
    } catch (error) {
      setError(error.message || 'Failed to create account');
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => setShowSignup(false)}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Sign Up</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => setShowSignup(false)}
          ></button>
        </header>

        <section className="modal-card-body">
          <form onSubmit={handleSignup}>
            <div className="field">
              <label className="label">Username</label>
              <input
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
            </div>

            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
              />
            </div>

            <div className="field">
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>

            {/* Feedback messages */}
            {error && <p className="has-text-danger">{error}</p>}
            {success && <p className="has-text-success">{success}</p>}

            <button
              className="button is-primary"
              type="submit"
              style={{
                backgroundColor: '#E1544B',
                borderColor: '#E1544B',
                color: 'white',
              }}
            >
              Sign Up
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SignupModal;
