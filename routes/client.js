'use strict';

var express = require('express')
  , router = express.Router()
  ;

/*
router.param('uid', function(req, res, next, uid) {
  Atm.getByUid(req.params.id, function(err, result) {
    if (err) return next(err);
    req.atm = result || { error: 'item ' + req.params.id + ' not found' };
    next();
  });
});
*/

router.route('/:uid?')
  .get(function (req, res, next) {
    res.render('index', { title: 'ATMuy'});
  });


module.exports = router;
