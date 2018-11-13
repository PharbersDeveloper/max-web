import DS from 'ember-data';

export default DS.Model.extend({
    user_id: DS.attr('string'),
    percentage: DS.attr(),
    company_id: DS.attr('string'),
    job_id: DS.attr('string'),
    call: DS.attr('string'),
    date: DS.attr('string'),
    cpa: DS.attr('string'),
    gycx: DS.attr('string'),
    not_arrival_hosp_file: DS.attr('string'),
    yms: DS.attr('string'),
    message: DS.attr('string')
});
