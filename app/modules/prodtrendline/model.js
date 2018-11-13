import DS from 'ember-data';

export default DS.Model.extend({
    ProdValue: DS.hasMany('prodvalue', {async: false}),
    name: DS.attr(),
});
