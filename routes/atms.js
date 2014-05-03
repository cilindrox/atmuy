'use strict';

var express = require('express');
var router = express.Router();

/* GET atms listing. */
router.get('/list', function (req, res) {
  var db = req.db;
  var collection = db.collection('atms');
  collection.find().toArray(function (err, items) {
    res.json(items);
  });
});

/* POST to atm/add */
router.post('/add', function (req, res) {
  var db = req.db;
  var collection = db.collection('atms');

  // TODO(gfestari): Update UUIDs before object creation --
  //    var uuid = require('node-uuid');
  //    var uuid4 = uuid.v4();

  collection.insert(req.body, function (err, result) {
    res.send((err === null)
      ? { msg: '' }
      : { msg: err }
    );
  });
});

/*
 * DELETE atm by id.
 * NOTE: this is the backend-generated `uuid` and NOT the `_id` field on mongo.
 */
router.delete('/delete/:id', function (req, res) {
  var atmToDelete = req.params.id;
  var db = req.db;
  var collection = db.collection('atms');
  collection.remove({ 'id': atmToDelete }, function (err, result) {
    res.send(( result === 1)
      ? { msg: '' }
      : { msg: err }
    );
  });
});


module.exports = router;
