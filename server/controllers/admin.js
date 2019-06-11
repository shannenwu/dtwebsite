// require Express
const express = require('express');
const path = require('path');
const connect = require('connect-ensure-login');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');

// This file mounts the profile path.

app.get('/admin', connect.ensureLoggedIn(), (req, res) => {
    res.sendFile(publicPath + '/index.html');
});

module.exports = app;