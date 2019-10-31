const express = require('express');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

const app = express.Router();

// This file defines the endpoints for user registration.

app.post('/signup', [
  check('firstName').not().isEmpty().withMessage('First name cannot be empty.'),
  check('lastName').not().isEmpty().withMessage('Last name cannot be empty.'),
  check('email').isEmail().normalizeEmail().withMessage('Email is not valid.')
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
      password: req.body.password
    };
    User.create(newUserData, (err, user) => {
      if (err) {
        next(err);
      } else {
        User.findOne({
          email: req.body.email
        }, (err, user) => {
          req.login(user, function (err) {
            if (err) return next(err);
            res.status(200).send({
              message: 'user created'
            });
          })
        });
      }
    });
  });

module.exports = app;