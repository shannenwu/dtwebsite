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

// TODO pre-save maxDances number, ensure that status accepted <= 4

var Prefsheet = mongoose.model('Prefsheet', prefsheetSchema)
module.exports = Prefsheet;