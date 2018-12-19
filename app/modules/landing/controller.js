import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	landingController: service('landing_controller'),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
