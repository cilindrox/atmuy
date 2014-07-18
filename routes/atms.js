'use strict';

var express = require('express');
var router = express.Router();

var Atm = require('../lib/atm');

// router.param('uid', function(req, res, next, uid) {
//   Atm.getByUid(req.params.id, function(err, result) {
//     if (err) return next(err);
//     req.atm = result || { error: 'item ' + req.params.id + ' not found' };
//     next();
//   });
// });
// router.route('/:uid')
// .get()
// .post()
// .delete()

// -- Middleware

function loadAtm(req, res, next) {
  var uid = req.params.uid;
  Atm.getByUid(uid, function(err, doc) {
    if (err) return next(err);
    if (doc !== null) {
      req.atm = doc;
      next();
    } else {
      res.status(404).json({ error: 'item ' + uid + ' not found' });
    }
  });
}

function validateBody(req, res, next) {
  var body = req.body;
  body.uid = req.params.uid;

  Atm.validate(body, function(validation) {
    if (validation.valid === false) {
      res.status(400).json({ errors: validation.errors });
    } else {
      req.atm = new Atm(body);
      next();
    }
  });
}

// GET -- fetch an ATM by id
router.get('/:uid', loadAtm, function(req, res, next) {
  res.json(req.atm);
});

// GET -- List all available ATMs
router.get('/', function(req, res, next) {
  Atm.getAll(function(err, items) {
    if (err) return next(err);
    res.json(items);
  });
});

// POST -- add a new ATM
router.post('/', validateBody, function(req, res, next) {
  var atm = req.atm;
  atm.save(function(err, result) {
    if (err) return next(err);
    if (result.length === 1) {
      res.json(result[0]);
    } else {
      next(new Error('could not create document'));
    }
  });
});

router.put('/:uid', [loadAtm, validateBody], function(req, res, next) {
  var atm = req.atm;
  atm.save(function(err, result) {
    if (err) return next(err);
    if (result === 1) {
      res.json(atm);
    } else {
      next(new Error('item could not be saved'));
    }
  });
});

/*
 * DELETE atm by id.
 * NOTE: this is the backend-generated `uuid` and NOT the `_id` field on mongo.
 */
router.delete('/:uid', loadAtm, function(req, res, next) {
  Atm.remove(req.params.uid, function(err, result) {
    if (err) return next(err);
    if ( result === 1) {
      res.json({ message: 'item removed' });
    } else {
      next(new Error('item could not be saved'));
    }
  });
});


module.exports = router;
