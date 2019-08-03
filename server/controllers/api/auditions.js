// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// Router added at "/api"
const app = express.Router();

// Import Schemas
const Dance = require('../../models/Dance.js');
const Prefsheet = require('../../models/Prefsheet.js');
const util = require("../util.js");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// This file handles paths for audition actions. These routes are prefixed by /api/auditions/{ENDPOINT}


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
                var numbers = Array.from({ length: max_num }, (_v, k) => k + 1);
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


// Rejects all pending dancer cards from this dance, and writes the accepted dancers into the Dance model.
app.post('/finish-selection/:dance_id',
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
                const updatedDocs = {};
                docs.forEach(doc => {
                    doc.getInfo((err, statsObj, danceRankStatusObj, actionableDances) => {
                        if (err) {
                            console.log(err);
                        }
                        docInfo = {
                            'prefsheet': doc,
                            'stats': statsObj,
                            'danceStatuses': danceRankStatusObj,
                            'actionableDances': actionableDances
                        };
                        updatedDocs[doc._id] = docInfo;
                    })
                })
                const io = req.app.get('socketio');
                io.emit('bulk update cards', updatedDocs);
            });
        
        var queryAccepted = {
            'rankedDances': { '$elemMatch': { 'dance': req.params.dance_id, 'status': { '$eq': 'accepted' } } }
        }
        const acceptedPrefsheets = await Prefsheet.find(queryAccepted);
        const acceptedDancers = acceptedPrefsheets.map(prefsheet => prefsheet.user);
        
        var danceUpdate = { selectionComplete: true, acceptedDancers: acceptedDancers };
        // update selectionComplete field and acceptedDancers field with user_ids
        await Dance.findByIdAndUpdate(req.params.dance_id, danceUpdate);
        return res.status(200).send({message: 'Dancer selection complete!'});
    }
);

// Returns count of actionable and pending.
app.get('/get-count/:dance_id',
    connect.ensureLoggedIn(),
    async (req, res) => {
        if (!req.user.isAdmin || !req.user.isChoreographer) {
            return res.status(403).send('Unauthorized request.')
        }

        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;
        var dance_id = new ObjectId(req.params.dance_id);

        var query = {
            'show': show_id,
            'rankedDances': { '$elemMatch': { 'dance': req.params.dance_id, 'status': { '$in': ['pending', 'return'] } } }
        }
        // Return prefsheets in the active show who have preffed this dance.
        Prefsheet
            .find(query, (err, docs) => {
                if (err) {
                    console.log(err);
                }

                var pendingCount = 0;
                var actionableCount = 0;
                docs.forEach(doc => {
                    doc.getInfo((err, _statsObj, _danceRankStatusObj, actionableDances) => {
                        if (err) {
                            console.log(err);
                        }
                        pendingCount += 1;
                        
                        var actionable = actionableDances.some((id) => {
                            return id.equals(dance_id);
                        });
                        actionableCount += actionable ? 1 : 0;
                    })
                });

                res.status(200).send({
                    'pendingCount': pendingCount,
                    'actionableCount': actionableCount
                });
            });
    }
);

// Takes in query of last prefsheet_id fetched for scroll purposes.
// Returns all prefsheets who preffed this dance and have not been rejected.
app.get('/:dance_id',
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
                    doc.getInfo((err, statsObj, danceRankStatusObj, actionableDances) => {
                        if (err) {
                            console.log(err);
                        }

                        docInfo = {
                            'prefsheet': doc,
                            'stats': statsObj,
                            'danceStatuses': danceRankStatusObj,
                            'actionableDances': actionableDances
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
app.post('/:dance_id/:prefsheet_id',
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
                doc.getInfo((err, statsObj, danceRankStatusObj, actionableDances) => {
                    if (err) {
                        console.log(err);
                    }
                    docInfo = {
                        'prefsheet': doc,
                        'stats': statsObj,
                        'danceStatuses': danceRankStatusObj,
                        'actionableDances': actionableDances
                    };
                })

                const io = req.app.get('socketio');
                io.emit('updated card', docInfo);
                return res.status(200).send(doc);
            })
    }
);


module.exports = app;