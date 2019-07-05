const { ApolloServer } = require('apollo-server');

const { findOrCreateUser } = require('./controllers/UserController');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;

    try {
      const authToken = req.headers.authorization;

      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`);
    }

    return { currentUser };
  },
});

server.listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
    console.log(`Server is running on ${url}`);
  });