import DS from 'ember-data';

export default DS.Model.extend({
    // index: DS.attr('number'),
    date: DS.attr('string'),
    province: DS.attr('string'),
    city: DS.attr('string'),
    market: DS.attr('string'),
    product: DS.attr('string'),
    sales: DS.attr('string'),
    units: DS.attr('string')
});
