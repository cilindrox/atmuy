'use strict';

// Shitty class for showcasing unit tests.
// TODO(gfestari): Update with proper test cases.

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1, 2, 4].indexOf(5));
      assert.equal(-1, [1, 2, 4].indexOf(0));
    });
  });
});
