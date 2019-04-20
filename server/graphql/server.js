const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const config = require('../config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: config.apolloEngineApiKey,
  },
  context: ({ req }) => ({
    req,
  }),
});

module.exports = server;
