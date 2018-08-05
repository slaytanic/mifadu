const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('../config');

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookClientID,
      clientSecret: config.facebookClientSecret,
      callbackURL: config.facebookCallbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile);
      // User.findOrCreate(..., function(err, user) {
      //   if (err) { return done(err); }
      //   done(null, user);
      // });
    },
  ),
);
