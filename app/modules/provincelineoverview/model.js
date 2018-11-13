import DS from 'ember-data';

export default DS.Model.extend({
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
    MixedGraphLine: DS.hasMany('mixedgraphline', {async: false}),
});
