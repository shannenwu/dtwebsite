// require Express
const express = require('express');
const session = require('express-session');
const path = require('path');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');
const passport = require('passport');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');;

app.get('/login', (req, res) => {
    res.sendFile(publicPath+'/index.html');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        session: true
    })(req, res, next);
});

module.exports = app;