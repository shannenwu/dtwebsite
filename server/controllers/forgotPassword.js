// require Express
const express = require('express');
const path = require('path');

require('dotenv').config()

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');
const crypto = require('crypto');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');

const nodemailer = require('nodemailer');

app.post('/forgot', [
    check('email').isEmail().withMessage('Valid email required!'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
    }

    var token = crypto.randomBytes(20).toString('hex');
    User.findOneAndUpdate({
        email: req.body.email
    }, {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000,
    }, (err, user) => {
        if (user === null) {
            console.error('email not in database');
            res.status(403).send('Email not registered.');
        } else {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: 'dt-officers@mit.edu',
                to: `${user.email}`,
                subject: 'Password Reset Request for MIT Dance Troupe',
                text:
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                    + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                    + `http://localhost:5000/reset/${token}\n\n`
                    + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            };

            console.log('sending mail');

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('there was an error: ', err);
                } else {
                    console.log('here is the res: ', response);
                    res.status(200).send({message: 'Recovery email sent!'});
                }
            });
        }
    });
});

module.exports = app;