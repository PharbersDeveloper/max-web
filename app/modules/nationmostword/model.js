import DS from 'ember-data';

export default DS.Model.extend({
    MostCard: DS.hasMany('mostcard', {async: false}),
});
