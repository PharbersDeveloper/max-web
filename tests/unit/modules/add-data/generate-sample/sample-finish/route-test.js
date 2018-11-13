import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | add-data/generate-sample/sample-finish', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:add-data/generate-sample/sample-finish');
    assert.ok(route);
  });
});
