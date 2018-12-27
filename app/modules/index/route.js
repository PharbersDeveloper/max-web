import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Route.extend({
	indexRoute: service(),
	indexController: service(),
	setupController(controller, model) {
		this._super(controller, model);
		// this.controllerFor('application')
	},
	model() {
		// 你的逻辑
	},
	actions: {
		login(username, pwd) {
			let req = this.get('indexController').createModel('request', {
					id: 'phpid',
					res: 'PhProfile',
					eqcond: A([
						this.get('indexController').createModel('eqcond', {
							id: 'equsername',
							key: 'username',
							val: username
						}),
						this.get('indexController').createModel('eqcond', {
							id: 'eqpassword',
							key: 'password',
							val: pwd
						})
					])
				}),
				result = this.get('indexRoute').object2JsonApi(req);

			this.get('indexRoute').queryObject('api/v1/maxlogin/0', 'PhAuth', result)
				.then((data) => {
					if (data.token !== '') {
						this.get('cookie').write('token', data.token, { path: '/' });
						this.transitionTo('data-center');
					}
				});
		}
	}
});
