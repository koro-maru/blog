var dotenv = require('dotenv').config({path: 'safety.env'});
var passport = require('passport')
var passportStrats = require('./passportSetup')
const bcrypt = require("bcryptjs");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var mongoose = require('mongoose');

var app = express();

const mongoDb = process.env.CONNECTION_STRING;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo connection error"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, console.log('Listening on port 3000.'));

module.exports = app;
