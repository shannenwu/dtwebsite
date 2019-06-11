// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');

// Router added at "/api"
const app = express.Router();

// Import User Schema
const Show = require('../../models/show.js');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to modify shows. These routes are prefixed by /api/{ENDPOINT}

app.post('/shows',
    connect.ensureLoggedIn(), [
        check('semester').optional().custom(value => {
            var semesterOptions = ['fall', 'spring']
            if (!semesterOptions.includes(value)) {
                return Promise.reject('Please select a semester from the dropdown.');
            } else {
                return true;
            }
        }),
        check('year').optional().isNumeric().withMessage('Show year must be a number.'),
        check('name').optional().isLength({ min: 0, max: 100 }).withMessage('Name field has max character count of 100.'),
        check('description').optional().isLength({ min: 0, max: 1000 }).withMessage('Description field has max character count of 1000.'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }
        var newShowData = {
            name: req.body.name,
            description: req.body.description,
            year: req.body.year,
            semester: req.body.semester,
            dances: req.body.dances,
            prefsOpen: req.body.prefsOpen
        };
        const newShowObj = new Show(newShowData);
        newShowObj.save(err => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(newShowObj);
        });
    }
);

module.exports = app;