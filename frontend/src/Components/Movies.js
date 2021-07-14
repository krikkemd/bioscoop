import React from 'react';
import '../css/style.css';

const Movies = ({ moviesArray, timeOfDay, timeColor }) => {
  return (
    <div>
      {moviesArray.length > 0 && (
        <h2 className='heading-2 heading-2--movie'>
          <span className='movie-lighter'>Filmprogramma |</span> {timeOfDay}
        </h2>
      )}
      <ul className='movies__beganegrond-list'>
        {moviesArray.map(movie => (
          <li className='movies__beganegrond-list-item' key={movie.id}>
            <p className='movies__beganegrond-list-item-artiest'>{movie.title}</p>
            <p
              className='movies__beganegrond-list-item-nummer'
              style={{ backgroundColor: timeColor }}>
              {[...movie.times].length > 1
                ? [...movie.times].toString().replaceAll(',', ' | ')
                : [...movie.times]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
