import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    subtitle: DS.attr(),
    leaftitle: DS.attr(),
    num: DS.attr(),
    tag: DS.attr(),
    yearOnYear: DS.attr(),
    ringRatio: DS.attr(),
});
