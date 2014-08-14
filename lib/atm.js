'use strict';

var uuid = require('node-uuid')
  , revalidator = require('revalidator')
  , db = require('./config').db
  , schema = require('../lib/schema').atm
  ;

db.bind('atms').bind({
  getByUid: function(uid, callback) {
    this.findOne({ uid: uid }, callback);
  }
  , getAll: function(fn) {
    this.find({}, { limit: 10, sort: [['id', -1]] })
      .toArray(fn);
  }
});

// Create and index by id
db.atms.ensureIndex([['uid', 1]], true, function(err, res) {
  if (err) throw err;
});

var Atm = function(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      this[key] = obj[key];
    }
  }
};

Atm.prototype.toJSON = function() {
  return {
    'uid': this.uid
    , 'lat': this.lat
    , 'lon': this.lon
    , 'address': this.address
    , 'created_at': this.createdAt
    , 'updated_at': this.updatedAt
    // , 'type': this.type // Banred, RedBROU, Abitab, etc.
    // , 'desc': this.desc
  };
};

Atm.prototype.save = function(fn) {
  if (this.uid) {
    this.update(fn);
  } else {
    var atm = this;
    atm.uid = uuid.v4();
    atm.createdAt = new Date();
    atm.updatedAt = atm.createdAt;
    db.atms.insert(atm.toJSON(), fn);
  }
};

Atm.prototype.update = function(fn) {
  var atm = this
    , uid = atm.uid;
  atm.updatedAt = new Date();
  db.atms.update({ uid: uid }, atm.toJSON(), fn);
};

Atm.remove = function(uid, fn) {
  db.atms.remove({ 'uid': uid }, fn);
};

Atm.getByUid = function(uid, fn) {
  db.atms.findOne({ uid: uid }, { '_id': 0 }, fn);
};

Atm.getAll = function(fn) {
  db.atms.getAll(fn);
};

function validate(params) {
  return revalidator.validate(params, schema);
}

Atm.validate = function(obj, cb) {
  var validation = validate(obj);
  return cb(validation);
};


module.exports = Atm;
