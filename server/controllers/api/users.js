// dependencies
const axios = require('axios');
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');
const Jimp = require('jimp');

// Router added at "/api"
const app = express.Router();

// Import Schemas
const User = require('../../models/User.js');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to get/modify/delete/create user data. These routes are prefixed by /api/users/{ENDPOINT}

// TODO CHECK VALIDATION

app.get('/:user_id?', (req, res) => {
    if (req.params.user_id) {
        User.findById(req.params.user_id, (err, doc) => {
            res.send(doc);
        });
    } else {
        User.find({}).sort({ firstName: 'ascending' }).exec((err, docs) => {
            if (err) {
                console.log(err);
            }
            res.send(docs);
        });
    }
});


app.post('/:user_id',
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
        check('year').isNumeric().withMessage('Please select a valid graduation year.'),
        check('livingGroup').optional().isLength({ min: 0, max: 100 }).withMessage('Living group has max character count of 100.'),
        check('experience').optional().isLength({ min: 0, max: 1000 }).withMessage('Experience field has max character count of 1000.'),
    ],
    (req, res) => {
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
            _id: req.params.user_id
        }, updatedUserData, { new: true }).then((user) => {
            if (user === null) {
                res.status(403).send('Unauthorized request.');
            } else {
                var fileName = user._id.toString() + ".jpeg";
                var databaseUrl = user.imageUrl;

                // This processes images from the cropper.
                if (req.body.image.includes('data:image\/png;base64,')) {
                    imageUrl = publicPath + "/profile_images/" + fileName;
                    databaseUrl = "/profile_images/" + fileName;
                    var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
                    Jimp.read(Buffer.from(base64Data, 'base64'), (err, image) => {
                        if (err) throw err;
                        image
                            .resize(512, 512) // resize
                            .quality(30) // set JPEG quality
                            .write(imageUrl);
                    });
                }
                user.imageUrl = databaseUrl;

                user.save((err, newUser) => {
                    res.status(200).send({ message: 'User information updated!' });
                });
            }
        });
    }
);

module.exports = app;