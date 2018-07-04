import DS from 'ember-data';

export default DS.JSONSerializer.extend({
    normalizeResponse(store, model, payload, id, requestType) {
        switch(requestType) {
            case 'queryObject':
                return this.normalizeQueryRecordResponse(...arguments);
            case 'queryMultipleObject':
                return this.normalizeQueryResponse(...arguments);
            default:
                return this._super(...arguments);
        }
    }
})
