import DS from 'ember-data';

export default DS.Model.extend({
    MultipleLine: DS.hasMany('multipleline', {async: false}),
    ProdSalesOverview: DS.belongsTo('prodsalesoverview', {async: false})
});
