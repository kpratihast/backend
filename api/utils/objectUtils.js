'use strict';
const winston = require('winston');

exports.isEmptyObject = function (obj) {
    if (!obj) return true;

    return !Object.keys(obj).length;
}