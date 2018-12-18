import DS from 'ember-data';

export default DS.Model.extend({
    job_id: DS.attr('string'),
    company_id: DS.attr('string'),
    ym: DS.attr(),
    market: DS.attr('string'),
    result_path: DS.attr('string')
});
