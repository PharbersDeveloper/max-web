import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    subtitle: DS.attr(),
    province: DS.attr(),
    name: DS.attr(),
    leaftitle: DS.attr(),
});
