'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('../app')
  , Atm = require('../lib/atm')
  , db = require('../lib/config').db
  ;

describe('ATM api', function() {
  var atm = null;
  beforeEach(function(done) {
    atm = new Atm({
      type: "1"
      , lat: "-34.90525892432816"
      , lon: "-56.13659030177689"
      , address: "26 DE MARZO 3508"
      // , near: " L. A. DE HERRERA"
    });

    atm.save(function(err, result) {
      if (err) return done(err);
      done();
    });
  });

  afterEach(function(done) {
    db.atms.drop(done);
  });

  it('retrieves a single ATM by id', function(done) {
    var uuid = atm.uid;
    request(app)
      .get('/atms/' + uuid)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('lat', '-34.90525892432816');
        done();
      })
  })

  it('responds with an error if :id not found', function(done) {
    request(app)
      .get('/atms/3')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('error', 'item 3 not found');
        done();
      })
  })

  it('retrieves a list of all available ATMs', function(done) {
    request(app)
      .get('/atms')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.length)
          .to.be.above(0);
        done();
      })
  })

  it('deletes a single entry by uid', function(done) {
    var id = atm.uid;
    request(app)
      .del('/atms/' + atm.uid)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('message', 'item removed');
        done();
      });
  })

  it('returns an error message when deleting an invalid entry', function(done) {
    request(app)
      .del('/atms/3')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('error', 'item 3 not found');
        done();
      });
  })

  it('updates an existing document', function(done) {
    var uid = atm.uid
    var data = {
      uid: uid
      , lat: '33.3333'
      , lon: '-33.3333'
      , address: '221b Baker Street, London'
    };
    request(app)
      .put('/atms/' + uid)
      .send(data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('address', '221b Baker Street, London');
        done();
    })
  })

  it('returns an error if item cannot be updated', function(done) {
    request(app)
      .put('/atms/3')
      .send(atm)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('error', 'item 3 not found');
        done();
    })
  })

  it('inserts a new document', function(done) {
    var data = {
      lat: '33.3333'
      , lon: '-33.3333'
      , address: '221b Baker Street, London'
    };
    request(app)
      .post('/atms')
      .send(data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('address', '221b Baker Street, London');
        done();
      });
  })

  it('responds with 404 if invalid POST route', function(done) {
    var data = {
      lat: '33.3333'
      , lon: '-33.3333'
      , address: '221b Baker Street, London'
    };
    request(app)
      .post('/atms/5')
      .send(data)
      .expect(404);
    done();
  })

  it('returns an error if document creation fails', function(done) {
    request(app)
      .post('/atms')
      .send({})
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.errors)
          .to.have.length.above(2);
        done();
      });
  })

})
