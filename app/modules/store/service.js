import DS from 'ember-data';
import { assert } from '@ember/debug';
import normalizeModelName from "../common/normalize-model-name";
import { isPresent } from '@ember/utils';

import {
  promiseArray,
  promiseObject
} from "../common/promise-proxies";

import {
  _queryObject,
  _queryMultipleObject
} from "../common/store-finders";

/**
 * 重新扩展DS.Stroe方法
 */
export default DS.Store.extend({
    // adapter:'pharbers-adapter',
    init() {
        this._super(...arguments)
        window.console.info("The Custom DS.Store Init()")
    },
    queryObject(modelName, jsonObject) {
        let normalizedModelName = normalizeModelName(modelName);
        let adapter = this.adapterFor(normalizedModelName);
        assert(`you must implement 'queryObject' in your Adapter`, typeof adapter.queryObject === 'function');
        return promiseObject(
            _queryObject(adapter, this, modelName, jsonObject)
                .then(internalModel => {
                    if(internalModel) {
                        return internalModel.getRecord();
                    }
                    return null;
        }));
    },
    queryMultipleObject(modelName, jsonObject) {
        assert(`You need to pass a model name to the store's queryMultipleObject method`, isPresent(modelName));
        assert(`You need to pass a queryMultipleObject hash to the store's queryMultipleObject method`, jsonObject);
        assert(`Passing classes to store methods has been removed. Please pass a dasherized string instead of ${modelName}`, typeof modelName === 'string');
        let normalizedModelName = normalizeModelName(modelName);
        let adapter = this.adapterFor(normalizedModelName);
        assert(`You tried to load a queryMultipleObject but your adapter does not implement 'queryMultipleObject'`, typeof adapter.queryMultipleObject === 'function');
        return promiseArray(_queryMultipleObject(adapter, this, normalizedModelName, jsonObject, undefined));
    },
});
