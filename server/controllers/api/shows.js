const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Show = require('../../models/Show');

const ensure = require('../ensure');
const util = require('../util');

const app = express.Router();

// This file handles paths to modify shows. These routes are prefixed by /api/shows/{ENDPOINT}

// Returns the active show.
app.get('/active',
  ensure.loggedIn,
  (req, res) => {
    util.getActiveShow().then(show => {
      return res.status(200).send(show);
    })
  });

// Returns the show specified by id.
app.get('/:show_id?',
  ensure.loggedIn,
  (req, res) => {
    if (req.params.show_id) {
      Show.findById(req.params.show_id, (err, doc) => {
        if (err) {
          console.log(err);
        }
        res.send(doc);
      });
    } else {
      Show.find({}).sort({ date: 'desc' }).exec((err, docs) => {
        if (err) {
          console.log(err);
        }
        res.send(docs);
      });
    }
  });

// Currently, this feature is not live.
app.delete('/:show_id',
  ensure.admin,
  (req, res) => {
    Show.findByIdAndDelete(req.params.show_id, (err, doc) => {
      if (err) {
        console.log('error deleting');
        res.status(500);
      } else {
        console.log(`deleted show ${req.params.show_id}`);
        res.status(200).send(doc);
      }
    });
  });

// Creates a show.
app.post('/',
  ensure.admin, [
    check('semester').optional().custom(value => {
      var semesterOptions = ['fall', 'spring']
      if (!semesterOptions.includes(value)) {
        return Promise.reject('Please select a semester from the dropdown.');
      } else {
        return true;
      }
    }),
    check('year').optional().isNumeric().withMessage('Show year must be a number.'),
    check('name').optional().isLength({ min: 0, max: 100 }).withMessage('Name field has max character count of 100.'),
    check('description').optional().isLength({ min: 0, max: 1000 }).withMessage('Description field has max character count of 1000.'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
    if (req.body.semester === 'fall') {
      date = new Date(req.body.year, 8);
    } else {
      date = new Date(req.body.year, 1);
    }
    var newShowData = {
      name: req.body.name,
      description: req.body.description,
      year: req.body.year,
      semester: req.body.semester,
      dances: req.body.dances,
      prefsOpen: req.body.prefsOpen,
      date: date
    };
    const newShowObj = new Show(newShowData);
    newShowObj.save(err => {
      if (err) {
        return res.status(500).send(err);
      }
      const io = req.app.get('socketio');
      io.emit('show', newShowObj);
      return res.status(200).send(newShowObj);
    });

  }
);

// TODO have this function give permissions to choreographers
// Sets the given show by id as the active show, and all other shows to inactive.
app.post('/:show_id/active-show',
  ensure.admin,
  (req, res) => {
    Show.updateMany({ isActive: true }, { isActive: false }, (err, res) => {
      if (err) {
        console.log(err);
      }
      Show.findByIdAndUpdate(req.params.show_id, {
        isActive: true
      }, { new: true }, (err, doc) => {
        if (err) {
          console.log(err);
        }
        res.status(200).send(doc);
      });
    });
  });

// Sets the selected show's prefsheets to be visible/open.
app.post('/:show_id/prefs',
  ensure.admin,
  (req, res) => {
    if (req.query.open != undefined) {
      Show.findById(req.params.show_id, async (err, doc) => {
        if (doc.prodConflictsOpen) {
          return res.status(400).send('Cannot open pref sheets while prod week availabilities are open.');
        }
        doc.prefsOpen = req.query.open;
        await doc.save();
        return res.status(200).send(doc);
      })
    }
  });

// Sets the selected show's prod availabilities to be visible/open.
app.post('/:show_id/prod-conflicts',
  ensure.admin,
  (req, res) => {
    if (req.query.open != undefined) {
      Show.findById(req.params.show_id, async (err, doc) => {
        if (err) {
          console.log(err);
        }
        if (doc.prefsOpen) {
          return res.status(400).send('Cannot open prod week availabilities when pref sheets are open.');
        }
        doc.prodConflictsOpen = req.query.open;
        await doc.save();
        return res.status(200).send(doc);
      })
    }
  });

module.exports = app;