import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		let company = '';
		let username = '';
		let company_id = '';
		this.store.peekAll('phauth').forEach(ele => {
			company = ele.profile.company.companyname;
			username = ele.profile.username;
			company_id = ele.profile.company.id;
			localStorage.setItem('company_id', company_id)
			localStorage.setItem('username', username);
			localStorage.setItem('company', company);
		});
		let user = localStorage.getItem('username');
		let comp = localStorage.getItem('company')
		// this.controllerFor('data-center').set('data',{company: company,username: "bbb"})
		return RSVP.hash({
			title: "Pharbers 数据平台",
			company: comp,
			username: user,
		});
		// this.startDate = new Date('2018-01');
		// this.endDate = new Date();
	}
});
