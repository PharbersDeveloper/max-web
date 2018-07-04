import DS from 'ember-data';
// import { inject } from '@ember/service'


export default DS.RESTAdapter.extend({
    // ajax: inject(),
    // host: 'http://localhost:8080/',
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
        // return this.ajax(`${this.get('host')}api/search/history`,'POST',this.get('headOpt')(jsonObject));
        return this.ajax(`/api/search/history`,'POST',this.get('headOpt')(jsonObject));
        // return this.get('ajax').request(`/api/search/history`,this.get('headOpt')(jsonObject));
    },
});
