/**
 * MovieDetailsModal Component
 * ----------------------------
 * Displays detailed movie information in a modal.
 * Allows authenticated users to favorite/unfavorite a movie,
 * which is stored in their Firestore favorites collection.
 *
 * Props:
 * - movie: Movie object to display (null hides the modal)
 * - onClose: Function to close the modal
 * - user: Currently authenticated user (for managing favorites)
 */

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const MovieDetailsModal = ({ movie, onClose, user }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  /**
   * Check if the current movie is already marked as a favorite
   * when the modal opens or the user/movie changes.
   */
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !movie?.id) return;

      try {
        const favDocRef = doc(db, 'users', user.uid, 'favorites', movie.id);
        const favDocSnap = await getDoc(favDocRef);
        setIsFavorite(favDocSnap.exists());
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [movie, user]);

  /**
   * Toggles favorite status in Firestore
   * - Adds the movie to the user's favorites if not favorited
   * - Removes it from favorites if already favorited
   */
  const toggleFavorite = async () => {
    if (!user) {
      alert("You must be logged in to favorite movies!");
      return;
    }

    if (!movie?.id) {
      console.error("Cannot favorite: movie ID is undefined");
      return;
    }

    const favDocRef = doc(db, 'users', user.uid, 'favorites', movie.id);

    try {
      if (isFavorite) {
        await deleteDoc(favDocRef);
        setIsFavorite(false);
      } else {
        await setDoc(favDocRef, {
          title: movie.title || "",
          rating: movie.rating || "",
          year: movie.year || "",
          plot: movie.plot || "",
          poster: movie.poster || movie.image || ""
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Do not render the modal if no movie is selected
  if (!movie) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>

      <div className="modal-content box">
        <h2 className="title">{movie.title || "No Title Available"}</h2>
        <p><strong>Rating:</strong> {movie.rating || "N/A"}</p>
        <p><strong>Release Year:</strong> {movie.year || "Unknown"}</p>
        <p><strong>Plot:</strong> {movie.plot || "No description available."}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          {/* Close Modal Button */}
          <button
            className="button is-danger"
            onClick={onClose}
            style={{
              backgroundColor: '#E1544B',
              borderColor: '#E1544B',
              color: 'white'
            }}
          >
            Close
          </button>

          {/* Favorite Toggle (Heart Icon) */}
          <button
            className="button"
            onClick={toggleFavorite}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
            aria-label="Toggle Favorite"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
