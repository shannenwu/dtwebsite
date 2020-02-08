const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator/check');

const Dance = require('../../models/Dance');
const Prefsheet = require('../../models/Prefsheet');

const ensure = require('../ensure');
const util = require('../util');

const app = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// This file handles paths to get/modify dances. These routes are prefixed by /api/dances/{ENDPOINT}

// TODO CONSOLIDATE WITH OTHER GET DANCE FUNCTION
// Returns dance specificed by id and populates acceptedDancers field.
app.get('/accepted-dancers/:dance_id',
  ensure.choreographer,
  (req, res) => {
    Dance
      .findById(req.params.dance_id)
      .populate('acceptedDancers', 'firstName lastName year email')
      .exec((err, doc) => {
        if (err) {
          console.log(err);
        }
        res.send(doc);
      });
  });

// Performs a status update for the given dance for the prefsheet of the user id in active show.
app.post('/status-update/:dance_id/:user_id',
  ensure.choreographer,
  async (req, res) => {
    // TODO check if user is a choreographer in this dance
    // Find prefsheet corresponding to user.
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;
    var prefsheet = await Prefsheet.findOne({ user: req.params.user_id, show: show_id });

    if (prefsheet) {
      // Update user's prefsheet.
      var query = { '_id': prefsheet._id, 'rankedDances.dance': req.params.dance_id };
      var update = { '$set': { 'rankedDances.$.status': req.body.status } };
      var options = { new: true, runValidators: true };

      Prefsheet
        .findOneAndUpdate(query, update, options)
        .exec((err, doc) => {
          if (err) {
            return res.status(400).send('Error updating prefsheet!')
          }

          return res.status(200).send('Prefsheet updated!');
        });
    } else {
      // User never submitted a prefsheet.
      return res.status(200).send('No prefsheet found.');
    }

  }
);

// Remove a dancer from the acceptedDancers field in this dance.
app.post('/remove-dancer/:dance_id/:user_id',
  ensure.choreographer,
  (req, res) => {
    var update = { $pull: { acceptedDancers: new ObjectId(req.params.user_id) } };
    var options = { new: true };
    Dance
      .findByIdAndUpdate(req.params.dance_id, update, options)
      .populate('acceptedDancers', 'firstName lastName year email')
      .exec((err, doc) => {
        if (err) {
          console.log(err);
        }
        res.send(doc);
      });
  });

// Add a dancer to the acceptedDancers field in this dance.
app.post('/add-dancer/:dance_id/:user_id',
  ensure.choreographer,
  (req, res) => {
    var update = { $push: { acceptedDancers: new ObjectId(req.params.user_id) } };
    var options = { new: true };
    Dance
      .findByIdAndUpdate(req.params.dance_id, update, options)
      .populate('acceptedDancers', 'firstName lastName year email')
      .exec((err, doc) => {
        if (err) {
          console.log(err);
        }
        res.send(doc);
      });
  });

// Return the dance for this id.
app.get('/:dance_id',
  ensure.loggedIn,
  (req, res) => {
    Dance.findById(req.params.dance_id, (err, doc) => {
      if (err) {
        console.log(err);
      }
      res.send(doc);
    });
  });

// Return all dances for the given show id.
app.get('/:show_id/all',
  ensure.loggedIn,
  (req, res) => {
    Dance
      .find({ show: req.params.show_id })
      .populate('choreographers')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        res.send(docs);
      });
  });

// Update a dance.
app.post('/update/:dance_id',
  ensure.admin, [
  check('name').isLength({ min: 1, max: 100 }).withMessage('Name field is required and has max character count of 100.'),
  check('description').optional().isLength({ min: 0, max: 1000 }).withMessage('Description field has max character count of 1000.'),
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }

    var updatedDanceData = {
      name: req.body.name,
      description: req.body.description,
      choreographers: req.body.choreographers,
      style: req.body.style,
      level: req.body.level,
      videoUrl: req.body.videoUrl,
      auditionNote: req.body.auditionNote,
    };

    Dance
      .findOneAndUpdate({ _id: req.params.dance_id }, updatedDanceData, { new: true })
      .then(doc => {
        if (doc === null) {
          res.status(400).send('Cannot find dance with this id.');
        } else {
          const io = req.app.get('socketio');
          io.emit("edit dance", doc);
          res.status(200).send({ message: 'Dance edited!' });
        }
      });
  }
);

// Create a dance.
app.post('/',
  ensure.admin, [
  check('name').isLength({ min: 1, max: 100 }).withMessage('Name field is required and has max character count of 100.'),
  check('description').optional().isLength({ min: 0, max: 1000 }).withMessage('Description field has max character count of 1000.'),
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }

    var newDanceData = {
      name: req.body.name,
      description: req.body.description,
      choreographers: req.body.choreographers,
      style: req.body.style,
      level: req.body.level,
      videoUrl: req.body.videoUrl,
      auditionNote: req.body.auditionNote,
      show: req.body.show._id,
      acceptedDancers: [],
    };

    const newDanceObj = new Dance(newDanceData);
    newDanceObj.save(err => {
      if (err) {
        return res.status(500).send(err);
      }

      const io = req.app.get('socketio');
      io.emit("dance", newDanceObj);
      return res.status(200).send({ message: 'Dance added!' });
    });

  }
);

// Currently, this feature is not live.
app.delete("/:dance_id",
  ensure.admin,
  (req, res) => {
    Dance.findByIdAndDelete(req.params.dance_id, (err, doc) => {
      if (err) {
        console.log("error deleting");
        res.status(500);
      } else {
        console.log(`deleted dance ${req.params.dance_id}`);
        res.status(200).send(doc);
      }
    });
  });

module.exports = app;