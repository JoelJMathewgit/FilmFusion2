/**
 * SearchBar Component
 * --------------------
 * Controlled input component for searching movies by keyword.
 *
 * Props:
 * - searchTerm: Current value of the search input
 * - setSearchTerm: Function to update the search term
 */

import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="search-container">
    <input
      type="text"
      placeholder="Search movies..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

export default SearchBar;
