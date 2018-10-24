import DS from 'ember-data';

export default DS.Model.extend({
    ProvinceWord: DS.hasMany('provinceword', {async: false}),
});
