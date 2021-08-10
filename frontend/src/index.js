import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import logo from './assets/dnk-logo.png';
import backgroundMovie from './assets/cinema.mp4';
import './css/style.css';

// Components
import Movies from './Components/Movies';

// Helper functions
import {
  removePossibleDoubleValues,
  addTimesArray,
  combineStartTimes,
  removeWhiteSpace,
  SortArray,
} from './util/helperFunction';

// Connect to appollo server
const client = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_SERVER_URL,
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

// query data
client
  .query({
    query: gql`
      # Write your query or mutation here
      query {
        performances {
          id
          eventType
          title
          start
          times
          onsale
          statusMessage
        }
      }
    `,
  })
  .then(result => {
    // Render after data is fetched
    render(
      <ApolloProvider client={client}>
        <App movies={result.data.performances} />
      </ApolloProvider>,
      document.getElementById('root'),
    );
  });

// Component to render
function App({ movies }) {
  // 1) Original incoming data
  console.log('Original Data:');
  console.log(movies);

  // 2) Initialize vars
  let titles = []; // all movie titles
  let titlesTrimmedToLowerCase = []; // all movie titles trimmed + toLowerCase
  let ochtendTitles = [];
  let middagTitles = [];
  let avondTitles = [];

  let unique = []; // only unique movie titles

  // let indexesOfDoubleValue; // indexes of posssible double values in titles, ochtendTitles, middagTitles, avondTitles

  // Time colors:
  const red = '#e73454';
  const pink = '#e1617a';
  const amber = '#bd2f46';

  // 3) Movies is read only, make shallow copy of incoming data
  let films = [...movies];

  /*
  use to test removePossibleDoubleValues():
  films.push({
    eventType: 'Film',
    id: '10088984',
    start: '20:15',
    times: [],
    title: 'bLaCk      wIdoW',
  });
  */

  // 4) Sort films array by start times
  films = films.sort((a, b) => {
    return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
  });

  // 5) Create 3 arrays depending on start times
  let ochtend = [...films.filter(film => film.start < '12:00')];
  let middag = [...films.filter(film => film.start > '12:00' && film.start < '18:00')];
  let avond = [...films.filter(film => film.start > '18:00')];

  // 6) Push all titles into titles arrays
  films.map(film => titlesTrimmedToLowerCase.push(removeWhiteSpace(film.title))); // array with all movie titles (tolowercase + trimmed)
  films.map(film => titles.push(film.title)); // array with all movie titles, possible with double values (not lowercase or trimmed)
  /*
  let doublevalue1 = 'De Croods 2: Een Nieuw Begin';
  let doubleValue2 = 'De Croods 2: Een nieuw Begin';
  */

  ochtend.map(film => ochtendTitles.push(film.title)); // (not lowercase or trimmed)
  middag.map(film => middagTitles.push(film.title)); // (not lowercase or trimmed)
  avond.map(film => avondTitles.push(film.title)); // (not lowercase or trimmed)

  // 7) UNIQUE:
  /* create an array with unique titles only
    [
      0: "pieter konijn"
      1: "tom & jerry"
      2: "de croods"
    ] 
    */

  unique = [...new Set(titlesTrimmedToLowerCase)]; // really unique array (tolowercase + trim)
  console.log('Unique array toLowerCase + trimmed whitespace:');
  console.log(unique);

  // 8) removePossibleDoubleValues(reallyUniqueArray, arrayWithPossibleDoubles)
  removePossibleDoubleValues(unique, titles);
  removePossibleDoubleValues(unique, ochtendTitles);
  removePossibleDoubleValues(unique, middagTitles);
  removePossibleDoubleValues(unique, avondTitles);

  // 9) ADD TIMES ARRAY AND CONVERT TO OBJECT:
  addTimesArray(titles);
  addTimesArray(ochtendTitles);
  addTimesArray(middagTitles);
  addTimesArray(avondTitles);

  // 10) COMBINE START TIMES AND ADD ID:
  combineStartTimes(films, titles);
  combineStartTimes(ochtend, ochtendTitles);
  combineStartTimes(middag, middagTitles);
  combineStartTimes(avond, avondTitles);

  // 11) RESORT ARRAY - FOR IF ORDER CHANGED BECAUSE OF removePossibleDoubleValues()
  SortArray(titles);
  SortArray(ochtendTitles);
  SortArray(middagTitles);
  SortArray(avondTitles);

  console.log('Processed data with all movies:');
  console.log(titles);
  console.log('Processed data with morning movies:');
  console.log(ochtendTitles);
  console.log('Processed data with daytime movies:');
  console.log(middagTitles);
  console.log('Processed data with evening movies:');
  console.log(avondTitles);

  // 11) TODO: IMPLEMENT SOME TIME BASED LOGIC
  // check current time vs film start time, rerender?
  const t = new Date();
  let time = t.toLocaleTimeString().slice(0, 5);
  // time = '15:30';
  console.log(`time = ${time}`);

  let timeNum = t.getTime();
  console.log(timeNum);

  let d = new Date();
  let days = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA'];
  let months = [
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December',
  ];

  let datum = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  console.log(`datum = ${datum}`);

  // Reload page every 4 hours        1s     1m   1h   4h
  setTimeout(() => window.location.reload(), 1000 * 60 * 60 * 4);

  // 12) Render JSX:
  return (
    <>
      <video id='myVideo' autoPlay loop muted>
        <source src={backgroundMovie} type='video/mp4' />
      </video>

      <div className='container' style={{ cursor: 'none' }}>
        <header className='header'>
          <h1 className='heading-1'>Bioscoop</h1>
          <div className='header__date'>{datum}</div>
        </header>
        <div className='zalen'></div>

        <div className='movies'>
          <Movies moviesArray={ochtendTitles} timeOfDay={'Ochtend'} timeColor={amber} />
          <Movies moviesArray={middagTitles} timeOfDay={'Middag'} timeColor={red} />
          <Movies moviesArray={avondTitles} timeOfDay={'Avond'} timeColor={pink} />
        </div>

        <footer className='footer'>
          <div className='dnk__logo'>
            <img className='dnk__logo-img' src={logo} alt='DNK Logo' />
          </div>
        </footer>
      </div>
    </>
  );
}
