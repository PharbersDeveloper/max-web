import DS from 'ember-data';

export default DS.Model.extend({
    res: DS.attr(),
    conditions: DS.hasMany('eqcond', { async: true }),
});
