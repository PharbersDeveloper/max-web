import DS from 'ember-data';

export default DS.Model.extend({
    Card: DS.hasMany('card', {async: false}),
});
