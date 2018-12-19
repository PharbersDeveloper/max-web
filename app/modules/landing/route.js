import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Route.extend({
	landingRoute: service('landing_route'),
	landingController: service('landing_controller'),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	model() {
		// 你的逻辑
	},
	actions: {
		// 你的动作
		login(username, pwd) {
			let req = this.get('landingController').createModel('request', {
					id: 'phpid',
					res: 'PhProfile',
					eqcond: A([
						this.get('landingController').createModel('eqcond', {
							id: 'equsername',
							key: 'username',
							val: username
						}),
						this.get('landingController').createModel('eqcond', {
							id: 'eqpassword',
							key: 'password',
							val: pwd
						})
					])
				}),
				result = this.get('landingRoute').object2JsonApi(req);

			this.get('landingRoute').queryObject('api/v1/maxlogin/0', 'PhAuth', result)
				.then((data) => {
					if (data.token !== '') {
						this.get('cookie').write('token', data.token, { path: '/' });
						this.transitionTo('data-center');
					}
				});
		}
	}
});
