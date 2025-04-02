/**
 * FavoritesPage Component
 * ------------------------
 * Displays the list of a logged-in user's favorite movies.
 * Allows users to view a modal with movie details upon clicking a movie card.
 * 
 * Props:
 * - user: The current authenticated user (object with `uid`), or null if not logged in.
 */

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase Firestore instance
import MovieCard from '../components/MovieCard'; // UI card component to display movie preview
import MovieDetailsModal from '../components/MovieDetailsModal'; // Modal for displaying detailed movie info

function FavoritesPage({ user }) {
  // State to hold the list of favorite movies
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // State to track the currently selected movie (for showing in the modal)
  const [selectedMovie, setSelectedMovie] = useState(null);

  /**
   * useEffect Hook
   * --------------
   * Fetches the current user's favorite movies from Firestore
   * whenever the user object changes (i.e., login/logout).
   */
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return; // Exit early if no user is logged in

      try {
        // Reference to the 'favorites' subcollection under the current user's document
        const favoritesRef = collection(db, 'users', user.uid, 'favorites');

        // Fetch all favorite movie documents
        const querySnapshot = await getDocs(favoritesRef);

        // Map Firestore documents into plain JavaScript objects
        const favs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setFavoriteMovies(favs); // Update state with fetched favorites
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1 
        className="title has-text-black" 
        style={{ borderBottom: '2px solid #E1544B', paddingBottom: '0.5rem' }}
      >
        Favorite Movies
      </h1>

      {/* Conditional rendering based on user authentication and movie availability */}
      {!user ? (
        <p>Please log in to view your favorites.</p>
      ) : favoriteMovies.length === 0 ? (
        <p>You haven't favorited any movies yet.</p>
      ) : (
        <div className="columns is-multiline">
          {favoriteMovies.map(movie => (
            <div className="column is-one-quarter" key={movie.id}>
              <MovieCard 
                movie={movie} 
                handleClick={() => setSelectedMovie(movie)} // Set selected movie to trigger modal
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal to show detailed info about the selected movie */}
      <MovieDetailsModal 
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)} // Closes modal
        user={user}
      />
    </div>
  );
}

export default FavoritesPage;
