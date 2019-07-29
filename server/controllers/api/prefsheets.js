// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');

// Router added at "/api"
const app = express.Router();

// Import PrefSheet Schema
const Prefsheet = require('../../models/Prefsheet.js');
const util = require("../util.js");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to modify prefsheets. These routes are prefixed by /api/prefsheets/{ENDPOINT}

app.get('/user/:user_id?',
    connect.ensureLoggedIn(),
    async (req, res) => {
        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;

        if (req.params.user_id) {
            Prefsheet
                .findOne({ user: req.params.user_id, show: show_id })
                .populate('show')
                .exec((err, doc) => {
                    if (err) {
                        console.log(err);
                    }
                    res.status(200).send(doc);
                })
        } else {
            Prefsheet
                .find({ show: show_id })
                .populate('show')
                .exec((err, docs) => {
                    if (err) {
                        console.log(err);
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
        check('maxDances').isInt({ gt: 0, lt: 5 }).withMessage('Desired dances must be between 1 and 4.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }

        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;
        var lateData = {} // defaults to empty

        if (!showResponse.prefsOpen) {
            // Non-admins cannot submit late prefsheets. 
            // Admin must include late flag to submit a late prefsheet.
            if (!req.user.isAdmin) {
                return res.status(400).send('Prefs are not open for this show.')
            } else if (req.user.isAdmin && req.query.late) {
                var lastAuditionNumber = await Prefsheet.countDocuments({ show: show_id });
                lateData = { isLate: true, auditionNumber: lastAuditionNumber + 1 };
            }
        }

        // Have the user submit on their own account if prefs are still open.
        if (showResponse.prefsOpen && req.query.late) {
            return res.status(400).send('Late prefsheets cannot be added because prefs are still open.')
        }

        // Strips empty dances from the list. 
        var filteredRankedDances = req.body.rankedDances.filter((rankedDance) => {
            return rankedDance.dance !== '';
        });

        if (!filteredRankedDances.length) {
            return res.status(400).send('At least one dance must be preffed.')
        }

        let seen = new Set();
        var hasDuplicates = filteredRankedDances.some((currentObject) => {
            return seen.size === seen.add(currentObject.dance).size;
        });

        if (hasDuplicates) {
            return res.status(400).send('Each dance can only be preffed once.')
        }

        var query = { user: req.params.user_id, show: show_id }
        var options = { upsert: true, new: true, setDefaultsOnInsert: true };

        var updatedPrefSheetData = {
            user: req.params.user_id,
            show: show_id,
            maxDances: req.body.maxDances,
            rankedDances: filteredRankedDances
        };

        Prefsheet.findOneAndUpdate(query, { ...updatedPrefSheetData, ...lateData }, options)
            .then(prefsheet => {
                res.status(200).send({ message: 'Preference sheet updated!' });
            })
            .catch(err => {
                console.log(err)
            });
    }
);


// Generates audition numbers for ALL prefsheets in the database, including late prefsheets.
app.post('/generate-audition-numbers',
    connect.ensureLoggedIn(),
    async (req, res) => {
        if (!req.user.isAdmin) {
            return res.status(403).send('Unauthorized request.')
        }
        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;

        var query = { show: show_id }

        Prefsheet.find(query)
            .then(prefsheets => {
                const max_num = prefsheets.length;
                var numbers = Array.from({ length: max_num }, (v, k) => k + 1);
                numbers.sort(() => Math.random() - 0.5);
                Prefsheet.bulkWrite(
                    prefsheets.map((pref, index) =>
                        ({
                            updateOne: {
                                filter: { _id: pref._id },
                                update: { auditionNumber: numbers[index], isLate: false }
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

// Returns all the visible prefsheets for this dance, which includes accepted cards, pending cards,
// and return if not placed cards.
app.get('/auditions/:dance_id',
    connect.ensureLoggedIn(),
    async (req, res) => {
        if (!req.user.isAdmin || !req.user.isChoreographer) {
            return res.status(403).send('Unauthorized request.')
        }

        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;
        dance_id = new ObjectId(req.params.dance_id);

        var query = { 'show': show_id, 'rankedDances.dance': dance_id };
        // Return prefsheets in the active show who have preffed this dance.
        Prefsheet
            .find(query)
            .populate('user', 'firstName lastName year')
            .populate('rankedDances.dance', 'name')
            .exec(async (err, docs) => {
                if (err) {
                    console.log(err);
                }

                accepted_docs = [];
                pending_docs = [];
                return_docs = [];

                for (var index in docs) {
                    var doc = docs[index];
                    doc.isActionable(dance_id, (err, actionable, statsObj) => {
                        if (err) {
                            console.log(err);
                        }
                        docInfo = { 'stats': statsObj, 'prefsheet': doc, 'actionable': actionable };
                        if (statsObj.status === 'accepted') {
                            accepted_docs.push(docInfo);
                        } else if (statsObj.status === 'pending') {
                            pending_docs.push(docInfo);
                        } else if (statsObj.status === 'return') {
                            return_docs.push(docInfo);
                        }
                    })
                }
                // TODO test the sort 
                custom = (a, b) => {
                    return a.stats.rank - b.stats.rank || a.prefsheet.auditionNumber - b.prefsheet.auditionNumber;
                }

                res.status(200).send({
                    'accepted': accepted_docs.sort(custom),
                    'pending': pending_docs.sort(custom),
                    'return': return_docs.sort(custom)
                });
            });
    });


// Performs a status update for the given dance in the given prefsheet.
app.post('/auditions/:dance_id/:prefsheet_id',
    connect.ensureLoggedIn(),
    (req, res) => {
        if (!req.user.isAdmin || !req.user.isChoreographer) {
            return res.status(403).send('Unauthorized request.')
        }

        // TODO check if actions are allowed
        // if (!prevDocInfo.actionable) {
        //     return res.status(400).send('Unable to take action on this card.');
        // }
        // TODO validation if choreographer is of this dance

        var query = { '_id': req.params.prefsheet_id, 'rankedDances.dance': req.params.dance_id };
        var update = { '$set': { 'rankedDances.$.status': req.body.status } };
        var options = { new: true, runValidators: true };

        Prefsheet
            .findOneAndUpdate(query, update, options)
            .populate('user', 'firstName lastName year')
            .populate('rankedDances.dance', 'name')
            .exec((err, doc) => {
                if (err) {
                    return res.status(400).send('Error updating prefsheet!')
                }

                const newDocInfo = doc.isActionable(dance_id, (err, actionable, statsObj) => {
                    if (err) {
                        console.log(err);
                    }
                    return { 'stats': statsObj, 'prefsheet': doc, 'actionable': actionable };
                })
                // emit to specific dance room
                const room = 'room_' + req.params.dance_id;
                const io = req.app.get('socketio');
                if (req.body.status === 'accepted') {
                    // TODO accept needs to be green on all relevant cards
                    io.in(room).emit('accepted card', newDocInfo);
                    return res.status(200).send(doc);
                } else if (req.body.status === 'rejected') {
                    io.in(room).emit('remove card', newDocInfo);
                    // handle case where this card can be returned if marked

                    // handle case where it goes to the next window
                    newDances = newDocInfo.stats.actionableDances
                                .filter(danceId => !req.body.actionableDances.includes(danceId.toString()));
                    console.log(newDances);
                    // newDances should usually contain only one new dance unless the database was modified
                    // during the execution of this call to allow more dances.
                    newDances.forEach(danceId => {
                        io.in('room_' + danceId).emit('new pending card', newDocInfo);
                    })
                    // io.in(nextRoom).emit('new pending card', newDocInfo);
                    return res.status(200).send(newDocInfo);
                }
            })
    }
);

// TODO REMOVE LATER FOR TESTING ONLY TO RESET ALL PREFSHEETS IN ACTIVE SHOW
app.get('/reset',
    // connect.ensureLoggedIn(),
    async (req, res) => {
        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;

        const response = await Prefsheet.updateMany({ show: show_id }, {
            '$set': {
                'rankedDances.$[].status': 'pending'
            }
        })
        return res.status(200).send({ message: 'prefsheets reset' });
    });

module.exports = app;