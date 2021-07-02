import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import logo from './assets/dnk-logo.png';
import backgroundMovie from './assets/cinema.mp4';
import './css/style.css';

// Components
import Movies from './Components/Movies';

// Helper functions
import { addTimesArray, combineStartTimes } from './util/helperFunction';

// Connect to appollo server
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
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
  let titles = [];
  let ochtendTitles = [];
  let middagTitles = [];
  let avondTitles = [];

  let unique = [];
  let uniqueOchtend = [];
  let uniqueMiddag = [];
  let uniqueAvond = [];

  // 3) Movies is read only, make shallow copy of incoming data
  let films = [...movies];

  // 4) Sort films array by start times
  films = films.sort((a, b) => {
    return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
  });

  // 5) Create 3 arrays depending on start times
  let ochtend = [...films.filter(film => film.start < '12:00')];
  let middag = [...films.filter(film => film.start > '12:00' && film.start < '18:00')];
  let avond = [...films.filter(film => film.start > '18:00')];

  // 6) Push all titles into titles arrays
  films.map(film => titles.push(film.title));
  ochtend.map(film => ochtendTitles.push(film.title));
  middag.map(film => middagTitles.push(film.title));
  avond.map(film => avondTitles.push(film.title));

  // 7) UNIQUE TITLES:
  /* create arrays with unique titles only
    [
      0: "Pieter Konijn"
      0: "Tom & Jerry"
      0: "de Croods"
    ] 
  */
  unique = [...new Set(titles)];
  uniqueOchtend = [...new Set(ochtendTitles)];
  uniqueMiddag = [...new Set(middagTitles)];
  uniqueAvond = [...new Set(avondTitles)];

  // 8) ADD TIMES ARRAY AND CONVERT TO OBJECT:
  addTimesArray(unique);
  addTimesArray(uniqueOchtend);
  addTimesArray(uniqueMiddag);
  addTimesArray(uniqueAvond);

  // 9) COMBINE START TIMES AND ADD ID:
  combineStartTimes(films, unique);
  combineStartTimes(ochtend, uniqueOchtend);
  combineStartTimes(middag, uniqueMiddag);
  combineStartTimes(avond, uniqueAvond);

  console.log('Processed data with all movies:');
  console.log(unique);
  console.log('Processed data with morning movies:');
  console.log(uniqueOchtend);
  console.log('Processed data with daytime movies:');
  console.log(uniqueMiddag);
  console.log('Processed data with evening movies:');
  console.log(uniqueAvond);

  // 10) TODO: IMPLEMENT SOME TIME BASED LOGIC
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

  // 11) Render JSX:
  return (
    <>
      <video id='myVideo' autoPlay loop muted>
        <source src={backgroundMovie} type='video/mp4' />
      </video>

      <div className='container'>
        <header className='header'>
          <h1 className='heading-1'>Bioscoop</h1>
          <div className='header__date'>{datum}</div>
        </header>
        <div class='zalen'></div>

        <div className='movies'>
          <Movies moviesArray={uniqueOchtend} timeOfDay={'Ochtend'} />
          <Movies moviesArray={uniqueMiddag} timeOfDay={'Middag'} />
          <Movies moviesArray={uniqueAvond} timeOfDay={'Avond'} />
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
