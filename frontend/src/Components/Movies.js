import React, { useEffect, useState } from 'react';
import '../css/style.css';
import '../css/App.css';

const Movies = ({ moviesArray, timeOfDay, startTimeColor, endTimeColor }) => {
  const [displayEndTimes, setDisplayEndTimes] = useState(false);
  console.log(timeOfDay);
  console.log(moviesArray);

  const changeDisplayTimes = () => {
    setTimeout(() => {
      setDisplayEndTimes(!displayEndTimes);
    }, 4000);
  };

  useEffect(() => {
    changeDisplayTimes();
    console.log('change time display');
    // return function cleanup() {
    //   clearTimeout(changeDisplayTimes);
    // };
  }, [displayEndTimes]);

  return (
    <div>
      {moviesArray.length > 0 && (
        <div>
          <h2 className='heading-2 heading-2--movie flex'>
            <span className='movie-lighter'>Filmprogramma | {timeOfDay}</span>
            {/* Display Start or End */}
            {displayEndTimes !== true ? (
              <span style={{ color: startTimeColor }} className={`p-van-tot`}>
                Aanvang
              </span>
            ) : (
              <span style={{ color: endTimeColor }} className={`p-van-tot`}>
                Einde
              </span>
            )}
          </h2>
        </div>
      )}
      <ul className='movies__beganegrond-list'>
        {moviesArray.map(movie => (
          <li className='movies__beganegrond-list-item' key={movie.id}>
            <p className='movies__beganegrond-list-item-artiest'>{movie.title}</p>
            {/* Display movie start times */}
            {displayEndTimes !== true ? (
              <p
                className='movies__beganegrond-list-item-nummer'
                style={{ backgroundColor: startTimeColor }}>
                {[...movie.startTimes].length > 1
                  ? [...movie.startTimes].toString().replaceAll(',', ' | ')
                  : [...movie.startTimes]}
              </p>
            ) : (
              // Display movie end times
              <p
                className='movies__beganegrond-list-item-nummer'
                style={{ backgroundColor: endTimeColor }}>
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
