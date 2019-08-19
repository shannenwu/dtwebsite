const express = require('express');
const connect = require('connect-ensure-login');

const User = require('../../models/User');
const Dance = require('../../models/Dance');

const ensure = require('../ensure');
const util = require('../util');

const app = express.Router();

// This file handles paths to modify permissions. These routes are prefixed by /api/permissions/{ENDPOINT}

// This function updates choreographer permissions for all dances in the active showl
// TODO rewrite this logic to remove blocking statements 
app.post('/choreographers',
  ensure.admin,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    // Get all dances in active show.
    var query = { show: show_id };
    const dances = await Dance.find(query, 'choreographers');

    allChoreographers = [];
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

// TODO add/remove admin route.
module.exports = app;