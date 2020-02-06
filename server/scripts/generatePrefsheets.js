// THIS IS A SCRIPT TO LOAD THE DATABASE FOR TEST DATA
require('dotenv').config()

const db = require('../db.js');

const User = require('../models/User.js');
const Prefsheet = require('../models/Prefsheet.js');
const Dance = require('../models/Dance.js');
const util = require('../controllers/util.js')

// This should be changed to the showId you want to generate prefsheets for.
const showId = '5d663fc01c9d440000750f18';

// This creates a random prefsheet for each of the users in the database, for a hard-coded show.
Dance.find({ show: showId }, (err, dances) => {
  var weekTimes = util.getWeekTimes();
  var prodTimes = util.getProdTimes();
  weekTimes = [].concat.apply([], weekTimes);
  prodTimes = [].concat.apply([], prodTimes);

  var shortDances = [];
  dances.forEach(doc => {
    shortDances.push({ dance: doc._id })
  })
  User.find({}, (err, docs) => {
    docs.forEach(doc => {
      weeklyConflicts = weekTimes
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 20))
        .map(time => time.toISOString());
      prodConflicts = prodTimes
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 20))
        .map(time => time.toISOString());
      rankedDances = shortDances
        .sort(() => Math.random() - 0.5)
        .slice(Math.floor(Math.random() * shortDances.length));
      prefsheetData = {
        user: doc._id,
        show: showId,
        maxDances: Math.min(Math.ceil(Math.random() * rankedDances.length), 4),
        rankedDances,
        weeklyConflicts,
        prodConflicts,
        weeklyDescription: 'I am not free weekly',
        prodDescription: 'I am not free prod week'
      }
      Prefsheet.create(prefsheetData)
    })
  })
  console.log("finished!")
});