'use strict';
const winston = require('winston');

exports.sendResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
  };
  
exports.errorHandler = function (res, err) {
    winston.error(err);

    if (!err.statusCode) {
        let tempErr = { statusCode: 500 };
        tempErr.message = err.toString();
        err = tempErr;
    }

    this.sendResponse(res, err.statusCode, { message: err.message });
};