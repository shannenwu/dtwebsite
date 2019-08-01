// THIS IS A SCRIPT TO LOAD THE DATABASE FOR TEST DATA
require('dotenv').config()

const db = require('../db.js');

const User = require('../models/User.js');
const Prefsheet = require('../models/Prefsheet.js');
const Dance = require('../models/Dance.js');

const axios = require('axios');

// This will populate the database with 300 random users.
axios.get('https://randomuser.me/api/?results=200')
    .then(response => {
        for (var i = 0; i < 300; i++) {
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