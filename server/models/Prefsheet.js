const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var prefsheetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    show: {
        type: Schema.Types.ObjectId, ref: 'Show'
    },
    auditionNumber: {
        type: Number
    },
    maxDances: {
        type: Number
    },
    rankedDances: [{
        dance: {
            type: Schema.Types.ObjectId,
            ref: 'Dance'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'return'],
            default: 'pending'
        }
    }],
    isLate: {
        type: Boolean,
        default: false
    },
    weeklyConflicts: {
        type: [],
        default: []
    },
    weeklyDescription: {
        type: String,
        default: ''
    },
    prodConflicts: {
        type: [],
        default: []
    },
    prodDescription: {
        type: String,
        default: ''
    }
});

// TODO test 
// prefsheetSchema.pre('save', function (next) {
//     var prefsheet = this;
//     const err = new Error('error saving prefsheet');

//     numAccepted = prefsheet.rankedDances.filter(item => item.status === 'accepted').length;
//     if (numAccepted > 4) { // max is 4 dances
//         return next(err);
//     } else {
//         next();
//     }
// })

// This methods returns a comprehensive object of this prefsheet's stats and actionable dances.
prefsheetSchema.methods.getInfo = function (cb) {
    var window = this.maxDances;

    var numAccepted = 0;
    var numPending = 0;

    var statsObj = {};
    var danceRankStatusObj = {};
    var actionableDances = [];
    var markedReturnDances = [];
    for (var i = 0; i < this.rankedDances.length; i++) {
        r = this.rankedDances[i];
        danceRankStatusObj[r.dance._id] = { rank: i, status: r.status };
        if (r.status === 'accepted') {
            numAccepted += 1;
            window -= 1;
            actionableDances.push(r.dance._id);
        } else if (r.status === 'pending') {
            if (window > 0) {
                actionableDances.push(r.dance._id);
            }
            numPending += 1;
            window -= 1;
        } else if (r.status === 'return') {
            markedReturnDances.push(r.dance._id);
        }
    }
    // If any dances marked return for this prefsheet.
    if (markedReturnDances.length) {
        // A prefsheet will only return if not placed in any other dance.
        if (numAccepted <= 0 && numPending <= 0) {
            // Add the returned dances in order.
            for (var j = 0; j < Math.min(window, markedReturnDances.length); j++) {
                dance_id = markedReturnDances[j];
                actionableDances.push(dance_id);
            }
        }
    }
    // Assign stats to stats obj
    statsObj.numAccepted = numAccepted;
    statsObj.numPending = numPending;
    return cb(null, statsObj, danceRankStatusObj, actionableDances);
};

var Prefsheet = mongoose.model('Prefsheet', prefsheetSchema)
module.exports = Prefsheet;