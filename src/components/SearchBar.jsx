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