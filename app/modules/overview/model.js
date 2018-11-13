import DS from 'ember-data';

export default DS.Model.extend({
    ProdSalesValue: DS.hasMany('prodsalesvalue', {async: false}),
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false})
});
