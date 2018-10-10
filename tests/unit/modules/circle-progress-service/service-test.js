import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | circle-progress-service', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:circle-progress-service');
    assert.ok(service);
  });
});

