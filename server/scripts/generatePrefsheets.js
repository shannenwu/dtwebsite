// THIS IS A SCRIPT TO LOAD THE DATABASE FOR TEST DATA
require('dotenv').config()

const db = require('../db.js');

const User = require('../models/User.js');
const Prefsheet = require('../models/Prefsheet.js');
const Dance = require('../models/Dance.js');
const util = require('../controllers/util.js')

// This creates a random prefsheet for each of the users in the database, for a hard-coded show.
Dance.find({}, (err, dances) => {
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
                .slice(0, Math.floor(Math.random() * 20));
            prodConflicts = prodTimes
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.floor(Math.random() * 20));
            rankedDances = shortDances
                .sort(() => Math.random() - 0.5)
                .slice(Math.floor(Math.random() * shortDances.length));
            prefsheetData = {
                user: doc._id,
                show: '5d3e92e97cd4f6b6852b4c29',
                maxDances: Math.min(Math.ceil(Math.random() * rankedDances.length), 4),
                rankedDances,
                weeklyConflicts,
                weeklyDescription,
                prodConflicts,
                prodDescription,
                weeklyDescription: 'I am not free',
                prodDescription: 'I am also not free'
            }
            Prefsheet.create(prefsheetData)
        })
    })
})

Prefsheet.find({}, (err, docs) => {
    var prodTimes = util.getProdTimes();
    prodTimes = [].concat.apply([], prodTimes)
    docs.forEach(prefsheet => {
        prodConflicts = prodTimes
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 20));
        prefsheet.prodConflicts = prodConflicts;
        prefsheet.save();
    })
})