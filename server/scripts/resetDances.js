require('dotenv').config()

const db = require('../db.js');

const Dance = require('../models/Dance');

// This will reset all dances to have selectionComplete: false, and emptied acceptedDancers.. USE WITH CAUTION.

Dance.updateMany({}, { selectionComplete: false, acceptedDancers: [] },
  (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res);
  })