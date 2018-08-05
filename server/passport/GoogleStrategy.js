const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('../config');

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile);
      // User.findOrCreate({ googleId: profile.id }, (err, user) => done(err, user));
    },
  ),
);
