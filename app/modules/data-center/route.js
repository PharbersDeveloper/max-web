import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';


export default Route.extend({
	dataCenterRoute: service('data_center_route'),
	dataCenterController: service('data_center_controller'),
	setupController(controller, model) {
		this._super(controller, model);
	},
	beforeModel() {

		let previousRoute = this.controllerFor('data-center').get('previousRoute');

		if (previousRoute === 'add-data') {
			this.get('dataCenterController').removeModelByAll('Phmaxjob');
			// window.location.reload();
		}

	},
	model() {
		this.store.peekAll('PhAuth').forEach(ele => {
			localStorage.setItem('company_id', ele.Profile.Company.id);
			localStorage.setItem('username', ele.Profile.username);
			localStorage.setItem('company', ele.Profile.Company.companyname);
		});
		let user = localStorage.getItem('username'),
			comp = localStorage.getItem('company');

		return RSVP.hash({
			title: 'Pharbers 数据平台',
			company: comp,
			username: user
		});
	},
	actions: {
		// 你的动作
	}
});
