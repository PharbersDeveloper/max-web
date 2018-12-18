import DS from 'ember-data';

export default DS.Model.extend({
	'job_id': DS.attr('string'),
	'company_id': DS.attr('string'),
	'ym_list': DS.attr(),
	'mkt_list': DS.attr()
});