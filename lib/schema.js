
// Defines validation constraints for domain objects

exports.atm = {
  properties: {
    address: {
      description: 'human-readable location of the object'
      , type: 'string'
      , minLength: 4
      , maxLength: 150
      , required: true
      , allowEmpty: false
    }, lat: {
      description: 'latitude coordinates'
      , type: 'string'
      , pattern: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,14}$/
      , required: true
      , allowEmpty: false
    }, lon: {
      description: 'longitude coordinates'
      , type: 'string'
      , pattern: /^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,14}$/
      , required: true
      , allowEmpty: false
    }, type: {
      description: 'longitude coordinates'
      , type: 'string'
      , required: false // TODO(gfestari): enable
      , allowEmpty: false
    }, desc: {
      description: 'longitude coordinates'
      , type: 'string'
      , required: false // TODO(gfestari): enable
      , allowEmpty: false
    }
  }
};
