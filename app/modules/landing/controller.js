import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	landing_controller: service(),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
