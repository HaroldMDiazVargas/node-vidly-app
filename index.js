const winston = require('winston');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

if(app.get('env') === 'production'){
    require('./startup/prod')(app);
    winston.info(`Using helmet and compression for production`);
}

app.set('view engine', 'pug');

const port = app.get('env') === 'production' ? (process.env.PORT || 80) : 4000;
// const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
