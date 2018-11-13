import DS from 'ember-data';

export default DS.Model.extend({
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false}),
    MultipleLine: DS.hasMany('multipleline', {async: false}),
});
