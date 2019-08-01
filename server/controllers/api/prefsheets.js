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

// This endpoint fetches a prefsheet in the active show for the user_id if specified.
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
    }
);


// This function updates the prefsheet of the user_id in the active show.
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

        // Checks for duplicates.
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

// TODO fix.
// Rejects all pending dancer cards from this dance. Needs to send a socket message.
app.post('/auditions/reject-remaining/:dance_id',
    connect.ensureLoggedIn(),
    async (req, res) => {
        if (!req.user.isAdmin || !req.user.isChoreographer) {
            return res.status(403).send('Unauthorized request.')
        }

        var query = {
            'rankedDances': { '$elemMatch': { 'dance': req.params.dance_id, 'status': { '$ne': 'accepted' } } }
        }
        var update = { '$set': { 'rankedDances.$.status': 'rejected' } };
        var options = { runValidators: true };

        await Prefsheet.updateMany(query, update, options);

        Prefsheet
            .find(query)
            .populate('user', 'firstName lastName year imageUrl')
            .populate('rankedDances.dance', 'name')
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send('Error finding updated prefsheets!')
                }
                docs.forEach(doc => {
                    doc.getInfo((err, statsObj, danceRankStatusObj) => {
                        if (err) {
                            console.log(err);
                        }
                        docInfo = {
                            'stats': statsObj,
                            'prefsheet': doc,
                            'danceStatuses': danceRankStatusObj
                        };
                        const io = req.app.get('socketio');
                        io.emit('updated card', docInfo);
                    })
                })
                return res.status(200).send(docs);
            })
    }
);

// Takes in query of last prefsheet_id fetched for scroll purposes.
// Returns all prefsheets who preffed this dance and have not been rejected.
app.get('/auditions/:dance_id',
    connect.ensureLoggedIn(),
    async (req, res) => {
        if (!req.user.isAdmin || !req.user.isChoreographer) {
            return res.status(403).send('Unauthorized request.')
        }

        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;
        var dance_id = new ObjectId(req.params.dance_id);

        var query = { 'show': show_id, 'rankedDances.dance': dance_id };
        // Return prefsheets in the active show who have preffed this dance.
        Prefsheet
            .find(query)
            .populate('user', 'firstName lastName year imageUrl')
            .populate('rankedDances.dance', 'name')
            .exec(async (err, docs) => {
                if (err) {
                    console.log(err);
                }

                accepted_docs = [];
                pending_docs = [];
                docs.forEach(doc => {
                    doc.getInfo((err, statsObj, danceRankStatusObj) => {
                        if (err) {
                            console.log(err);
                        }

                        docInfo = {
                            'stats': statsObj,
                            'prefsheet': doc,
                            'danceStatuses': danceRankStatusObj
                        };

                        if (danceRankStatusObj[req.params.dance_id].status === 'accepted') {
                            accepted_docs.push(docInfo);
                        } else if (danceRankStatusObj[req.params.dance_id].status === 'pending' ||
                            danceRankStatusObj[req.params.dance_id].status === 'return') {
                            pending_docs.push(docInfo);
                        }
                    })
                });

                custom = (a, b) => {
                    rankA = a.danceStatuses[req.params.dance_id].rank;
                    rankB = b.danceStatuses[req.params.dance_id].rank;
                    return rankA - rankB || a.prefsheet.auditionNumber - b.prefsheet.auditionNumber;
                }

                accepted_docs.sort(custom);
                pending_docs.sort(custom);

                if (req.query.last_id) {
                    var last_id = new ObjectId(req.query.last_id);
                    var lastFetchedIndex = pending_docs.findIndex(
                        docInfo => docInfo.prefsheet._id.equals(last_id));
                    var endIndex = Math.min(lastFetchedIndex + 26, pending_docs.length - 1);
                    var hasMore = endIndex < pending_docs.length - 1;
                    pending_docs = pending_docs.slice(lastFetchedIndex + 1, endIndex);
                } else { // first load 25 elements
                    pending_docs = pending_docs.slice(0, 25);
                }

                res.status(200).send({
                    'accepted': accepted_docs,
                    'pending': pending_docs,
                    'hasMore': hasMore
                });
            });
    }
);


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

        var query = { '_id': req.params.prefsheet_id, 'rankedDances.dance': req.params.dance_id };
        var update = { '$set': { 'rankedDances.$.status': req.body.status } };
        var options = { new: true, runValidators: true };

        Prefsheet
            .findOneAndUpdate(query, update, options)
            .populate('user', 'firstName lastName year imageUrl')
            .populate('rankedDances.dance', 'name')
            .exec((err, doc) => {
                if (err) {
                    return res.status(400).send('Error updating prefsheet!')
                }
                doc.getInfo((err, statsObj, danceRankStatusObj) => {
                    if (err) {
                        console.log(err);
                    }
                    docInfo = {
                        'stats': statsObj,
                        'prefsheet': doc,
                        'danceStatuses': danceRankStatusObj
                    };
                })

                const io = req.app.get('socketio');
                io.emit('updated card', docInfo);
                return res.status(200).send(doc);
            })
    }
);


module.exports = app;