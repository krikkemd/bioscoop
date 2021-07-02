const { ApolloServer, gql } = require('apollo-server');
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
        let dateFrom = '2021-07-04';
        let dateUntil = '2021-07-04';

        const results = await fetch(
          `https://dnk.podiumnederland.nl/mtTicketingAPI/performanceList?key=${process.env.API_KEY}&dateFrom=${today}&dateUntil=${today}`,
        );
        const movies = await results.json();
        // console.log(movies);

        return movies.performances.map(movie => {
          movie.times = [];
          return movie;
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
