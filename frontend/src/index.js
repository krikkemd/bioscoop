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
  // Original incoming data
  console.log(movies);

  // Movies is read only, make shallow copy of incoming data
  let films = [...movies];

  let titles = [];
  let ochtendTitles = [];
  let middagTitles = [];
  let avondTitles = [];

  let unique = [];
  let uniqueOchtend = [];
  let uniqueMiddag = [];
  let uniqueAvond = [];

  // Sort films array by start time
  films = films.sort((a, b) => {
    return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
  });

  // Push all titles into titles array
  films.map(film => titles.push(film.title));

  console.log(films);
  console.log(titles);

  // create 3 arrays depending on start times
  let ochtend = [...films.filter(film => film.start < '12:00')];
  let middag = [...films.filter(film => film.start > '12:00' && film.start < '18:00')];
  let avond = [...films.filter(film => film.start > '18:00')];

  // Push all titles to arrays
  ochtend.map(film => ochtendTitles.push(film.title));
  middag.map(film => middagTitles.push(film.title));
  avond.map(film => avondTitles.push(film.title));

  // console.log(ochtend);
  // console.log(middag);
  // console.log(avond);

  // Create a new array with only unique titles
  unique = [...new Set(titles)];

  // make objects out of unique array values, and add times array to every element inside unique
  unique.map((el, i, array) => {
    return (array[i] = { id: '', title: el, times: [] });
  });

  uniqueOchtend = [...new Set(ochtendTitles)];
  // uniqueOchtend.map((el, i, array) => (array[i] = { title: el, times: [] }));

  uniqueMiddag = [...new Set(middagTitles)];
  // uniqueMiddag.map((el, i, array) => (array[i] = { title: el, times: [] }));

  uniqueAvond = [...new Set(avondTitles)];
  // uniqueAvond.map((el, i, array) => (array[i] = { title: el, times: [] }));

  const addFieldsToUniqueArray = uniqueArray =>
    uniqueArray.map((el, i, array) => (array[i] = { title: el, times: [] }));

  addFieldsToUniqueArray(uniqueOchtend);
  addFieldsToUniqueArray(uniqueMiddag);
  addFieldsToUniqueArray(uniqueAvond);

  // every time film.title matches unique film title, add the start time to the unique film times array
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
