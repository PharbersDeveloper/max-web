import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | add-data/generate-sample/index', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:add-data/generate-sample/index');
    assert.ok(controller);
  });
});
