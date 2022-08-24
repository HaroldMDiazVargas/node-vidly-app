// const { createLogger, format, transports } = require('winston');
const winston = require('winston');
// const { combine, timestamp, label, prettyPrint } = format;
// require('winston-mongodb');
// // const logger = winston.createLogger({
// //     level: 'info',
// //     transports: [

// //       new winston.transports.Console({
// //         format: winston.format.timestamp(),
// //       }),
// //       new winston.transports.File({ filename: 'error.log', level: 'error' , format: winston.format.timestamp()}),
// //       new winston.transports.File({ filename: 'combined.log' }),
// //     ],
// //   });

// const logger = createLogger({
//     format: combine(
//       label({ label: 'right meow!' }),
//       timestamp(),
//       prettyPrint()
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File({ filename: 'combined.log' }),
//         new transports.MongoDB({db: 'mongodb://localhost/vidly'})]
//   });

module.exports = function (err, req, res, next){

    winston.error(err.message, err);
    // logger.error(err.message, err);
    res.status(500).send('Something failed.');
}