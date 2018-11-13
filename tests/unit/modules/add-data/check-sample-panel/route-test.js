import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | add-data/check-sample-panel', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:add-data/check-sample-panel');
    assert.ok(route);
  });
});
