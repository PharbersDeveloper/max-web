import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import XMPPMixin from '../common/xmpp-message-object/XMPPMixin';

export default Route.extend(XMPPMixin, {
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
						this.get('cookie').write('process', data.Profile.Company.process, { path: '/' });
						localStorage.setItem('company_id', data.Profile.Company.id);
						localStorage.setItem('username', data.Profile.username);
						localStorage.setItem('company', data.Profile.Company.companyname);
						this.store.adapterFor('application').headers.Authorization = `bearer ${data.get('token')}`;
						this.xmppCallBack(this.controllerFor('index'));
						this.transitionTo('data-center');
					}
				})
				.catch(errors => {
					let hint = {},
						error = errors.errors;

					hint = {
						hintModal: true,
						hintImg: true,
						title: '提示',
						content: error[0].title,
						hintBtn: true
					};
					this.controller.set('hint', hint);
				});
		}
	}
});
