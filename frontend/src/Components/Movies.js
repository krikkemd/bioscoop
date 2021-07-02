import React from 'react';

const Movies = ({ moviesArray, timeOfDay }) => {
  return (
    <div>
      {moviesArray.length > 0 && <h2>{`${timeOfDay}:`}</h2>}
      {moviesArray.map(movie => (
        <div key={movie.id}>
          <div>{movie.title}</div>
          <div>
            {[...movie.times].length > 1
              ? [...movie.times].toString().replace(',', ' | ')
              : [...movie.times]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Movies;
