'use strict';


const _ = require('lodash');
const rxEscapeSequence = /%[0-9A-Fa-f]{2}'/g;


function unescape(str) {
    str = (str || '') + '';

    str = str.replace(rxEscapeSequence, function(hexCode) {
        hexCode = hexCode.substr(1);
        var dec = parseInt(hexCode, 16);
        return String.fromCharCode(dec);
    });

    return str;
}


function parse(queryString) {
    queryString = queryString || '';
    if (queryString.substr(0, 1) === '?') {
        queryString = queryString.substr(1);
    }

    var params = {};
    _.each(queryString.split('&'), function(param) {
        param = decodeURIComponent(unescape(param));
        var component = param.split('='),
            key   = component[0],
            value = component[1];

        if (value === 'true') {
            value = true;
        } else if (value === 'false') {
            value = false;
        }

        if (key) {
            params[key] = value;
        }
    });

    return params;
}


function stringify(data) {
    let flatData = [];

    _.each(data, (value, key) => {
        if (_.isArray(value)) {
            _.each(value, entry => {
                flatData.push({
                    key: key +'[]',
                    value: entry,
                });
            });
        } else {
            flatData.push({
                key: key,
                value: value,
            });
        }
    });

    return _.map(flatData, entry =>
        entry.key + (entry.value ? '='+ encodeURIComponent(entry.value) : '')
    ).join('&');
}


module.exports = {
    parse    : parse,
    stringify: stringify,
    unescape : unescape
};
