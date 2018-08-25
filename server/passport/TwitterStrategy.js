const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../models/user');
const config = require('../config');

module.exports = new TwitterStrategy(
  {
    consumerKey: config.twitterConsumerKey,
    consumerSecret: config.twitterConsumerSecret,
    callbackURL: config.twitterCallbackURL,
    userProfileURL:
      'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
  },
  (token, tokenSecret, profile, done) => {
    const user = {
      email: profile.emails[0].value,
      //   firstName: profile.name.givenName,
      //   lastName: profile.name.familyName,
      twitterId: profile.id,
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
