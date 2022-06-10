var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

var dbConnectionPool = mysql.createPool({
  host: '127.0.0.1',
  database: 'calendify'
});

app.use(function(req, res, next) {
  req.pool = dbConnectionPool;
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({                             //           //
    secret: 'a secret',                        //           //
    resave: false,                              // THIS CODE //
    saveUninitialized: true,                    //           //
    cookie: { secure: false }                   //           //
  }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/UserSettings', usersRouter);
app.use('/admin', adminRouter);

module.exports = app;
