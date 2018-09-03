import PharbersSerializer from 'pharbers-route-addon/serializer/phserializer';

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
	normalizeResponse(store, model, payload) {
		this._super(...arguments);
		return payload;
	},
});
