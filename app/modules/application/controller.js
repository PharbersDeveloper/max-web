import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	applicationController: service('application_controller'),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
