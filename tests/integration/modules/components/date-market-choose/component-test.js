import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('date-market-choose', 'Integration | Component | date market choose', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{date-market-choose}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#date-market-choose}}
      template block text
    {{/date-market-choose}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
