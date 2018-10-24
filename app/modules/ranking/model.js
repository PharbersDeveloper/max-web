import DS from 'ember-data';

export default DS.Model.extend({
    no: DS.attr(),
    prod: DS.attr(),
    manu: DS.attr(),
    growth: DS.attr(),
    value: DS.attr(),
    province: DS.attr(),
});
