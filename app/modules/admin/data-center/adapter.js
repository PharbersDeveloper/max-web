import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	headOpt: function(query) {
		return {
			dataType: 'json',
			contentType: 'application/json,charset=utf-8',
			Accept: 'application/json,charset=utf-8',
			data: query
		}
	},
	defaultSerializer: '-default',
	queryMultipleObject(store, type, jsonObject) {
		return this.ajax(`/api/search/history`, 'POST', this.get('headOpt')(jsonObject));
	},
});