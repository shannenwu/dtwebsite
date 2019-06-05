// libraries
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const path = require('path');

// local dependencies
const passport = require('passport');
const db = require('../db');
require('../passport.js'); // rename mayb

// initialize express app
const app = express();
// const publicPath = path.resolve(__dirname, '..', 'dist');

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// set up sessions
app.use(session({
  secret: 'session-secret',
  resave: 'false',
  saveUninitialized: 'true',
  cookie: {maxAge: 8*60*60*1000} // 8 hours
}));

// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// static server
app.use(express.static('public'));

// routes
app.use(require('./signup'));
app.use(require('./login'));
app.use(require('./profile'));
app.use('/api', require('./api'));

// logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = app;
