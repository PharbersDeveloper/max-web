import DS from 'ember-data';

export default DS.Model.extend({
    prod: DS.attr(),
    manufacturer: DS.attr(),
    market_sale: DS.attr(),
    sales_growth: DS.attr(),
    ev_value: DS.attr(),
    share: DS.attr(),
    share_growth: DS.attr(),
    ym: DS.attr(),
    value: DS.attr(),
    unit: DS.attr(),
});
