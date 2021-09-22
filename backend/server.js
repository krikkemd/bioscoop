const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  #   Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Performance {
    id: ID
    season: Int
    code: String
    event: Int
    eventType: String
    eventGenre: String
    satellite: String
    title: String
    subtitle: String
    tags: [String]
    facilityCode: String
    facility: String
    date: String
    start: String
    startDateTime: String
    end: String
    endDateTime: String
    times: [String]
    performanceStatus: String
    startOnlineSalesDate: String
    endOnlineSalesDate: String
    planningEventID: String
    onsale: Boolean
    statusMessage: String
    arrangements: [String]
    maccsboxCode: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    performances: [Performance]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    performances: async () => {
      try {
        const d = new Date();
        console.log(d.toLocaleTimeString());
        let today = d.toISOString().slice(0, 10);
        console.log(`todays date = ${today}`);
        let dateFrom = '2021-09-26';
        let dateUntil = '2021-09-26';

        const results = await fetch(
          `https://dnk.podiumnederland.nl/mtTicketingAPI/performanceList?key=${process.env.API_KEY}&dateFrom=${today}&dateUntil=${today}`,
        );
        const movies = await results.json();
        console.log(movies);

        return movies.performances.filter(movie => {
          if (movie.eventType === 'Film') {
            movie.times = [];
            return movie;
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 4000, hostname: 'localhost' },
    development: { ssl: false, port: 4000, hostname: 'localhost' },
  };

  const environment = process.env.NODE_ENV || 'production';
  const config = configurations[environment];

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  // Create the HTTPS or HTTP server, per configuration
  let httpServer;
  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    httpServer = https.createServer(
      {
        key: fs.readFileSync('/etc/ssl/private/wildcard_dnk_nl_2021.key'),
        cert: fs.readFileSync('/etc/ssl/certs/wildcard_dnk_nl_2021.crt'),
        requestCert: false,
      },
      app,
    );
  } else {
    httpServer = http.createServer(app);
  }

  // const fs = require('fs');
  // let options = {
  //   key: fs.readFileSync('/etc/ssl/private/wildcard_dnk_nl_2021.key'),
  //   cert: fs.readFileSync('/etc/ssl/certs/wildcard_dnk_nl_2021.crt'),
  //   requestCert: false,
  // };

  // Mount Apollo middleware here.
  // server.applyMiddleware({ app, path: '/specialUrl' });
  // await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  // await new Promise(resolve => app.listen({ port: config.port }, resolve));
  await new Promise(resolve => app.listen({ port: config.port }, resolve)); // https
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${server.graphqlPath}`,
  );

  // Additional middleware can be mounted at this point to run before Apollo.
  app.use(
    cors({
      origin: 'https://bios.dnk.nl',
      credentials: true,
    }),
  );
  return { server, app };
}

startApolloServer();
// The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
