/**
 * AuthContext
 * --------------------
 * Provides Firebase Authentication context across the app.
 * 
 * Usage:
 * - Wrap your app in <AuthProvider> to access auth state globally.
 * - Use `useAuth()` to access the `user` object anywhere in the app.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a context for authentication state
const AuthContext = createContext();

/**
 * AuthProvider Component
 * ----------------------
 * Initializes Firebase auth and tracks the logged-in user.
 * Makes the `user` object available via context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Set up Firebase listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * ------------
 * Provides easy access to the authentication context.
 * @returns {Object} - Contains `user`
 */
export function useAuth() {
  return useContext(AuthContext);
}
