import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({
	viewresults_route: service('add_data.viewresults_route'),
	viewresults_controller: service('add_data.viewresults_route'),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	model() {
		// 你的逻辑
	},
	actions: {
		// 你的动作
	}
});
