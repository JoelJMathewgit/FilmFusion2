// src/App.test.jsx

import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

// Mock Firebase and Firestore
vi.mock('./firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

import { getDocs } from 'firebase/firestore';

const fakeMovies = [
  { id: 'one', title: 'Alpha Movie', year: 2020, plot: 'Alpha plot here', poster: 'alpha.jpg', rating: 'PG' },
  { id: 'two', title: 'Beta Movie', year: 2021, plot: '', poster: 'beta.jpg', rating: 'R' },
];

// ✅ Reset mocks before each test to avoid contamination
beforeEach(() => {
  vi.clearAllMocks();
  getDocs.mockResolvedValueOnce({
    docs: fakeMovies.map(m => ({ id: m.id, data: () => m })),
  });
});

describe('App Component', () => {

  test('displays loading then renders movies', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading movies.../i)).toBeInTheDocument();
    expect(await screen.findByText(/alpha movie/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading movies.../i)).not.toBeInTheDocument();
  });

  test('filters movies by search term', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await screen.findByText(/alpha movie/i);

    fireEvent.change(screen.getByPlaceholderText(/search movies/i), {
      target: { value: 'Beta' },
    });

    expect(screen.queryByText(/alpha movie/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/beta movie/i)).toBeInTheDocument();
  });

  test('toggles movie details on click', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await screen.findByText(/alpha movie/i);

    fireEvent.click(screen.getAllByText(/show details/i)[0]);
    expect(await screen.findByText(/alpha plot here/i)).toBeInTheDocument();
    expect(screen.getByText(/rating:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/back/i));
    expect(screen.queryByText(/alpha plot here/i)).not.toBeInTheDocument();
  });

  test('pagination: next/previous buttons change pages', async () => {
    const manyMovies = Array.from({ length: 20 }, (_, i) => ({
      id: `id-${i + 1}`,
      title: `Movie ${i + 1}`,
      poster: `poster${i + 1}.jpg`,
      year: 2000 + i,
      rating: i % 2 === 0 ? 'PG' : 'R',
    }));

    getDocs.mockResolvedValueOnce({
      docs: manyMovies.map(m => ({ id: m.id, data: () => m })),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Page 1 => "Movie 1" to "Movie 18"
    expect(await screen.findByText(/^movie 1$/i)).toBeInTheDocument();
    expect(screen.getByText(/^movie 18$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^movie 19$/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/next/i));
    expect(await screen.findByText(/^movie 19$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^movie 1$/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/previous/i));
    expect(await screen.findByText(/^movie 1$/i)).toBeInTheDocument();
  });
});