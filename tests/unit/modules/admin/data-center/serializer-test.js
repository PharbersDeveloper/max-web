import { moduleForModel, test } from 'ember-qunit';

moduleForModel('admin/data-center', 'Unit | Serializer | admin/data center', {
  // Specify the other units that are required for this test.
  needs: ['serializer:admin/data-center']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
