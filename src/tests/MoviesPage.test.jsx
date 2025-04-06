/**
 * MoviesPage.test.jsx
 * ---------------------
 * Full behavioral test suite for the <MoviesPage /> component.
 *
 * Tests:
 * - Loading state and initial render
 * - Search filter functionality
 * - Modal toggle on "Show Details"
 * - Pagination with next/previous navigation
 */

import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoviesPage from '../pages/MoviesPage.jsx';
import { collection, getDocs } from 'firebase/firestore';

// Mock Firebase Firestore connection
vi.mock('./firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Mock 20 unique movie documents
const mockMovies = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  title: `Movie ${i + 1}`,
  year: 2000 + i,
  poster: `poster${i + 1}.jpg`,
  plot: `Plot for Movie ${i + 1}`,
  rating: i + 1,
}));

describe('MoviesPage', () => {
  /**
   * Setup: Mock Firestore response with movie list
   */
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockReturnValue('moviesCollection');
    getDocs.mockResolvedValue({
      docs: mockMovies.map(m => ({ id: m.id, data: () => m })),
    });
  });

  /**
   * Test: Loading state and movie rendering
   */
  test('displays loading then renders movies', async () => {
    render(<MoviesPage />);

    expect(screen.getByText(/Loading movies.../i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument()
    );

    // First 18 movies should render on page 1
    for (let i = 1; i <= 18; i++) {
      expect(screen.getByText(`Movie ${i}`)).toBeInTheDocument();
    }

    // Ensure Movie 19 is not shown on first page
    expect(screen.queryByText('Movie 19')).not.toBeInTheDocument();
  });

  /**
   * Test: Filtering search by movie title
   */
  test('filters movies by search term', async () => {
    render(<MoviesPage />);
    await waitFor(() =>
      expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument()
    );

    fireEvent.change(screen.getByPlaceholderText(/search movies/i), {
      target: { value: 'Movie 5' },
    });

    expect(screen.getByText('Movie 5')).toBeInTheDocument();
    expect(screen.queryByText('Movie 1')).not.toBeInTheDocument();
  });

  /**
   * Test: Toggle modal by clicking "Show Details" and closing
   */
  test('toggles movie details on click', async () => {
    render(<MoviesPage />);
    await waitFor(() =>
      expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument()
    );

    const showButtons = screen.getAllByRole('button', { name: /Show Details/i });
    fireEvent.click(showButtons[0]);

    const closeButton = screen.getByRole('button', { name: /Close/i });
    const modalContent = closeButton.closest('.modal-content');

    expect(within(modalContent).getByText(/Plot for Movie 1/)).toBeInTheDocument();

    fireEvent.click(closeButton);
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /Close/i })).not.toBeInTheDocument()
    );
  });

  /**
   * Test: Pagination with next and previous navigation
   */
  test('pagination: next/previous buttons change pages', async () => {
    render(<MoviesPage />);
    await waitFor(() =>
      expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Movie 19')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
  });
});
