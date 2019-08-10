// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// Router added at "/api"
const app = express.Router();

// Import Schema
const Prefsheet = require('../../models/Prefsheet.js');
const Dance = require('../../models/Dance.js');
const util = require("../util.js");

// This file handles paths to return availabilities. These routes are prefixed by /api/schedule/{ENDPOINT}

// This endpoint fetches a prefsheet in the active show for the user_id if specified.
app.get('/:dance_id',
    // connect.ensureLoggedIn(),
    async (req, res) => {
        const showResponse = await util.getActiveShow();
        const isProd = showResponse.prodConflictsOpen;

        const danceObj = await Dance.findById(req.params.dance_id, 'acceptedDancers')

        const prefsheets = await Prefsheet
            .find({ 'user': { $in: danceObj.acceptedDancers }, 'show': showResponse._id },
                'user weeklyConflicts weeklyDescription prodConflicts prodDescription')
            .populate('user', 'firstName lastName');

        var timeToConflicts = {};
        const times = isProd ? util.getProdTimes() : util.getWeekTimes();
        times.forEach(timeOfDays => {
            timeOfDays.forEach(time => {
                timeToConflicts[time] = [];
            })
        });

        const interval = isProd ? util.getProdStartEnd() : util.getWeekStartEnd();

        prefsheets.forEach(prefsheet => {
            const userConflicts = isProd ? prefsheet.prodConflicts : prefsheet.weeklyConflicts;
            const description = isProd ? prefsheet.prodDescription: prefsheet.weeklyDescription;
            userConflicts.forEach(time => {
                var conflicts = timeToConflicts[time];
                var newConflicts = conflicts.concat({ 
                    firstName: prefsheet.user.firstName, 
                    lastName: prefsheet.user.lastName, 
                    description
                });
                timeToConflicts[time] = newConflicts;
            });
        });
        res.status(200).send({isProd, timeToConflicts, times, interval});
    }
);

module.exports = app;