// var http = require('http');

// http.createServer((req, res) => {
//     res.write("Hello");
//     res.end();
// }).listen(3000, () => console.log("listening! "));

var express = require('express');
var winston = require('winston');
var passport = require('passport');
var app = express();
const swagger = require('swagger-express-mw');
let transport = new winston.transports.Console({
    //level: 'debug',
    //colorize: true,
    //level: process.env.LOG_LEVEL || 'debug',
    //timestamp: true,
    //json: process.env.NODE_ENV == 'production',
    //stringify: process.env.NODE_ENV == 'production',
    //format: winston.format.simple(),


});
winston.configure({
    transports: [transport],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
            info => `${info.level} ${info.message}`
        ),
    )
});


winston.info('Starting app...');
winston.error('sample error');
winston.debug("debug");


// app.use('/', (req, res) => {
//     res.send("express");
// });

// app.listen(3000, () => winston.info("App started at port# 3000"));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', '*')
    next();
});

const config = {
    appRoot: __dirname,
    swaggerSecurityHandlers: {
        Bearer: passport.authenticate('jwt', {
            session: false
        })
    }
};

swagger.create(config, (err, swaggerExpress) => {
    if (err) {
        throw err;
    }

    winston.verbose("Registering middleware for swagger...");
    swaggerExpress.register(app);

    const port = process.env.PORT || 3000;

    app.listen(port);
    winston.info("Application is listening on the port: " + port);
});