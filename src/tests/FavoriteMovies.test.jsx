import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FavoritesPage from '../pages/FavoritesPage';

// -- New imports for Firestore mocks
import { collection, getDocs } from 'firebase/firestore';
import { vi } from 'vitest';

// -- Mock Firebase and Firestore functions for favorites tests
vi.mock('../firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

describe('FavoriteMovies Component', () => {
  test('displays the Favorite Movies heading', () => {
    render(<FavoritesPage />);
    expect(screen.getByRole('heading', { name: /Favorite Movies/i })).toBeInTheDocument();
  });

  // Test: Logged in user with no favorites sees a message indicating no favorites
  test("displays message when logged in user has no favorites", async () => {
    const fakeUser = { uid: '123', email: 'test@example.com' };
    // Mock getDocs to return no favorite movies
    getDocs.mockResolvedValueOnce({ docs: [] });
    render(<FavoritesPage user={fakeUser} />);
    const noFavoritesMessage = await screen.findByText(/You haven't favorited any movies yet./i);
    expect(noFavoritesMessage).toBeInTheDocument();
  });

  // Test: Logged in user with a favorite movie sees that movie on the Favorites page
  test('displays favorited movies for a logged in user', async () => {
    const fakeUser = { uid: '123', email: 'test@example.com' };
    const fakeFavorite = { 
      id: 'movie1', 
      title: 'Favorite Movie', 
      year: 2021, 
      poster: 'fav.jpg', 
      plot: 'Favorite plot', 
      rating: 5 
    };
    // Mock getDocs to return one favorite movie document
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: fakeFavorite.id, data: () => fakeFavorite }
      ]
    });
    render(<FavoritesPage user={fakeUser} />);
    const movieCard = await screen.findByText(/Favorite Movie/i);
    expect(movieCard).toBeInTheDocument();
  });
});