const passport = require('passport');

const FacebookStrategy = require('./FacebookStrategy');
const GoogleStrategy = require('./GoogleStrategy');
const TwitterStrategy = require('./TwitterStrategy');
const LocalStrategy = require('./LocalStrategy');

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await User.findOne({ _id: userId });
  if (user) {
    done(null, user);
  } else {
    done('User not found!');
  }
});

passport.use(FacebookStrategy);
passport.use(GoogleStrategy);
passport.use(TwitterStrategy);
passport.use(LocalStrategy);

module.exports = passport;
