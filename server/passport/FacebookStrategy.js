const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');
const config = require('../config');

module.exports = new FacebookStrategy(
  {
    clientID: config.facebookClientID,
    clientSecret: config.facebookClientSecret,
    callbackURL: config.facebookCallbackURL,
    profileFields: ['id', 'emails', 'name'],
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      facebookId: profile.id,
    };

    User.findOneAndUpdate(
      { email: user.email },
      user,
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      },
      (err, doc) => done(err, doc),
    );
  },
);
