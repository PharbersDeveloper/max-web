import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | data-center/province', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:data-center/province');
    assert.ok(route);
  });
});
