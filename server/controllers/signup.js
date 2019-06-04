// require Express
const express = require('express');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');
const passport = require('passport');

const { check, validationResult } = require('express-validator/check');

// This file defines the endpoints for user registration.

// app.get('/signup', (req, res) => {
//     res.render('signup');
// });

app.post('/signup', [
    check('firstName').not().isEmpty().withMessage('First name cannot be empty.'),
    check('lastName').not().isEmpty().withMessage('Last name cannot be empty.'),
    check('email').not().isEmpty().withMessage('Email cannot be empty.')
        .isEmail().withMessage('Email is not valid.')
        .custom(value => User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('Email already registered.');
            }
        })),
    check('password').not().isEmpty().withMessage('Password cannot be empty.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                console.log(err);
            }
            if (info != undefined) {
                console.log(info.message);
                res.status(403).send(info.message);
            } else {
                req.logIn(user, err => {
                    const data = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                    };
                    User.findOne({
                        email: data.email,
                    }).then(user => {
                        user
                            .updateOne({
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                            })
                            .then(() => {
                                console.log('user created in db');
                                res.status(200).send({
                                    message: 'user created'
                                });
                            });
                    });
                });
            }
        })(req, res, next);
    });

module.exports = app;