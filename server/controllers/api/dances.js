// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const path = require('path');

// Router added at "/api"
const app = express.Router();

// Import Dance, Show Schema
const Dance = require('../../models/Dance.js');
const Show = require('../../models/Show.js');

const { check, validationResult } = require('express-validator/check');

const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to modify dances. These routes are prefixed by /api/dances/{ENDPOINT}

// TODO VALIDATION LATER

app.get('/:dance_id', (req, res) => {
    Dance.findById(req.params.dance_id, (err, doc) => {
        res.send(doc);
    });
});

// TODO to put in shows or this file
app.get('/:show_id/all', (req, res) => {
    Dance
        .find({show: req.params.show_id})
        .populate('choreographers')
        .exec((err, docs) => {
        res.send(docs);
    });
});

// Create a dance.
app.post('/',
    connect.ensureLoggedIn(), [
        check('choreographers')
        .custom(data => 
            Array.isArray(data) 
               && 
            data.length).withMessage('Choreographers field cannot be empty.'),
        check('name').optional().isLength({ min: 0, max: 100 }).withMessage('Name field has max character count of 100.'),
        check('description').optional().isLength({ min: 0, max: 1000 }).withMessage('Description field has max character count of 1000.'),
    ],
    (req, res, next) => {
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
            return res.status(200).send(newDanceObj);
        });

    }
);

app.delete("/:dance_id", (req, res) => {
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