require('dotenv').config()

const db = require('../db.js');

const Prefsheet = require('../models/Prefsheet.js');
const Show = require('../models/Show.js');

// This will reset all prefsheets in the active show status to pending. USE WITH CAUTION.
Show.findOne({ isActive: true }).then(show => {
    Prefsheet.updateMany({ show: show._id }, {
        '$set': {
            'rankedDances.$[].status': 'pending'
        },
    }, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })
});