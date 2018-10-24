import DS from 'ember-data';

export default DS.Model.extend({
    TipDetail: DS.hasMany('tipdetail', {async: false}),
    title: DS.attr(),
    show_value: DS.attr(),
    share: DS.attr(),
    color: DS.attr(),
});
