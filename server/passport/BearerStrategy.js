const BearerStrategy = require('passport-http-bearer').Strategy;

const User = require('../models/user');

module.exports = new BearerStrategy((token, done) => {
  User.findOne({ token }, (err, doc) => {
    done(err, doc);
  });
});
