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
  console.log(movies);

  // Movies is read only, make shallow copy
  let films = [...movies];

  let titles = [];
  let ochtendTitles = [];
  let middagTitles = [];
  let avondTitles = [];

  let unique = [];
  let uniqueOchtend = [];
  let uniqueMiddag = [];
  let uniqueAvond = [];

  // Sort by start time
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
  uniqueOchtend.map((el, i, array) => (array[i] = { title: el, times: [] }));

  uniqueMiddag = [...new Set(middagTitles)];
  uniqueMiddag.map((el, i, array) => (array[i] = { title: el, times: [] }));

  uniqueAvond = [...new Set(avondTitles)];
  uniqueAvond.map((el, i, array) => (array[i] = { title: el, times: [] }));

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
  combineStartTimes(films, uniqueOchtend);
  combineStartTimes(films, uniqueMiddag);
  combineStartTimes(films, uniqueAvond);

  // every time film.title matches unique film title, add the start time to the unique film times array
  // for (let film of films) {
  //   for (let el of unique) {
  //     if (film.title === el.title) {
  //       unique[unique.indexOf(el)].id = film.id;
  //       unique[unique.indexOf(el)].times = [...unique[unique.indexOf(el)].times, film.start];
  //     }
  //   }
  // }

  // for (let film of ochtend) {
  //   for (let el of uniqueOchtend) {
  //     if (film.title === el.title) {
  //       uniqueOchtend[uniqueOchtend.indexOf(el)].id = film.id;
  //       uniqueOchtend[uniqueOchtend.indexOf(el)].times = [
  //         ...uniqueOchtend[uniqueOchtend.indexOf(el)].times,
  //         film.start,
  //       ];
  //     }
  //   }
  // }

  // for (let film of middag) {
  //   for (let el of uniqueMiddag) {
  //     if (film.title === el.title) {
  //       uniqueMiddag[uniqueMiddag.indexOf(el)].id = film.id;
  //       uniqueMiddag[uniqueMiddag.indexOf(el)].times = [
  //         ...uniqueMiddag[uniqueMiddag.indexOf(el)].times,
  //         film.start,
  //       ];
  //     }
  //   }
  // }

  // for (let film of avond) {
  //   for (let el of uniqueAvond) {
  //     if (film.title === el.title) {
  //       uniqueAvond[uniqueAvond.indexOf(el)].id = film.id;
  //       uniqueAvond[uniqueAvond.indexOf(el)].times = [
  //         ...uniqueAvond[uniqueAvond.indexOf(el)].times,
  //         film.start,
  //       ];
  //     }
  //   }
  // }

  console.log(unique);
  // console.log(uniqueOchtend);
  console.log(uniqueMiddag);
  // console.log(uniqueAvond);

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
