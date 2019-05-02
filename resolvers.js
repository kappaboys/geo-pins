const user = {
  _id: '123',
  name: 'kappa',
  email: 'kappao5o6o7@gmail.com',
  picture: '',
};

module.exports = {
  Query: {
    me: () => user,
  }
};