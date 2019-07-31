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
    }
    // weeklyConflicts: {
    //     type: TBD
    // },
    // prodConflicts: {
    //     type: TBD
    // }
});

// TODO test 
prefsheetSchema.pre('save', function (next) {
    var prefsheet = this;
    const err = new Error('error saving prefsheet');

    numAccepted = prefsheet.rankedDances.filter(item => item.status === 'accepted').length;
    if (numAccepted > 4) { // max is 4 dances
        return next(err);
    } else {
        next();
    }
})

// This functions determines if a dancer card is actionable to the choreographer, and if it is,
// return the rank and the status.
prefsheetSchema.methods.isActionable = function (dance, cb) {
    var markedReturn = false;
    var foundRank = false;
    var actionable = false;
    var window = this.maxDances;

    var numAccepted = 0;
    var numPending = 0;
    var numReturnBefore = 0; // # of dances marked return preffed before the given dance.

    var statsObj = {};
    var actionableDances = [];
    for (var i = 0; i < this.rankedDances.length; i++) {
        r = this.rankedDances[i];
        if (dance.equals(r.dance._id)) {
            foundRank = true;
            statsObj.rank = i;
            statsObj.status = r.status; // TODO ADD STATS

            if (r.status === 'accepted') {
                actionable = true;
                numAccepted += 1;
                window -= 1;
                actionableDances.push(r.dance._id);
            } else if (r.status === 'rejected') {
                actionable = false;
            } else if (r.status === 'pending') {
                if (window > 0) {
                    actionable = true;
                    actionableDances.push(r.dance._id);
                } else {
                    actionable = false;
                }
                numPending += 1;
                window -= 1;
            } else if (r.status === 'return') {
                markedReturn = true;
            }
        } else {
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
                if (!foundRank) {
                    numReturnBefore += 1;
                }
            }
        }
    }
    // The only way to reach this block is if dance was marked as return.
    if (markedReturn) {
        // A prefsheet will only return if not placed in any other dance.
        if (numAccepted > 0 || numPending > 0) {
            actionable = false;
        } else {
            if (window - numReturnBefore > 0) {
                actionableDances.push(dance);
                actionable = true;
            }
        }
    }
    // Assign stats to stats obj
    statsObj.numAccepted = numAccepted;
    statsObj.numPending = numPending;
    statsObj.actionableDances = actionableDances;
    statsObj.dancePreffed = foundRank;
    return cb(null, actionable, statsObj); 
};

var Prefsheet = mongoose.model('Prefsheet', prefsheetSchema)
module.exports = Prefsheet;