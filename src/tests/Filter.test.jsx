import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoviesPage from '../pages/MoviesPage.jsx';
import { collection, getDocs } from 'firebase/firestore';
import { vi } from 'vitest';

// -- Mock Firebase and Firestore functions
vi.mock('./firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

// -- Mock movie data for sorting tests
// We create three movies with distinct titles and release years to test sorting logic
const mockMovies = [
  { id: '1', title: 'Beta', year: 2010, poster: 'beta.jpg', plot: 'Plot Beta', rating: 3 },
  { id: '2', title: 'Alpha', year: 2005, poster: 'alpha.jpg', plot: 'Plot Alpha', rating: 4 },
  { id: '3', title: 'Gamma', year: 2015, poster: 'gamma.jpg', plot: 'Plot Gamma', rating: 5 },
];

describe('MoviesPage Sorting Dropdown', () => {
  // Before each test, reset mocks and set Firestore to return our mock movie data
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockReturnValue('moviesCollection');
    getDocs.mockResolvedValue({
      docs: mockMovies.map((movie) => ({ id: movie.id, data: () => movie })),
    });
  });

  // Helper function to open the dropdown and select a sort option
  const openDropdownAndSort = async (optionText) => {
    // Wait until the "Loading movies..." indicator is gone indicating movies have loaded
    await waitFor(() => expect(screen.queryByText(/Loading movies/i)).not.toBeInTheDocument());
    // Click the "Filter" button to open the dropdown
    fireEvent.click(screen.getByText(/Filter/i));
    // Click the sort option provided by the test
    fireEvent.click(screen.getByText(optionText));
  };

  // PART: Sorting Alphabetically A–Z
  test('sorts movies alphabetically A–Z', async () => {
    // Render the MoviesPage component
    const { container } = render(<MoviesPage />);
    // Open dropdown and choose the "A–Z" option
    await openDropdownAndSort('A–Z');

    // Get the list of movie cards rendered on the page
    const movieCards = container.getElementsByClassName('movie-card');
    // Expected order: Alpha, Beta, Gamma (alphabetical order)
    expect(movieCards[0]).toHaveTextContent('Alpha');
    expect(movieCards[1]).toHaveTextContent('Beta');
    expect(movieCards[2]).toHaveTextContent('Gamma');
  });

  // PART: Sorting Alphabetically Z–A
  test('sorts movies alphabetically Z–A', async () => {
    // Render the MoviesPage component
    const { container } = render(<MoviesPage />);
    // Open dropdown and choose the "Z–A" option
    await openDropdownAndSort('Z–A');

    // Get the rendered movie cards
    const movieCards = container.getElementsByClassName('movie-card');
    // Expected order: Gamma, Beta, Alpha (reverse alphabetical order)
    expect(movieCards[0]).toHaveTextContent('Gamma');
    expect(movieCards[1]).toHaveTextContent('Beta');
    expect(movieCards[2]).toHaveTextContent('Alpha');
  });

  // PART: Sorting by Release Year (Earliest to Latest)
  test('sorts movies by release year from earliest to latest', async () => {
    // Render the MoviesPage component
    const { container } = render(<MoviesPage />);
    // Open dropdown and select the "Earliest to Latest" option
    await openDropdownAndSort('Earliest to Latest');

    // Get the rendered movie cards
    const movieCards = container.getElementsByClassName('movie-card');
    // Expected order by release year ascending:
    // Alpha (2005), Beta (2010), Gamma (2015)
    expect(movieCards[0]).toHaveTextContent('Alpha');
    expect(movieCards[1]).toHaveTextContent('Beta');
    expect(movieCards[2]).toHaveTextContent('Gamma');
  });

  // PART: Sorting by Release Year (Latest to Earliest)
  test('sorts movies by release year from latest to earliest', async () => {
    // Render the MoviesPage component
    const { container } = render(<MoviesPage />);
    // Open dropdown and choose the "Latest to Earliest" option
    await openDropdownAndSort('Latest to Earliest');

    // Get the rendered movie cards
    const movieCards = container.getElementsByClassName('movie-card');
    // Expected order by release year descending:
    // Gamma (2015), Beta (2010), Alpha (2005)
    expect(movieCards[0]).toHaveTextContent('Gamma');
    expect(movieCards[1]).toHaveTextContent('Beta');
    expect(movieCards[2]).toHaveTextContent('Alpha');
  });
});
