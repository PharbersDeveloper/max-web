import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({
	applicationRoute: service('application_route'),
	applicationController: service('application_controller'),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	beforeModel(transition) {
		let token = this.get('cookie').read('token'),
			loginController = this.controllerFor('index');

		if (!token) {
			if (transition.targetName !== 'index') {
				loginController.set('previousTransition', transition);
			}
			this.transitionTo('index');
		}
	},
	model() {
		// 你的逻辑
	},
	actions: {
		// 你的动作
	}
});
