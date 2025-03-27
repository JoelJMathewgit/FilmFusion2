import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { collection, getDocs } from 'firebase/firestore';
import MoviesPage from '../pages/MoviesPage.jsx';

// -- Mock Firebase
vi.mock('./firebase', () => ({ db: {} }));

// -- Mock Firestore calls
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Create mock movie data: 20 entries with incremental fields
const mockMovies = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  title: `Movie ${i + 1}`,
  year: 2000 + i,
  poster: `poster${i + 1}.jpg`,
  plot: `Plot for Movie ${i + 1}`,
  rating: i + 1,
}));

describe('MoviesPage', () => {
  // Reset mocks and set return values before each test
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockReturnValue('moviesCollection');
    getDocs.mockResolvedValue({
      docs: mockMovies.map(m => ({ id: m.id, data: () => m })),
    });
  });

  // PART 1: Loading State & Movie Rendering

  test('displays loading then renders movies', async () => {
    render(<MoviesPage />);

    // Expect loading indicator initially
    expect(screen.getByText(/Loading movies.../i)).toBeInTheDocument();

    // Wait for loading indicator to disappear after data load
    await waitFor(() => expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument());

    // Verify first page renders 18 movies
    for (let i = 1; i <= 18; i++) {
      expect(screen.getByText(`Movie ${i}`)).toBeInTheDocument();
    }

    // Movie 19 should not be rendered on the first page
    expect(screen.queryByText('Movie 19')).not.toBeInTheDocument();
  });

  // PART 2: Filtering Movies

  test('filters movies by search term', async () => {
    render(<MoviesPage />);
    await waitFor(() => expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument());

    // Type search term
    fireEvent.change(screen.getByPlaceholderText(/search movies/i), { target: { value: 'Movie 5' } });

    // Only matching movie should be visible
    expect(screen.getByText('Movie 5')).toBeInTheDocument();
    expect(screen.queryByText('Movie 1')).not.toBeInTheDocument();
  });

  // PART 3: Toggling Movie Details
  test('toggles movie details on click', async () => {
    render(<MoviesPage />);
    await waitFor(() => expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument());

    // Get all "Show Details" buttons
    const showButtons = screen.getAllByRole('button', { name: /Show Details/i });

    // Open modal for first movie
    fireEvent.click(showButtons[0]);

    // Close modal button reference
    const closeButton = screen.getByRole('button', { name: /Close/i });
    const modalContent = closeButton.closest('.modal-content');

    // Verify modal displays correct plot
    expect(within(modalContent).getByText(/Plot for Movie 1/)).toBeInTheDocument();

    // Close the modal
    fireEvent.click(closeButton);
    await waitFor(() => expect(screen.queryByRole('button', { name: /Close/i })).not.toBeInTheDocument());
  });

  // PART 4: Pagination

  test('pagination:  next/previous buttons change pages', async () => {
    render(<MoviesPage />);
    await waitFor(() => expect(screen.queryByText(/Loading movies.../i)).not.toBeInTheDocument());

    // Navigate to next page
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Movie 19')).toBeInTheDocument();

    // Navigate back to previous page
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
  });
});
