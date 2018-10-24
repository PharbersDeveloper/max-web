import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr(),
    ym: DS.attr(),
    marketSales: DS.attr(),
    prodSales: DS.attr(),
    share: DS.attr(),
});
