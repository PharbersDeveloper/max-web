import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('result-mirror-bar', 'Integration | Component | result mirror bar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{result-mirror-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#result-mirror-bar}}
      template block text
    {{/result-mirror-bar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
