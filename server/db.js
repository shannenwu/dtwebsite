const mongoose = require('mongoose');

// set up mongoDB connection
const mongoURL = process.env.MONGO_SRV;
const options = { dbName: process.env.DATABASE_NAME, useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mongoURL, options);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;