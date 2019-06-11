const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PrefSheetSchema = new Schema({

});

var PrefSheet = mongoose.model('PrefSheet', PrefSheetSchema)
module.exports = PrefSheet;