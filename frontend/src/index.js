import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

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

  console.log(films);
  console.log(titles);

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

  // 8) ADD TIMES ARRAY AND CONVERT TO OBJECT :
  /* convert arrays with unique titles to objects, and add times array field: 
    [
      0: {title: "Pieter Konijn", times: []}
      1: {title: "Tom & Jerry", times: []}
      2: {title: "De Croods", times: []}
    ]
  */
  const addTimesArray = uniqueArray =>
    uniqueArray.map((el, i, array) => (array[i] = { title: el, times: [] }));

  addTimesArray(unique);
  addTimesArray(uniqueOchtend);
  addTimesArray(uniqueMiddag);
  addTimesArray(uniqueAvond);

  // make objects out of unique array values, and add times array to every element inside unique
  // unique.map((el, i, array) => {
  //   return (array[i] = { id: '', title: el, times: [] });
  // });

  // 9) COMBINE START TIMES AND ADD ID
  /* Every time film.title matches unique film title, add the start time to the unique film times array, also add ID
  [
      0: {
          id: "10087691",
          title: "Pieter Konijn", 
          times: ["13:00"]
        }
      1: {
          id: "10087693",
          title: "Tom & Jerry", 
          times: ["13:00"]
        }
      2: {
          id: "10087643",
          title: "De Croods", 
          times: ["13:00", "15:45"]
        }
    ] 
  */
  const combineStartTimes = (filmsArray, uniqueArray) => {
    for (let film of filmsArray) {
      for (let el of uniqueArray) {
        if (film.title === el.title) {
          uniqueArray[uniqueArray.indexOf(el)].id = film.id;
          uniqueArray[uniqueArray.indexOf(el)].times = [
            ...uniqueArray[uniqueArray.indexOf(el)].times,
            film.start,
          ];
        }
      }
    }
  };

  combineStartTimes(films, unique);
  combineStartTimes(ochtend, uniqueOchtend);
  combineStartTimes(middag, uniqueMiddag);
  combineStartTimes(avond, uniqueAvond);

  console.log(unique);
  console.log(uniqueOchtend);
  console.log(uniqueMiddag);
  console.log(uniqueAvond);

  // check current time vs film start time, rerender?
  const t = new Date();
  let time = t.toLocaleTimeString().slice(0, 5);
  // time = '15:30';
  console.log(`time = ${time}`);

  let timeNum = t.getTime();
  console.log(timeNum);

  return (
    <div>
      <h1>Bioscoop 🚀</h1>
      {uniqueOchtend.length > 0 && <h2>Ochtend:</h2>}
      {uniqueOchtend.map(movie => (
        <div key={movie.id}>
          <div>{movie.title}</div>
          <div>
            {[...movie.times].length > 1
              ? [...movie.times].toString().replace(',', ' | ')
              : [...movie.times]}
          </div>
        </div>
      ))}
      <h2>Middag:</h2>
      {uniqueMiddag.map(movie => (
        <div key={movie.id}>
          <div>{movie.title}</div>
          {[...movie.times].length > 1
            ? [...movie.times].toString().replace(',', ' | ')
            : [...movie.times]}
        </div>
      ))}
      <h2>Avond:</h2>
      {uniqueAvond.map(movie => (
        <div key={movie.id}>
          <div>{movie.title}</div>
          {[...movie.times].length > 1
            ? [...movie.times].toString().replace(',', ' | ')
            : [...movie.times]}
        </div>
      ))}
    </div>
  );
}
