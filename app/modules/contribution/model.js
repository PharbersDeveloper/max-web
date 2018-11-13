import DS from 'ember-data';

export default DS.Model.extend({
    Pie: DS.hasMany('pie', {async: false}),
    ProdContValue: DS.hasMany('prodcontvalue', {async: false}),
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false})
});
