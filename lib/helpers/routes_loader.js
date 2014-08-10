var fs = require('fs');

/**
 * Dynamically loads each route specified under `routes` folder.
 */
var loadRoutes = function(app) {
  'use strict';
  var routes = app.settings.routePath;
  console.log('Loading routes from: ' + routes);
  fs.readdirSync(routes).forEach(function (file) {
    var route = routes + file.substr(0, file.indexOf('.'));
    console.log('Adding route: ' + route);
    require(route)(app);
  });
};

module.exports = loadRoutes;
