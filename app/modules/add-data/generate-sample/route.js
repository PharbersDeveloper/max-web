import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({
	generateSampleRoute: service('add_data.generate_sample_route'),
	generateSampleController: service('add_data.generate_sample_controller'),
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
