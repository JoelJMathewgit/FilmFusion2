// src/App.test.jsx

import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Jest DOM matchers
import App from './App';

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

import { getDocs } from 'firebase/firestore';

// -- Default movie data
const fakeMovies = [
  { id: 'one', title: 'Alpha Movie', year: 2020, plot: 'Alpha plot here', poster: 'alpha.jpg', rating: 'PG' },
  { id: 'two', title: 'Beta Movie', year: 2021, plot: '', poster: 'beta.jpg', rating: 'R' },
];

// Mock getDocs so it returns our default data
getDocs.mockResolvedValue({
  docs: fakeMovies.map(m => ({ id: m.id, data: () => m })),
});

describe('App Component', () => {
  
  // PART 1: Loading State & Movie Rendering
  
  test('displays loading then renders movies', async () => {
    render(<App />);
    // Immediately check for loading text
    expect(screen.getByText(/loading movies.../i)).toBeInTheDocument();
    // Wait until "Alpha Movie" appears
    expect(await screen.findByText(/alpha movie/i)).toBeInTheDocument();
    // Ensure loading text is gone
    expect(screen.queryByText(/loading movies.../i)).not.toBeInTheDocument();
  });

  // PART 2: Filtering Movies
  test('filters movies by search term', async () => {
    render(<App />);
    await screen.findByText(/alpha movie/i);

    // Enter "Beta" to filter out "Alpha"
    fireEvent.change(screen.getByPlaceholderText(/search movies/i), {
      target: { value: 'Beta' },
    });

    // Confirm only "Beta Movie" remains
    expect(screen.queryByText(/alpha movie/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/beta movie/i)).toBeInTheDocument();
  });

  // PART 3: Toggling Movie Details

  test('toggles movie details on click', async () => {
    render(<App />);
    await screen.findByText(/alpha movie/i);

    // Click the first "Show Details" button => reveals plot & rating
    fireEvent.click(screen.getAllByText(/show details/i)[0]);
    expect(await screen.findByText(/alpha plot here/i)).toBeInTheDocument();
    expect(screen.getByText(/rating:/i)).toBeInTheDocument();

    // Click "Back" => hides the details
    fireEvent.click(screen.getByText(/back/i));
    expect(screen.queryByText(/alpha plot here/i)).not.toBeInTheDocument();
  });

  
  // PART 4: Pagination
  
  test('pagination: next/previous buttons change pages', async () => {
    // Override fakeMovies to create 20 items
    const manyMovies = Array.from({ length: 20 }, (_, i) => ({
      id: `id-${i + 1}`,
      title: `Movie ${i + 1}`,
      poster: `poster${i + 1}.jpg`,
      year: 2000 + i,
      rating: i % 2 === 0 ? 'PG' : 'R',
    }));

    // Make getDocs return these 20 items for this test
    getDocs.mockResolvedValueOnce({
      docs: manyMovies.map(m => ({ id: m.id, data: () => m })),
    });

    render(<App />);

    // Page 1 => "Movie 1" to "Movie 18"
    expect(await screen.findByText(/^movie 1$/i)).toBeInTheDocument();
    expect(screen.getByText(/^movie 18$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^movie 19$/i)).not.toBeInTheDocument();

    // Click NEXT => Page 2 => "Movie 19" & "Movie 20"
    fireEvent.click(screen.getByText(/next/i));
    expect(await screen.findByText(/^movie 19$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^movie 1$/i)).not.toBeInTheDocument();

    // Click PREVIOUS => back to Page 1
    fireEvent.click(screen.getByText(/previous/i));
    expect(await screen.findByText(/^movie 1$/i)).toBeInTheDocument();
  });
});
