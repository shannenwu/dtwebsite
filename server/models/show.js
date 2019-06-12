const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShowSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    year: {
        type: Number,
        required: 'year is required'
    },
    semester: {
        type: String,
        required: 'semester (fall/spring) is required'
    },
    dances: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Dance' }]
    },
    prefsOpen: {
        type: Boolean
    },
    date: {
        type: Date,
        required: 'date required to sort shows by time'
    }
});

var Show = mongoose.model('Show', ShowSchema)
module.exports = Show;