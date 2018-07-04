import DS from 'ember-data';
import { typeOf } from '@ember/utils';
import {
    query,
} from '../common/serializer-split';

export default DS.JSONSerializer.extend({
    primaryKey: 'id',
    normalize(modelClass, hash) {
        let data = null;
        if (hash) {
            this.normalizeUsingDeclaredMapping(modelClass, hash);

            if (typeOf(hash.links) === 'object') {
                this.normalizeUsingDeclaredMapping(modelClass, hash.links);
            } else if (typeOf(hash.result) === 'object') {
                this.normalizeUsingDeclaredMapping(modelClass, hash.result);
            }

            data = {
                id: this.extractId(modelClass, hash),
                type:   modelClass.modelName,
                attributes: this.extractAttributes(modelClass, hash),
                relationships:  this.extractRelationships(modelClass, hash)
            };
            this.applyTransforms(modelClass, data.attributes);
        }

        return { data };
    },
    normalizeResponse(store, modelClass, payload, id, requestType) {
        switch(requestType) {
            case 'queryObject':
                return query(this, modelClass, payload);
            case 'queryMultipleObject':
                window.console.warn('没有实现！');
                return null;
            default:
                return this._super(store, modelClass, payload, id, requestType);
                // return payload.reduce((documentHash, item) => {
                //     let { data, included } = this.normalize(modelClass, item);
                //     documentHash.included.push(...included);
                //     documentHash.data.push(data);
                //     return documentHash;
                // }, { data: [], included: [] });
        }
    },
    extractId(model, hash) {
        return hash.id || -1;
    }
});
