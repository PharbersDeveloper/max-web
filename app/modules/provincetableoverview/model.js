import DS from 'ember-data';

export default DS.Model.extend({
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
    ProdSalesValue: DS.hasMany('prodsalesvalue', {async: false}),
});
