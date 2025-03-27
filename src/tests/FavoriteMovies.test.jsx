import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FavoritesPage from '../pages/FavoritesPage';

describe('FavoriteMovies Component', () => {
  test('displays the Favorite Movies heading', () => {
    render(<FavoritesPage />);
    expect(screen.getByRole('heading', { name: /Favorite Movies/i })).toBeInTheDocument();
  });
});
