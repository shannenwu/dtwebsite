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
}));

// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// static server
app.use(express.static('public'));

// routes
app.use(require('./signup'));
app.use(require('./login'));
app.use('/api', require('./api'));

module.exports = app;
