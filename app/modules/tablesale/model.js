import DS from 'ember-data';

export default DS.Model.extend({
	ProdSalesTable: DS.hasMany('prodsalestable', { async: false }),
	ProdSalesOverview: DS.belongsTo('prodsalesoverview', { async: false })
});