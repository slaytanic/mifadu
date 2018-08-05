// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const config = require('./config');
const graphqlSchema = require('./graphql/schema');

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
    console.info(
      'Mongoose default connection disconnected through app termination',
    );
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  }),
);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
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
