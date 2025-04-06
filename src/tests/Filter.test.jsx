/**
 * filter.test.jsx
 * ----------------
 * Unit tests for sorting and filtering behavior in <MoviesPage />.
 *
 * These tests validate:
 * - A–Z and Z–A sorting by title
 * - Sorting by release year (earliest → latest and latest → earliest)
 * 
 * The test uses a mocked Firestore environment and three predefined movies
 * to evaluate dropdown filtering logic visually and functionally.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoviesPage from '../pages/MoviesPage.jsx';
import { collection, getDocs } from 'firebase/firestore';
import { vi } from 'vitest';

// Mock Firebase and Firestore functions
vi.mock('./firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Define mock movie data with different titles and years
const mockMovies = [
  { id: '1', title: 'Beta', year: 2010, poster: 'beta.jpg', plot: 'Plot Beta', rating: 3 },
  { id: '2', title: 'Alpha', year: 2005, poster: 'alpha.jpg', plot: 'Plot Alpha', rating: 4 },
  { id: '3', title: 'Gamma', year: 2015, poster: 'gamma.jpg', plot: 'Plot Gamma', rating: 5 },
];

describe('MoviesPage Sorting Dropdown', () => {
  // Set up Firestore mock before each test
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockReturnValue('moviesCollection');
    getDocs.mockResolvedValue({
      docs: mockMovies.map((movie) => ({ id: movie.id, data: () => movie })),
    });
  });

  /**
   * Utility: Open the filter dropdown and select a sorting option
   */
  const openDropdownAndSort = async (optionText) => {
    await waitFor(() => expect(screen.queryByText(/Loading movies/i)).not.toBeInTheDocument());
    fireEvent.click(screen.getByText(/Filter/i));
    fireEvent.click(screen.getByText(optionText));
  };

  /**
   * Test: Sort movies alphabetically A–Z
   */
  test('sorts movies alphabetically A–Z', async () => {
    const { container } = render(<MoviesPage />);
    await openDropdownAndSort('A–Z');

    const movieCards = container.getElementsByClassName('movie-card');
    expect(movieCards[0]).toHaveTextContent('Alpha');
    expect(movieCards[1]).toHaveTextContent('Beta');
    expect(movieCards[2]).toHaveTextContent('Gamma');
  });

  /**
   * Test: Sort movies alphabetically Z–A
   */
  test('sorts movies alphabetically Z–A', async () => {
    const { container } = render(<MoviesPage />);
    await openDropdownAndSort('Z–A');

    const movieCards = container.getElementsByClassName('movie-card');
    expect(movieCards[0]).toHaveTextContent('Gamma');
    expect(movieCards[1]).toHaveTextContent('Beta');
    expect(movieCards[2]).toHaveTextContent('Alpha');
  });

  /**
   * Test: Sort by release year ascending
   */
  test('sorts movies by release year from earliest to latest', async () => {
    const { container } = render(<MoviesPage />);
    await openDropdownAndSort('Earliest to Latest');

    const movieCards = container.getElementsByClassName('movie-card');
    expect(movieCards[0]).toHaveTextContent('Alpha'); // 2005
    expect(movieCards[1]).toHaveTextContent('Beta');  // 2010
    expect(movieCards[2]).toHaveTextContent('Gamma'); // 2015
  });

  /**
   * Test: Sort by release year descending
   */
  test('sorts movies by release year from latest to earliest', async () => {
    const { container } = render(<MoviesPage />);
    await openDropdownAndSort('Latest to Earliest');

    const movieCards = container.getElementsByClassName('movie-card');
    expect(movieCards[0]).toHaveTextContent('Gamma'); // 2015
    expect(movieCards[1]).toHaveTextContent('Beta');  // 2010
    expect(movieCards[2]).toHaveTextContent('Alpha'); // 2005
  });
});
