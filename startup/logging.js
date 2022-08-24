require('winston-mongodb');
const winston = require('winston');
require('express-async-errors');
const config = require('config');

module.exports = function(){
    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File( { filename: 'logfile.log'}));
    winston.add(new winston.transports.MongoDB({
        db: config.get('db'),
        level: 'info'
    }));
    winston.add(new winston.transports.File({
        filename: 'uncaughtExceptions.log',
        handleExceptions: true
    }));
    winston.add(new winston.transports.File({
        filename: 'unhandledRejections.log',
        handleRejections: true
    }));
};






// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// })


// process.on('unhandledRejection' ,(ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// })
