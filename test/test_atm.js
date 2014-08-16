var chai = require('chai')
  , datetime = require('chai-datetime')
  , expect = chai.expect
  ;
chai.use(datetime);

var Atm = require('../lib/atm');
var db = require('../lib/config').db;

describe('Atm', function() {
  describe('CRUD ops', function() {
    var atm = new Atm({
      lat: '-34.90525892432816'
      , lon: '-56.13659030177689'
      , address: 'address'
    });

    beforeEach(function(done) {
      atm.save(done);
    });

    after(function(done) {
      db.atms.drop(done);
    });

    it('.uid', function(done) {
      expect(atm)
        .to.have.property('uid')
        .and.to.be.of.length(36);
      done();
    });

    it('.createdAt', function(done) {
      expect(atm)
        .to.have.property('createdAt')
        .and.to.be.an.instanceof(Date);
      done();
    });

    it('.updatedAt', function(done) {
      expect(atm)
        .to.have.property('updatedAt')
        .and.to.be.an.instanceof(Date)
        .and.to.equalDate(atm.createdAt);
      done();
    });

    it('.lat', function(done) {
      expect(atm)
        .to.have.property('lat', '-34.90525892432816');
      done();
    });

    it('.lon', function(done) {
      expect(atm)
        .to.have.property('lon', '-56.13659030177689');
      done();
    });

    it('.address', function(done) {
      expect(atm)
        .to.have.property('address', 'address');
      done();
    });

    it('#remove', function(done) {
      var tmp = new Atm({
        lat: '-34.90525892432816'
        , lon: '-56.13659030177689'
        , address: 'address'
      });
      tmp.save(function (err, res) {
        if (err) return done(err);
      });
      Atm.remove(tmp.uid, function(err, result) {
        if (err) return done(err);
        expect(result).to.eql(1);
        done();
      })
    })

    it('#getByUid', function(done) {
      Atm.getByUid(atm.uid, function(err, doc) {
        if (err) return done(err);
        expect(doc)
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

    it('#getByUid not found', function(done) {
      Atm.getByUid('55', function(err, doc) {
        if (err) return done(err);
        expect(doc).to.be.null;
        done();
      })
    })

    it('#toJSON', function(done) {
      var atm = new Atm({
        lat: '-34.90525892432816'
        , lon: '-56.13659030177689'
        , address: 'address'
      });
      expect(atm.toJSON())
        .to.contain.keys([
          'uid'
          , 'created_at'
          , 'updated_at'
          , 'lat'
          , 'lon'
          , 'address'
        ]);
      done();
    })

  }) // domain object

  describe('Constraint validation', function() {

    it('validates a new instance', function(done) {
      var body = Atm.validate({
        lat: '-34.90525892432816'
        , lon: '-56.13659030177689'
        , address: '26 DE MARZO 3508'
      }, function(validation) {
        expect(validation.valid).to.be.true;
        done();
      });
    })

    it('validates latitude', function(done) {
      Atm.validate({
        lat: 'latitude'
        , lon: '-74.0181409'
        , address: '26 DE MARZO 3508'
      }, function(validation) {
        expect(validation.errors[0].property).to.equal('lat');
        done();
      });
    })

    it('validates longitude', function(done) {
      Atm.validate({
        lat: '-34.90525892432816'
        , lon: 'longitude'
        , address: '26 DE MARZO 3508'
      }, function(validation) {
        expect(validation.errors[0].property).to.equal('lon');
        done();
      });
    })

    it('validates address', function(done) {
      Atm.validate({
        lat: '-34.90525892432816'
        , lon: '-56.13659030177689'
        , address: ''
      }, function(validation) {
        expect(validation.errors[0].property).to.equal('address');
        done();
      });
    })

  }) // constraints

});
