import DS from 'ember-data';

export default DS.Model.extend({
    job_id: DS.attr('string'),
    user_id: DS.attr('string'),
    company_id: DS.attr('string'),
    ym: DS.attr('string'),
    market: DS.attr('string'),
    indicators:DS.attr(),
    mirror:DS.attr(),
    region:DS.attr(),
    trend:DS.attr()
});
