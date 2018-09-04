import DS from 'ember-data';

export default DS.Model.extend({
    res: DS.attr('string'),
    eq_cond: DS.hasMany('eq-cond'),
    up_cond: DS.hasMany('up-cond'),
    fm_cond: DS.belongsTo('fm-cond', { async: false })
});
