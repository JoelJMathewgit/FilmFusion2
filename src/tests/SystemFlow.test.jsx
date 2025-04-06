/**
 * SystemsFlow.test.jsx
 * ---------------------
 * Full system test for user flow across the entire app.
 *
 * Simulates:
 * 1. User login via Firebase Auth
 * 2. Navigation to Favorites page
 * 3. Fetching and displaying a favorited movie
 * 4. Opening the movie details modal and verifying its content
 */

import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App.jsx';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

// Mock Firebase Authentication
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
  };
});

// Mock Firebase Firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn(),
  };
});

// Fake user session
const mockUser = {
  uid: '123',
  email: 'testuser@example.com',
  displayName: 'Test User',
};

// Fake favorited movie
const mockMovie = {
  id: '1',
  title: 'Test Movie',
  year: '2020',
  plot: 'Test Plot',
  rating: 5,
  poster: 'testposter.jpg',
};

// Simulate Firestore movie document snapshot
const mockDocSnap = {
  id: mockMovie.id,
  data: () => mockMovie,
};

describe('SystemsFlow: Login and view favorited movies', () => {
  /**
   * Setup mocks before each test
   */
  beforeEach(() => {
    vi.clearAllMocks();

    // Auth: successful login mock
    signInWithEmailAndPassword
