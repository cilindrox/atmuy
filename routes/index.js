'use strict';

var api = require('./api')
  , client = require('./client')
;

module.exports = function (app) {
  app.use('/api/atms', api);
  app.use('/atms', client);
};
