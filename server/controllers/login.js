// require Express
const express = require('express');
const path = require('path');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');
const passport = require('passport');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');

app.get('/login', (req, res) => {
    res.sendFile(publicPath + '/index.html');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error(`error ${err}`);
        }
        if (info !== undefined) {
            console.error(info.message);
            if (info.message === 'Bad email.') {
                res.status(401).send(info.message);
            } else {
                res.status(403).send(info.message);
            }
        } else {
            req.logIn(user, (err) => {
                if (err) {return next(err);}
                res.status(200).send(user);
            });
        }
    })(req, res, next);
});


module.exports = app;