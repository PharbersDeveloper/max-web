import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	indexController: service('index_controller'),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
