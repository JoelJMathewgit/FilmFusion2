/**
 * FavoritesPage.test.jsx
 * ------------------------
 * Unit tests for <FavoritesPage /> component using Vitest and React Testing Library.
 * Tests:
 * - Heading renders correctly
 * - Message shown for logged-in users with no favorites
 * - Favorite movies are displayed correctly when fetched from Firestore
 */

import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FavoritesPage from '../pages/FavoritesPage';

// Mock Firebase and Firestore
import { collection, getDocs } from 'firebase/firestore';
import { vi } from 'vitest';

// Mock Firebase module
vi.mock('../firebase', () => ({ db: {} }));

// Mock Firestore methods
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

describe('FavoritesPage Component', () => {
  /**
   * Test: Page heading renders
   */
  test('displays the Favorite Movies heading', () => {
    render(<FavoritesPage />);
    expect(
      screen.getByRole('heading', { name: /Favorite Movies/i })
    ).toBeInTheDocument();
  });

  /**
   * Test: Logged-in user with no favorites sees appropriate message
   */
  test('displays message when logged in user has no favorites', async () => {
    const fakeUser = { uid: '123', email: 'test@example.com' };

    // Simulate Firestore returning an empty list
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(<FavoritesPage user={fakeUser} />);
    const noFavoritesMessage = await screen.findByText(
      /You haven't favorited any movies yet./i
    );
    expect(noFavoritesMessage).toBeInTheDocument();
  });

  /**
   * Test: Logged-in user with a favorited movie sees it rendered
   */
  test('displays favorited movies for a logged in user', async () => {
    const fakeUser = { uid: '123', email: 'test@example.com' };

    const fakeFavorite = {
      id: 'movie1',
      title: 'Favorite Movie',
      year: 2021,
      poster: 'fav.jpg',
      plot: 'Favorite plot',
      rating: 5,
    };

    // Simulate Firestore returning one favorite movie document
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: fakeFavorite.id,
          data: () => fakeFavorite,
        },
      ],
    });

    render(<FavoritesPage user={fakeUser} />);
    const movieCard = await screen.findByText(/Favorite Movie/i);
    expect(movieCard).toBeInTheDocument();
  });
});
