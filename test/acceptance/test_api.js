'use strict';

var expect = require('chai').expect;
var request = require('supertest');

var app = require('../../app')
  , Atm = require('../../lib/atm')
  , db = require('../../lib/config').db
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
      .get('/api/atms/' + uuid)
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
      .get('/api/atms/3')
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
      .get('/api/atms')
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
      .del('/api/atms/' + atm.uid)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('uid', id);
        expect(res.body)
          .to.have.keys([
            'uid'
            , 'created_at'
            , 'updated_at'
            , 'lat'
            , 'lon'
            , 'address'
          ]);
        done();
      });
  })

  it('returns an error message when deleting an invalid entry', function(done) {
    request(app)
      .del('/api/atms/3')
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
      .put('/api/atms/' + uid)
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
      .put('/api/atms/3')
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
      .post('/api/atms')
      .send(data)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body)
          .to.have.property('address', '221b Baker Street, London');
        done();
      });
  })

  it('responds with 405 if method not allowed', function(done) {
    var data = {
      lat: '33.3333'
      , lon: '-33.3333'
      , address: '221b Baker Street, London'
    };
    request(app)
      .post('/api/atms/5')
      .send(data)
      .expect(405)
      .end(function(err, res) {
        expect(res.body).to.be.empty;
        expect(res.header).to.have.property('allow', 'GET, PUT, DELETE');
        done();
      });
  })

  it('returns an error if document creation fails', function(done) {
    request(app)
      .post('/api/atms')
      .send({})
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.error)
          .to.have.length.above(2);
        done();
      });
  })

})
