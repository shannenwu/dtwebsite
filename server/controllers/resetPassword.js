// require Express
const express = require('express');
const path = require('path');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/User.js');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');

app.get('/reset/:resetPasswordToken', (req, res) => {
    var resetPasswordToken = req.params.resetPasswordToken;
    User.findOne({
        resetPasswordToken
    }, (err, user) => {
        if (user === null) {
            res.status(403).send('Password reset link is invalid or has expired.');
        } else {
            res.sendFile(publicPath + '/index.html');
        }
    })
});

app.post('/reset/:resetPasswordToken', [
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error('Password confirmation is incorrect.');
            } else {
                return true;
            }
        })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
    }
    User.findOne({
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: {
            $gte:  Date.now()
        }
    }).then((user) => {
        if (user === null) {
            console.error('password reset link is invalid or has expired');
            res.status(403).send('Password reset link is invalid or has expired.');
        } else {
            user.password = req.body.password;
            user.resetPasswordToken = null;
            user.save((err, newUser) => {
                res.status(200).send({ message: 'Password changed successfully.' });
            });
        }
    });
});

module.exports = app;