import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    subtitle: DS.attr(),
    name: DS.attr(),
    subname: DS.attr(),
    tag: DS.attr(),
    value: DS.attr(),
    percent: DS.attr(),
});
