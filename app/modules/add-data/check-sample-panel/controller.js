import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	check_sample_panel_controller: service('add_data.check_sample_panel_controller'),
	init() {
		this._super(...arguments);
	},
	actions: {

	}
});
