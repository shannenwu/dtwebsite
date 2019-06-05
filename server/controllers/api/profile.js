// dependencies
const express = require('express');

// Router added at "/api"
const app = express.Router();

app.get('/whoami', function(req, res) {
    if(req.isAuthenticated()) {
        res.send(req.user);
    }
    else {
        res.send({});
    }
});

module.exports = app;