import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('legend-pie-sales-prov', 'Integration | Component | legend pie sales prov', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{legend-pie-sales-prov}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#legend-pie-sales-prov}}
      template block text
    {{/legend-pie-sales-prov}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
