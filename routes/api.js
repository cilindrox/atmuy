'use strict';

var express = require('express')
  , router = express.Router()
  ;
var Atm = require('../lib/atm');

// -- Middleware
// TODO(gfestari): this has a redundant setting on req.atm
function validateBody(req, res, next) {
  var body = req.body;
  body.uid = req.params.uid;

  Atm.validate(body, function(validation) {
    if (validation.valid === false) {
      res.status(400).send({ error: validation.errors });
    } else {
      req.atm = new Atm(body);
      next();
    }
  });
}

// NOTE: this is NOT the `_id` field from mongo
router.param('uid', function(req, res, next, uid) {
  var uid = req.params.uid;
  Atm.getByUid(uid, function(err, doc) {
    if (err) return next(err);
    if (doc === null) {
      res.status(404).send({ error: 'item ' + uid + ' not found' });
    } else {
      req.atm = doc;
      next();
    }
  });
});

router.route('/:uid')
  .get(function(req, res, next) {
    res.json(req.atm);
  })
  .put(validateBody, function(req, res, next) {
    req.atm.save(function(err, result) {
      if (err) return next(err);
      if (result === 1) {
        res.json(req.atm);
      } else {
        next(new Error('item could not be saved'));
      }
    });
  })
  .delete(function(req, res, next) {
    Atm.remove(req.params.uid, function(err, result) {
      if (err) return next(err);
      if (result === 1) {
        res.json(req.atm);
      } else {
        next(new Error('item could not be saved'));
      }
    });
  })
  ;

router.route('/')
  .get(function(req, res, next) {
    Atm.getAll(function(err, items) {
      if (err) return next(err);
      res.json(items);
    });
  })
  .post(validateBody, function(req, res, next) {
    req.atm.save(function(err, result) {
      if (err) return next(err);
      if (result.length === 1) {
        res.status(201).send(result[0]);
      } else {
        next(new Error('could not create document'));
      }
    });
  })
  ;

router.post('/*', function(req, res) {
  res.set('Allow', 'GET, PUT, DELETE');
  res.status(405).send('Method Not Allowed');
});


module.exports = router;
