import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	generate_sample_controller: service('add_data.generate_sample_controller'),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
