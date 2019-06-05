// require Express
const express = require('express');
const path = require('path');

// Intitialize App
const app = express.Router();

// Import User Schema
const User = require('../models/user.js');

const publicPath = path.resolve(__dirname, '..', '..', 'client', 'dist');;

app.get('/profile', (req, res) => {
    res.sendFile(publicPath + '/index.html');
});

module.exports = app;