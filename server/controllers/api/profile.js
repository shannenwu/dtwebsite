// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');
const Jimp = require('jimp');

// Router added at "/api"
const app = express.Router();

// Import User Schema
const User = require('../../models/user.js');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to modify the user profile. These routes are prefixed by /api/{ENDPOINT}

app.get('/whoami', function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user);
    }
    else {
        res.send({});
    }
});

app.post('/profile/info',
    connect.ensureLoggedIn(), [
        check('gender').optional().custom(value => {
            var genderOptions = ['male', 'female', 'other', '']
            if (!genderOptions.includes(value)) {
                return Promise.reject('Please select a gender from the dropdown.');
            } else {
                return true;
            }
        }),
        check('affiliation').optional().custom(value => {
            var affilOptions = ['undergraduate', 'graduate', 'other', '']
            if (!affilOptions.includes(value)) {
                return Promise.reject('Please select an affiliation from the dropdown.');
            } else {
                return true;
            }
        }),
        check('year').optional().isNumeric().withMessage('Graduation year must be a number.'),
        check('livingGroup').optional().isLength({ min: 0, max: 100 }).withMessage('Living group has max character count of 100.'),
        check('experience').optional().isLength({ min: 0, max: 1000 }).withMessage('Experience field has max character count of 1000.'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }
        var updatedUserData = {
            gender: req.body.gender,
            affiliation: req.body.affiliation,
            year: req.body.year,
            livingGroup: req.body.livingGroup,
            experience: req.body.experience
        };
        User.findOneAndUpdate({
            email: req.user.email
        }, updatedUserData, { new: true }).then((user) => {
            if (user === null) {
                res.status(403).send('Unauthorized request.');
            } else {
                if (req.body.image.includes('/^data:image\/png;base64,/')) {
                    var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
                    var fileName = user._id.toString() + ".jpeg";
                    Jimp.read(Buffer.from(base64Data, 'base64'), (err, image) => {
                        if (err) throw err;
                        image
                        .resize(512, 512) // resize
                        .quality(60) // set JPEG quality
                        .write(publicPath+"/profile_images/"+fileName); // save
                      });
                }
                user.save((err, newUser) => {
                    res.status(200).send({ message: 'User information updated!' });
                });
            }
        });
    });

module.exports = app;