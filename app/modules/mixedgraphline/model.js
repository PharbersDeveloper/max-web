import DS from 'ember-data';

export default DS.Model.extend({
    province: DS.attr(),
    scale: DS.attr(),
    sales: DS.attr(),
    market_growth: DS.attr(),
    prod_growth: DS.attr(),
});
