/**
 * MovieCard Component
 * --------------------
 * Displays either a compact movie thumbnail or detailed view depending on selection.
 *
 * Props:
 * - movie: Movie object containing title, year, rating, poster, plot, etc.
 * - selectedMovieId: ID of the currently selected movie (for expanding to detail view)
 * - handleClick: Function called when the card is clicked (used to toggle view)
 */

import React from 'react';

const MovieCard = ({ movie, selectedMovieId, handleClick }) => {
  let movieContent;

  // Show full details if this movie is currently selected
  if (selectedMovieId === movie.id) {
    const plotText = movie.plot || "No additional information available.";

    movieContent = (
      <div className="movie-details">
        <h3>
          {movie.title} ({movie.year})
        </h3>
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
        />
        <p>{plotText}</p>
        <p>
          <strong>Rating:</strong> {movie.rating}
        </p>
        <button onClick={() => handleClick(movie)}>Back</button>
      </div>
    );
  } else {
    // Show compact card view
    movieContent = (
      <div>
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
        />
        <p>{movie.title}</p>
        <button onClick={() => handleClick(movie)}>Show Details</button>
      </div>
    );
  }

  return <div className="movie-card">{movieContent}</div>;
};

export default MovieCard;
