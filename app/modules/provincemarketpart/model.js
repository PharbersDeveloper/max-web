import DS from 'ember-data';

export default DS.Model.extend({
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
    Pie: DS.hasMany('pie', {async: false}),
});
