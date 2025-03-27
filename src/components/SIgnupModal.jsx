import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, collection, addDoc } from '../firebase';


const SIgnupModal = ({ setShowSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await user.reload();
      const updatedUser = auth.currentUser;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        username: updatedUser.displayName,
        email: user.email,
        createdAt: new Date()
      });

      setSuccess('Account created successfully!');
      setShowSignup(false); 
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
          <button className="delete" aria-label="close" onClick={() => setShowSignup(false)}></button>
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

            {error && <p className="has-text-danger">{error}</p>}
            {success && <p className="has-text-success">{success}</p>}

            <button className="button is-primary" type="submit">Sign Up</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SIgnupModal;