import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const MovieDetailsModal = ({ movie, onClose, user }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // 🔍 Debug logs right at the top
  useEffect(() => {
    console.log('📦 MovieDetailsModal mounted. user:', user);
    console.log('🎬 Movie object:', movie);
    console.log('✅ user?.uid:', user?.uid);
    console.log('✅ movie?.id:', movie?.id);
  }, [user, movie]);

  // 🔐 Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !movie?.id) return;
      try {
        const favDocRef = doc(db, 'users', user.uid, 'favorites', movie.id);
        const favDocSnap = await getDoc(favDocRef);
        setIsFavorite(favDocSnap.exists());
      } catch (error) {
        console.error('❌ Error checking favorite status:', error);
      }
    };
    checkFavoriteStatus();
  }, [movie, user]);

  const toggleFavorite = async () => {
    console.log('❤️ toggleFavorite called');
    console.log('➡️ user:', user);
    console.log('➡️ movie:', movie);

    if (!user) {
      alert("You must be logged in to favorite movies!");
      return;
    }

    if (!movie?.id) {
      console.error("❌ Cannot favorite: movie ID is undefined");
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
      console.error("❌ Error toggling favorite:", error);
    }
  };

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
