const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  const googleUser = await verifyAuthToken(token);
  const user = await checkIfUserExists(googleUser.email);

  return user || createNewUser(googleUser);
};

// TODO: 1) move this function to service; 2) inject that service in controller via DI
const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch (err) {
    console.error('Error verifying auth token', err);
  }
};

// TODO: move this function to service;
const checkIfUserExists = async email => User.findOne({ email }).exec();

const createNewUser = (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = {
    name,
    email,
    picture,
  };

  return new User(user).save();
};