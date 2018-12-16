import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';


export default Route.extend({
	data_center_route: service(),
	data_center_controller: service(),
	setupController(controller, model) {
		this._super(controller, model);
	},
	model() {
		let company = '';
		let username = '';
		let company_id = '';
		this.store.peekAll('PhAuth').forEach(ele => {
			company = ele.Profile.Company.companyname;
			username = ele.Profile.username;
			company_id = ele.Profile.Company.id;
			localStorage.setItem('company_id', company_id)
			localStorage.setItem('username', username);
			localStorage.setItem('company', company);
		});
		let user = localStorage.getItem('username');
		let comp = localStorage.getItem('company')
		return RSVP.hash({
			title: "Pharbers 数据平台",
			company: comp,
			username: user,
        });
	},
	actions: {
		// 你的动作
	}
});
