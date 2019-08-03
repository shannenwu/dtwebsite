// dependencies
const express = require('express');

// Router added at "/api"
const app = express.Router();

app.get('/', (req, res) => {
    res.json({
        status: '200',
        statusMessage: 'Connected to the API successfully.'
    })
});

app.get('/whoami', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    }
    else {
        res.send({});
    }
});

// api routes
app.use('/users', require('./users'));
app.use('/shows', require('./shows'));
app.use('/dances', require('./dances'));
app.use('/auditions', require('./auditions'));
app.use('/prefsheets', require('./prefsheets'));
app.use('/permissions', require('./permissions'));

// 401 Unauthorized
app.get('/unauthorized', (req, res) => {
    res.status = 401;
    res.json({
        status: '401',
        statusMessage: 'Unauthorized'
    });
});

// 404 Not Found
app.use((req, res, next) => {
    res.status = 404;
    res.json({
        status: '404',
        statusMessage: 'No API endpoint found.'
    });
});

// 500
app.use((err, req, res, next) => {
    console.log(err)
    res.status = 500;
    res.json({
        status: '500',
        statusMessage: 'Internal Server Error'
    })
})

module.exports = app;