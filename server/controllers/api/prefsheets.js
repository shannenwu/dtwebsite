const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Prefsheet = require('../../models/Prefsheet');

const ensure = require('../ensure');
const util = require('../util');

const app = express.Router();

// This file handles paths regarding prefsheets. These routes are prefixed by /api/prefsheets/{ENDPOINT}

// This endpoint fetches all prefsheets in the active show.
app.get('/user',
  ensure.admin,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    Prefsheet
      .find({ show: show_id })
      .populate('user', 'firstName lastName year imageUrl experience')
      .populate('rankedDances.dance', 'name')
      .sort('auditionNumber')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        res.status(200).send(docs);
      });
  }

);

// This endpoint fetches a prefsheet in the active show for the user_id.
app.get('/user/:user_id',
  ensure.sameUser,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    Prefsheet
      .findOne({ user: req.params.user_id, show: show_id })
      .populate('show')
      .exec((err, doc) => {
        if (err) {
          console.log(err);
        }
        res.status(200).send(doc);
      })
  }
);

// This function updates the conflicts and description of the prefsheet of the user_id.
app.post('/user/conflicts/:user_id', [
  check('conflictsDescription').optional().isLength({ min: 0, max: 1000 }).withMessage('Conflicts has max character count of 1000.'),
],
  ensure.sameUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }

    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;
    var conflictsData = {};

    if (showResponse.prodConflictsOpen) {
      conflictsData = {
        prodConflicts: req.body.conflicts,
        prodDescription: req.body.conflictsDescription
      }
    } else {
      conflictsData = {
        weeklyConflicts: req.body.conflicts,
        weeklyDescription: req.body.conflictsDescription
      }
    }

    var query = { user: req.params.user_id, show: show_id }
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };

    var updatedPrefSheetData = {
      user: req.params.user_id,
      show: show_id
    };

    Prefsheet.findOneAndUpdate(query, { ...updatedPrefSheetData, ...conflictsData }, options)
      .then(prefsheet => {
        res.status(200).send({ message: 'Conflicts updated!', prefsheet });
      })
      .catch(err => {
        console.log(err)
      });
  }
);

// This function updates the prefsheet of the user_id in the active show.
app.post('/user/:user_id',
  ensure.sameUser, [
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

    if (!req.user.affiliation || !req.user.year || (req.user.imageUrl === '/site_images/default-profile.jpeg')) {
      res.status(422).send('Please fill out your dancer info before submitting a prefsheet.')
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
        var lastPrefsheet = await Prefsheet.find({ show: show_id }).sort({ auditionNumber: -1 }).limit(1);
        var lastAuditionNumber = lastPrefsheet[0].auditionNumber;
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
        res.status(200).send({ message: 'Preference sheet updated!', prefsheet });
      })
      .catch(err => {
        console.log(err)
      });
  }
);

module.exports = app;