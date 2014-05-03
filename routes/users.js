'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res) {
  var db = req.db;
  var collection = db.collection('users');
  collection.find().toArray(function(e, docs) {
    res.render('users', {
      "userlist": docs
    });
  });
});

// TODO(gfestari):
/* POST to Add User Service */
router.post('/add', function(req, res) {
  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.name;
  var userEmail = req.body.email;

  // Insert into 'users' collection
  var users = db.collection('users');
  users.insert({
    "name": userName
    , "email": userEmail
  }, function(err, doc) {
    if (err) {
      res.send('A problem occurred trying to save ' + userEmail);
    } else {
      // Update the header and forward to success page
      res.location('userlist');
      res.redirect('userlist');
    }
  });
});


module.exports = router;
