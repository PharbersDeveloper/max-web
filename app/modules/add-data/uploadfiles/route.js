import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({
	uploadfiles_route: service('add_data.uploadfiles_route'),
    uploadfiles_controller: service('add_data.uploadfiles_controller'),
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
