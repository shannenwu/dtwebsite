// require Express
const express = require('express');
const path = require('path');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');

// This file defines the endpoints for user registration.

app.get('/signup', (req, res) => {
    res.sendFile(publicPath + '/index.html');
});

app.post('/signup', [
    check('firstName').not().isEmpty().withMessage('First name cannot be empty.'),
    check('lastName').not().isEmpty().withMessage('Last name cannot be empty.'),
    check('email').isEmail().withMessage('Email is not valid.')
        .custom(value => User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('Email already registered.');
            }
        })),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }
        var newUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            roles: ['user']
        };
        User.create(newUserData, (err, user) => {
            if (err) {
                next(err);
            } else {
                var user = User.findOne({
                    email: req.body.email
                }, (err, user) => {
                    req.login(user, function (err) {
                        if (err) return next(err);
                        console.log('user created in db');
                        res.status(200).send({
                            message: 'user created'
                        });
                    })
                });
            }
        });
    });

module.exports = app;