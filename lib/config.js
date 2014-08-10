'use strict';

var mongoskin = require('mongoskin');
var mongoUrl = process.env.NODE_ENV === 'test'
  ? 'localhost:27017/test'
  : 'localhost:27017/express';

var db = mongoskin.db('mongodb://' + mongoUrl, { safe: true });

exports.db = db;
