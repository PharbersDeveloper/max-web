import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    subtitle: DS.attr(),
    timeStart: DS.attr(),
    timeOver: DS.attr(),
    curMoSales: DS.attr(),
    yearYear: DS.attr(),
    ring: DS.attr(),
    totle: DS.attr(),
    ave: DS.attr(),
    area: DS.attr(),
    unit: DS.attr(),
});
