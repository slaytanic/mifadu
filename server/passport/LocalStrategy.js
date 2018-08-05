const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = new LocalStrategy((username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    return user.validPassword(password, (passwordErr, res) => {
      if (passwordErr) {
        return done(passwordErr);
      }

      if (res) {
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect password.' });
    });
  });
});
