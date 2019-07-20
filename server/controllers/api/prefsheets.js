// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');

// Router added at "/api"
const app = express.Router();

// Import PrefSheet Schema
const Prefsheet = require('../../models/Prefsheet.js');
const util = require("../util.js");

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to modify prefsheets. These routes are prefixed by /api/prefsheets/{ENDPOINT}

//TODO VALIDATION LATER

app.get('/user/:user_id?',
    connect.ensureLoggedIn(),
    async (req, res) => {
        var show_id = req.query.show_id ? req.query.show_id : await util.getActiveShow()._id;

        if (req.params.user_id) {
            Prefsheet
                .findOne({ user: req.params.user_id, show: show_id })
                .populate('show')
                .exec((err, doc) => {
                    if (err) {
                        console.log(err); // TODO HANDLE LATER
                    }
                    res.status(200).send(doc);
                })
        } else { // TODO sort later
            Prefsheet
                .find({ show: show_id })
                .populate('show')
                .exec((err, docs) => {
                    if (err) {
                        console.log(err); // TODO HANDLE LATER
                    }
                    res.status(200).send(docs);
                });
        }
    });

app.post('/user/:user_id',
    connect.ensureLoggedIn(), [
        check('rankedDances')
            .custom(data =>
                Array.isArray(data)
                &&
                data.length).withMessage('At least one dance must be preffed.'),
        check('maxDances').isInt({ gt: 0, lt: 5 }).withMessage('Desired dances must be between 1 and 4.'),
        check('show')
            .custom(data =>
                data.prefsOpen
                ).withMessage('Prefs are not open for this show.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }

        var show_id = req.body.show ? req.body.show : await util.getActiveShow()._id;

        // Strips empty dances from the list. 
        var filteredRankedDances = req.body.rankedDances.filter((rankedDance) => {
            return rankedDance.dance !== '';
        });

        if (!filteredRankedDances.length) {
            return res.status(400).send('At least one dance must be preffed.')
        }

        var query = { user: req.params.user_id, show: show_id }
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };

        var updatedPrefSheetData = {
            user: req.params.user_id,
            show: show_id,
            maxDances: req.body.maxDances,
            rankedDances: filteredRankedDances 
        };

        Prefsheet.findOneAndUpdate(query, updatedPrefSheetData, options)
            .then(prefsheet => {
                res.status(200).send({ message: 'Preference sheet updated!' });
            })
            .catch(err => {
                console.log(err)
            });
    }
);

// TODO add some validation logic here.
app.post('/generate-audition-numbers/:show_id?',
    connect.ensureLoggedIn(), 
    async (req, res) => {
        var show_id = req.params.show_id ? req.params.show_id : await util.getActiveShow()._id;

        var query = { show: show_id }

        Prefsheet.find(query)
            .then(prefsheets => {
                const max_num = prefsheets.length;
                var numbers = Array.from({length: max_num}, (v, k) => k+1); 
                numbers.sort(() => Math.random() - 0.5);
                Prefsheet.bulkWrite(
                    prefsheets.map((pref, index) => 
                       ({
                         updateOne: {
                           filter: { _id: pref._id },
                           update: { auditionNumber: numbers[index] }
                         }
                       })
                     )
                   )
                res.status(200).send({ message: 'Audition numbers generated!' });
            })
            .catch(err => {
                console.log(err)
            });
    }
);

module.exports = app;