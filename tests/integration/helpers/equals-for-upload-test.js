import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('equals-for-upload', 'helper:equals-for-upload', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{equals-for-upload inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});
