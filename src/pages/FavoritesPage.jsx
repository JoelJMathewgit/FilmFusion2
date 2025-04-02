import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';

function FavoritesPage({ user }) {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const favoritesRef = collection(db, 'users', user.uid, 'favorites');
        const querySnapshot = await getDocs(favoritesRef);
        const favs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFavoriteMovies(favs);
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="container">
      <h1 className="title">Favorite Movies</h1>
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
                handleClick={() => setSelectedMovie(movie)}
              />
            </div>
          ))}
        </div>
      )}

      <MovieDetailsModal 
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        user={user} // Pass the full user object here
      />
    </div>
  );
}

export default FavoritesPage;
