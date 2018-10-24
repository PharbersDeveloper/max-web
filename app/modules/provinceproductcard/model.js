import DS from 'ember-data';

export default DS.Model.extend({
    ProProductCard: DS.hasMany('proproductcard', {async: false}),
});
