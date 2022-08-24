const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');


module.exports = function(){
    const db = config.get('db');
    console.log(db);
    mongoose.connect(db)
    // mongoose.connect("mongodb+srv://harold:1234@cluster0.vnwj0.mongodb.net/?retryWrites=true&w=majority")
    .then(() => winston.info(`Connected to ${db}...`));
}

