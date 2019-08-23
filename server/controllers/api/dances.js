const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Dance = require('../../models/Dance');

const ensure = require('../ensure');

const app = express.Router();

// This file handles paths to get/modify dances. These routes are prefixed by /api/dances/{ENDPOINT}

// Returns accepted dancers in this dance.
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