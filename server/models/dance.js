const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var danceSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    choreographers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    description: {
        type: String,
        trim: true
    },
    style: {
        type: String,
        trim: true
    },
    level: {
        type: String,
        trim: true
    },
    show: {
        type: Schema.Types.ObjectId, ref: 'Show'
    },
    acceptedDancers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }
});

var Dance = mongoose.model('Dance', danceSchema)
module.exports = Dance;