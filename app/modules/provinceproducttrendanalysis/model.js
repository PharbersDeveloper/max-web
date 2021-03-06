import DS from 'ember-data';

export default DS.Model.extend({
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
    ProdTrendLine: DS.hasMany('prodtrendline', {async: false}),
});
