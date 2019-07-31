// THIS IS A SCRIPT TO LOAD THE DATABASE FOR TEST DATA
require('dotenv').config()

const db = require('../db.js');

const User = require('../models/User.js');
const Prefsheet = require('../models/Prefsheet.js');
const Dance = require('../models/Dance.js');

const axios = require('axios');

// This will populate the database with 200 random users.
axios.get('https://randomuser.me/api/?results=200')
    .then(response => {
        for (var i = 0; i < 200; i++) {
            var user = response.data.results[i];
            var userData = {
                email: user.email,
                password: user.login.password,
                firstName: user.name.first,
                lastName: user.name.last,
                gender: user.gender,
                year: 2021
            };
            User.create(userData, (err, newUser) => {
                if (err) {
                    console.log(err);
                }
                console.log(newUser);
            });
        }
    })
    .catch(err => {
        console.log(err.message);
    })

// This creates a random prefsheet for each of the users in the database.
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
                maxDances: Math.ceil(Math.random()*4),
                rankedDances
            }
            Prefsheet.create(prefsheetData)
        })
    })
})