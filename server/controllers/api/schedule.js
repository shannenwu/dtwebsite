const express = require('express');

const Prefsheet = require('../../models/Prefsheet');
const Dance = require('../../models/Dance');

const ensure = require('../ensure');
const util = require('../util');

const app = express.Router();

// This file handles paths to return availabilities. These routes are prefixed by /api/schedule/{ENDPOINT}

// Endpoint to send all default times to the client. Kind of gross, rewrite later.
app.get('/constants',
  ensure.loggedIn,
  (_req, res) => {
    const timeConstants = { weekStartDate: util.weekStartDate, weekDays: util.weekDays, weekStartHour: util.weekStartHour, weekEndHour: util.weekEndHour, prodStartDate: util.prodStartDate, prodDays: util.prodDays, prodStartHour: util.prodStartHour, prodEndHour: util.prodEndHour };
    res.status(200).send(timeConstants);
  })
// This endpoint fetches a prefsheet in the active show for the user_id if specified.
app.get('/:dance_id',
  ensure.loggedIn,
  async (req, res) => {
    const showResponse = await util.getActiveShow();
    const isProd = showResponse.prodConflictsOpen;

    const danceObj = await Dance.findById(req.params.dance_id, 'acceptedDancers choreographers');
    const users = danceObj.acceptedDancers.concat(danceObj.choreographers);
    const prefsheets = await Prefsheet
      .find({ 'user': { $in: users }, 'show': showResponse._id },
        'user weeklyConflicts weeklyDescription prodConflicts prodDescription')
      .populate('user', 'firstName lastName');

    var timeToConflicts = {};
    const times = isProd ? util.getProdTimes() : util.getWeekTimes();

    // Initialize the object with the possible time slots.
    times.forEach(timeOfDays => {
      timeOfDays.forEach(time => {
        timeToConflicts[time.toISOString()] = [];
      })
    });

    const interval = isProd ? util.getProdStartEnd() : util.getWeekStartEnd();

    var choreographerTimes = [];
    prefsheets.forEach(prefsheet => {
      const userConflicts = isProd ? prefsheet.prodConflicts : prefsheet.weeklyConflicts;
      const description = isProd ? prefsheet.prodDescription : prefsheet.weeklyDescription;
      // Check if the user is unavailable in the generated time to conflicts dictionary.
      userConflicts.forEach(time => {
        // Record all times the choreographer is not available. Practices will usually never be 
        // scheduled in these times.
        if (danceObj.choreographers.includes(prefsheet.user._id)) {
          choreographerTimes.push(time);
        }
        // Check if this time is viewable in the current time to conflicts window.
        if (timeToConflicts.hasOwnProperty(time)) {
          var conflicts = timeToConflicts[time];
          var newConflicts = conflicts.concat({
            firstName: prefsheet.user.firstName,
            lastName: prefsheet.user.lastName,
            description
          });
          timeToConflicts[time] = newConflicts;
        }
      });
    });
    res.status(200).send({ isProd, choreographerTimes, timeToConflicts, times, interval });
  }
);

module.exports = app;