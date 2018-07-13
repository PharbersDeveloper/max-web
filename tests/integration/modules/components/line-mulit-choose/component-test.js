import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('line-mulit-choose', 'Integration | Component | line mulit choose', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{line-mulit-choose}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#line-mulit-choose}}
      template block text
    {{/line-mulit-choose}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
