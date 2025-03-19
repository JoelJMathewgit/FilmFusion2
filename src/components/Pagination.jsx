import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
      {/* Previous Button */}
      <button
        className="pagination-previous custom-pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Next Button */}
      <button
        className="pagination-next custom-pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      {/* Page Numbers */}
      <ul className="pagination-list">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              className={`pagination-link custom-pagination-button ${
                currentPage === index + 1 ? 'is-current custom-pagination-active' : ''
              }`}
              onClick={() => handlePageChange(index + 1)}
              aria-label={`Goto page ${index + 1}`}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
