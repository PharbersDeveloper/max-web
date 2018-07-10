import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('line-prod-sales', 'Integration | Component | line prod sales', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{line-prod-sales}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#line-prod-sales}}
      template block text
    {{/line-prod-sales}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
