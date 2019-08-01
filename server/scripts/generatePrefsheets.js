// THIS IS A SCRIPT TO LOAD THE DATABASE FOR TEST DATA
require('dotenv').config()

const db = require('../db.js');

const User = require('../models/User.js');
const Prefsheet = require('../models/Prefsheet.js');
const Dance = require('../models/Dance.js');

// This creates a random prefsheet for each of the users in the database, for a hard-coded show.
Dance.find({}, (err, dances) => {
    var shortDances = [];
    dances.forEach(doc => {
        shortDances.push({ dance: doc._id })
    })
    User.find({}, (err, docs) => {
        docs.forEach(doc => {
            rankedDances = shortDances
                .sort(() => Math.random() - 0.5)
                .slice(Math.floor(Math.random() * shortDances.length));
            prefsheetData = {
                user: doc._id,
                show: '5d3e92e97cd4f6b6852b4c29',
                maxDances: Math.min(Math.ceil(Math.random()*rankedDances.length), 4),
                rankedDances
            }
            Prefsheet.create(prefsheetData)
        })
    })
})