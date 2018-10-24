import DS from 'ember-data';

export default DS.Model.extend({
    unit: DS.attr(),
    Ranking: DS.hasMany('ranking', {async: false}),
});
