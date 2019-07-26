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
    if (numAccepted > prefsheet.maxDances) {
        return next(err);
    } else {
        next();
    }
})

// This functions determines if a dancer card is visible to the choreographer, and if it is,
// return the rank and the status.
prefsheetSchema.methods.isVisible = function (dance, cb) {
    var markedReturn = false;
    var foundRank = false;
    var window = this.maxDances;

    var numAccepted = 0;
    var numPending = 0;
    var numReturnBefore = 0; // # of dances marked return preffed before the given dance.

    var rankStatusObj = {};
    for (var i = 0; i < this.rankedDances.length; i++) {
        r = this.rankedDances[i];
        if (window <= 0) {
            return cb(null, false, rankStatusObj);
        }
        if (dance.equals(r.dance._id)) {
            foundRank = true;
            rankStatusObj = { 'rank': i, 'status': r.status };
            if (r.status === 'accepted' || (window > 0 && r.status === 'pending')) {
                return cb(null, true, rankStatusObj);
            } else if (r.status === 'rejected') {
                return cb(null, false, rankStatusObj);
            } else if (r.status === 'return') {
                markedReturn = true;
            }
        } else {
            if (r.status === 'accepted') {
                numAccepted += 1;
                window -= 1;
            } else if (r.status === 'pending') {
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
        // A prefsheet will only return if not placed.
        if (numAccepted > 0 || numPending > 0) {
            return cb(null, false, rankStatusObj);
        } else {
            if (window - numReturnBefore > 0) {
                return cb(null, true, rankStatusObj);
            }
        }
    }
    // Reach this block if given dance was not preffed at all.
    return cb(null, false); 
};

var Prefsheet = mongoose.model('Prefsheet', prefsheetSchema)
module.exports = Prefsheet;