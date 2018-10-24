import DS from 'ember-data';

export default DS.Model.extend({
    ProdTrendLine: DS.hasMany('prodtrendline', {async: false}),
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
});
