// equire Express
const express = require('express');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');
const passport = require('passport');

app.get('/signup', (req, res) => {
    res.render('signup');
});
// POST /signup

module.exports = app => {
    app.post('/signup', (req, res, next) => {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                console.log(err);
            }
            if (info != undefined) {
                console.log(info.message);
                res.send(info.message);
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
                            .update({
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                            })
                            .then(() => {
                                console.log('user created in db');
                                res.status(200).send({
                                    message: 'user created'
                                }); //redirect later based on this
                            });
                    });
                });
            }
        })(req, res, next);
    });
};



module.exports = app;