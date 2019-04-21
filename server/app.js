const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

const passport = require('./passport');

const config = require('./config');
const graphqlServer = require('./graphql/server');
const assignmentsRouter = require('./routes/assignments');

const seeds = require('./db/seeds');

mongoose.connect(config.mongoDbUrl);

mongoose.connection.on('connected', () => {
  console.info(`Mongoose default connection open to ${config.mongoDbUrl}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

if (config.seedDatabase === true) {
  seeds();
}

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cookieSession({
    name: 'mifadu',
    secret: config.appSecret,
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);
app.use(passport.initialize());
app.use(passport.session());

function redirectToHttps(req, res, next) {
  if (req.secure || req.get('x-forwarded-proto') === 'https' || config.isLocal) {
    return next();
  }
  return res.redirect(`https://${req.headers.host}${req.url}`);
}

app.use('/graphql', (req, res, next) => {
  passport.authenticate('bearer', { session: false }, (err, user) => {
    if (user) {
      return req.login(user, () => next());
    }
    return next();
  })(req, res, next);
});

graphqlServer.applyMiddleware({ app });

app.get(
  '/auth/google',
  redirectToHttps,
  passport.authenticate('google', {
    scope: 'https://www.googleapis.com/auth/userinfo.email',
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

app.get('/auth/facebook', redirectToHttps, passport.authenticate('facebook', { scope: ['email'] }));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
);

app.get('/auth/twitter', redirectToHttps, passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

app.use('/assignments', assignmentsRouter);

app.use(redirectToHttps, express.static(path.join(__dirname, 'build')));

app.get('*', redirectToHttps, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
