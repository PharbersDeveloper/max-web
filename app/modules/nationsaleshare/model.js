import DS from 'ember-data';

export default DS.Model.extend({
    SaleShareCard: DS.hasMany('salesharecard', {async: false}),
});
