import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('Favorite Movies Feature (TDD - Red Test)', () => {
  test('navigates to Favorite Movies page when "Favorite Movies" is clicked', async () => {
    render(<App />);

    // Simulate login process
    fireEvent.click(screen.getByText(/Log in/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
      target: { value: 'TestUser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: 'password' },
    });
    // Use getByRole to select the login button specifically
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    // Wait until the username appears in the navbar indicating login success
    expect(await screen.findByText(/TestUser/i)).toBeInTheDocument();

    // Open the dropdown by clicking the username
    fireEvent.click(screen.getByText(/TestUser/i));

    // Click the "Favorite Movies" option
    fireEvent.click(screen.getByText(/Favorite Movies/i));

    // Expect a heading "Favorite Movies" to appear on the page (this will fail until we implement it)
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Favorite Movies/i })
      ).toBeInTheDocument();
    });
  });
});