// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
// const passport = require('passport');
const multer = require('multer');

const findRemoveSync = require('find-remove');

const passport = require('./passport');

const config = require('./config');
const graphqlSchema = require('./graphql/schema');
const assignmentsRouter = require('./routes/assignments');

const upload = multer({
  // storage: multer.memoryStorage(),
  dest: 'uploads/',
}).any();

function handleUpload(req, res, next) {
  findRemoveSync(__dirname + '/uploads', { age: { seconds: 600 } });
  return upload(req, res, () => {
    // console.log(req.body);
    // if (!req.files || req.files.length === 0) {
    if (!req.body.request) {
      return next();
      // return;
    }
    req.body = JSON.parse(req.body.request);
    // req.files.forEach((file) => {
    //   req.body.variables.input[file.fieldname] = file;
    // });
    return next();
  });
}

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

// mongoose.Promise = global.Promise;
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

require('./db/seeds')();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
// app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

function redirectToHttps(req, res, next) {
  if (req.secure || req.get('x-forwarded-proto') === 'https' || config.isLocal) {
    return next();
  }
  return res.redirect(`https://${req.headers.host}${req.url}`);
}

app.use('/graphql', redirectToHttps, handleUpload, (req, res, next) => graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true,
  context: { req, res, next },
})(req, res, next));

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

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// error handler
// app.use((err, req, res) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
