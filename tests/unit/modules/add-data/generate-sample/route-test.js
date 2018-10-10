import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | add-data/generate-sample', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:add-data/generate-sample');
    assert.ok(route);
  });
});
