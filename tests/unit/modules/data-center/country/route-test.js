import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | data-center/country', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:data-center/country');
    assert.ok(route);
  });
});
