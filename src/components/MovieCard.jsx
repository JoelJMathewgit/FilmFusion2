import React from 'react';

const MovieCard = ({ movie, selectedMovieId, handleClick }) => {
  let movieContent;

  if (selectedMovieId === movie.id) {
    // Detail View
    const plotText = movie.plot || "No additional information available.";
    movieContent = (
      <div className="movie-details">
        <h3>
          {movie.title} ({movie.year})
        </h3>
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"    // <-- Lazy load
        />
        <p>{plotText}</p>
        <p>
          <strong>Rating:</strong> {movie.rating}
        </p>
        <button onClick={() => handleClick(movie)}>Back</button>
      </div>
    );
  } else {
    // Thumbnail View
    movieContent = (
      <div>
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"    // <-- Lazy load
        />
        <p>{movie.title}</p>
        <button onClick={() => handleClick(movie)}>Show Details</button>
      </div>
    );
  }

  return <div className="movie-card">{movieContent}</div>;
};

export default MovieCard;
