import PharbersSerializer from 'pharbers-route-addon/serializer/phserializer';
import { dasherize, classify } from '@ember/string';
import { set } from '@ember/object';
/**
 * 所有的Serializer都要继承phserializer
 * 数据有特殊需求直接在normalizeResponse自己修改
 * @type {String}
 */
export default PharbersSerializer.extend({
	primaryKey: 'id',
	keyForAttribute(key) {
		return key;
	},
	keyForRelationship(key, typeClass) {
		console.log(key);
		console.log('----------')
		return classify(key);
	},
	serializeHasMany(snapshot, json, relationship) {
		// var key = relationship.key;
		// set(relationship, 'type', classify(key));
		// set(relationship, 'key', classify(key));
		// return relationship;
	},
	payloadKeyFromModelName(modelName) {
		return classify(modelName);
	},
	modelNameFromPayloadKey(modelName) {
		return modelName.toLowerCase();
		// return dasherize(modelName);
	},
	normalizeResponse(store, model, payload) {
		this._super(...arguments);
		console.log(payload);
		return payload;
	},
});
