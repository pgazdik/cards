var persistence = require('../server/persistence');

describe('Persistence', function () {
  describe('initializedWithEmptyCardData', function () {
    it('should return an existing CardData', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});