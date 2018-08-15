const passport = require('passport');

const FacebookStrategy = require('./FacebookStrategy');
const GoogleStrategy = require('./GoogleStrategy');
const TwitterStrategy = require('./TwitterStrategy');
const LocalStrategy = require('./LocalStrategy');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(FacebookStrategy);
passport.use(GoogleStrategy);
passport.use(TwitterStrategy);
passport.use(LocalStrategy);

module.exports = passport;
