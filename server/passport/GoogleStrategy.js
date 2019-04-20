const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user');
const config = require('../config');

module.exports = new GoogleStrategy(
  {
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: config.googleCallbackURL,
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      email: (profile.emails.find(email => email.type === 'account') || profile.emails[0]).value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      googleId: profile.id,
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
