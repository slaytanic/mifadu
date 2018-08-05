const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const config = require('../config');

passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.twitterConsumerKey,
      consumerSecret: config.twitterConsumerSecret,
      callbackURL: config.twitterCallbackURL,
    },
    (token, tokenSecret, profile, done) => {
      console.log(profile);
      done(null, profile);
      // User.findOrCreate(..., function(err, user) {
      //   if (err) { return done(err); }
      //   done(null, user);
      // });
    },
  ),
);
