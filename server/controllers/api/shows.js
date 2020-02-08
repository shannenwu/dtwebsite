const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Show = require('../../models/Show');
const Dance = require('../../models/Dance');

const ensure = require('../ensure');
const util = require('../util');

const app = express.Router();

// This file handles paths to get/modify shows. These routes are prefixed by /api/shows/{ENDPOINT}

// Returns a map of show (S19) to show name and dances info, and the shows options by most recent.
app.get('/show-map',
  async (req, res) => {
    // Generate show options
    var showMap = {};
    const shows = await Show.find({}, 'name year semester date').sort({ date: 'desc' });
    const showOptions = shows.map(showObj => {
      const prefix = showObj.semester;
      const yr = showObj.year.toString().substring(2);
      const value = prefix + yr;
      const keyText = value + ' | ' + showObj.name;
      showMap[value] = { 'name': showObj.name, 'dances': [] };
      return {
        key: keyText,
        text: keyText,
        value,
        id: showObj._id
      }
    });

    // Fill in dances
    const dances = await Dance.find({}, 'name style level description videoUrl auditionNote').populate('show', 'name year semester date');
    dances.forEach(danceObj => {
      var showKey = danceObj.show.semester + danceObj.show.year.toString().substring(2);
      var currentDances = showMap[showKey]['dances'];
      showMap[showKey]['dances'] = currentDances.concat(danceObj);
    });

    // Sort dances in each show by style, then level within style
    const sortingStyleArray = ["contemp", "fusion", "ballet", "tap", "latin", "latin/musical theater", "urban", "hip hop", "breaking, old-school hip hop, locking", "step", "heels", "bhangra", "african/carribean"];
    const sortingLevelArray = ["beginner", "beg/int", "int", "int/adv", "advanced", "all levels"];

    for (let [_showKey, value] of Object.entries(showMap)) {
      var danceList = value['dances'];
      danceList.sort((a, b) => {
        aStyleIndex = sortingStyleArray.indexOf(a.style);
        bStyleIndex = sortingStyleArray.indexOf(b.style);
        aLevelIndex = sortingLevelArray.indexOf(a.level);
        bLevelIndex = sortingLevelArray.indexOf(b.level);
        if (aStyleIndex === bStyleIndex) {
          return (aLevelIndex < bLevelIndex) ? -1 : (aLevelIndex > bLevelIndex) ? 1 : 0;
        } else {
          return (aStyleIndex < bStyleIndex) ? -1 : 1;
        }
      })
    }

    res.status(200).send({ 'showMap': showMap, 'showOptions': showOptions });
  }
)

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
  check('semester').custom(value => {
    var semesterOptions = ['F', 'S']
    if (!semesterOptions.includes(value)) {
      return Promise.reject('Select a semester from the dropdown.');
    } else {
      return true;
    }
  }),
  check('year').isNumeric().withMessage('Show year must be a number.'),
  check('name').optional().isLength({ min: 0, max: 50 }).withMessage('Name field has max character count of 50.'),
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
    // Create a general date for fall/spring for sorting.
    if (req.body.semester === 'F') {
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
    Show.updateMany({ isActive: true }, { isActive: false }, (err) => {
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

// TODO: show and handle the following errors in the front-end.
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