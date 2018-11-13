import DS from 'ember-data';

export default DS.Model.extend({
    Province: DS.hasMany('province', {async: false}),
    status: DS.attr(),
});
