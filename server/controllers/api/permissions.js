// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');

// Router added at "/api"
const app = express.Router();

// Import Schemas
const User = require('../../models/User.js');
const Dance = require('../../models/Dance.js');
const Show = require('../../models/Show.js');
const util = require("../util.js");

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to get/modify/delete/create user data. These routes are prefixed by /api/permissions/{ENDPOINT}

// TODO CHECK VALIDATION
// TODO rewrite this logic. A lot of blocking statements. Also add try catch 
app.post('/choreographers',
    connect.ensureLoggedIn(),
    async (req, res) => {
        if (!req.user.isAdmin) {
            return res.status(403).send('Unauthorized request.')
        }
        var showResponse = await util.getActiveShow();
        var show_id = showResponse._id;

        // Get all dances in active show.
        var query = { show: show_id }
        const dances = await Dance.find(query, 'choreographers');

        allChoreographers = []
        dances.forEach(dance => {
            allChoreographers = allChoreographers.concat(dance.toObject().choreographers);
        })

        await User.updateMany({ isChoreographer: true }, { isChoreographer: false });

        await User.updateMany(
            { _id: { $in: allChoreographers } },
            { $set: { isChoreographer: true } }
        );

        res.status(200).send('Choreographer permissions updated.');
    }
);

// TODO get permissions
app.get('/:user_id?', (req, res) => {
    if (req.params.user_id) {
        User.findById(req.params.user_id, (err, doc) => {
            res.send(doc);
        });
    } else {
        User.find({}).sort({ firstName: 'ascending' }).exec((err, docs) => {
            res.send(docs);
        });
    }
});

// TODO add/remove admin




module.exports = app;