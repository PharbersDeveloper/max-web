import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	generateSampleController: service('add_data.generate_sample_controller'),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
