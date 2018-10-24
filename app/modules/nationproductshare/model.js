import DS from 'ember-data';

export default DS.Model.extend({
    Pie: DS.hasMany('pie', {async: false}),
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
});
