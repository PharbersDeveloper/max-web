import DS from 'ember-data';

export default DS.Model.extend({
    prod: DS.attr(),
    sales: DS.attr(),
    cont: DS.attr(),
    color: DS.attr(),
    TipDetail: DS.hasMany('tipdetail', {async: false}),
    title: DS.attr(),
    show_value: DS.attr(),
    show_unit: DS.attr(),
    share: DS.attr(),
    contMonth: DS.attr(),
    contSeason: DS.attr(),
    contYear: DS.attr(),
    market: DS.attr(),
});
