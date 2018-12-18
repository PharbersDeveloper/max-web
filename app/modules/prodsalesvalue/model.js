import DS from 'ember-data';

export default DS.Model.extend({
	prod: DS.attr(),
	market: DS.attr(),
	manufacturer: DS.attr(),
	market_sale: DS.attr(),
	market_scale: DS.attr(),
	market_growth: DS.attr(),
	sales: DS.attr(),
	sales_growth: DS.attr(),
	ev_value: DS.attr(),
	share: DS.attr(),
	share_growth: DS.attr(),
	province: DS.attr(),
	market_size: DS.attr(),
	market_groth: DS.attr(),
	sales_amount: DS.attr()
});
