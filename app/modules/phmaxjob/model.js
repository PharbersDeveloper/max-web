import DS from 'ember-data';

export default DS.Model.extend({
    user_id: DS.attr('string'),
    company_id: DS.attr('string'),
    job_id: DS.attr('string'),
    call: DS.attr('string'),
    date: DS.attr('string'),
    args: DS.attr(),
});
