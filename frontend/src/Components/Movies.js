import React, { useEffect, useState } from 'react';
import '../css/style.css';

const Movies = ({ moviesArray, timeOfDay, timeColor }) => {
  const [displayEndTimes, setDisplayEndTimes] = useState(false);

  const changeDisplayTimes = () => {
    setTimeout(() => {
      setDisplayEndTimes(!displayEndTimes);
    }, 3000);
  };

  useEffect(() => {
    changeDisplayTimes();
  }, [displayEndTimes]);

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
            {displayEndTimes !== true ? (
              <p
                className='movies__beganegrond-list-item-nummer'
                style={{ backgroundColor: timeColor }}>
                {[...movie.startTimes].length > 1
                  ? [...movie.startTimes].toString().replaceAll(',', ' | ')
                  : [...movie.startTimes]}
              </p>
            ) : (
              <p
                className='movies__beganegrond-list-item-nummer'
                style={{ backgroundColor: timeColor }}>
                {[...movie.endTimes].length > 1
                  ? [...movie.endTimes].toString().replaceAll(',', ' | ')
                  : [...movie.endTimes]}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
