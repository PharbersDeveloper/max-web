import DS from 'ember-data';

export default DS.Model.extend({
    user_id: DS.attr('string'),
    company_id: DS.attr('string'),
    job_id: DS.attr('string'),
    call: DS.attr('string'),
    message: DS.attr('string'),
    percentage: DS.attr(''),
});
