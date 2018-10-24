import DS from 'ember-data';

export default DS.Model.extend({
    Market: DS.hasMany('market', {async: false}),
    status: DS.attr(),
});
