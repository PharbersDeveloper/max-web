import Controller from '@ember/controller';
import rsvp from 'rsvp';
const { keys } = Object;

export default Controller.extend({

	actions: {
		backDC() {
			let company = localStorage.getItem('company'),
				companyId = localStorage.getItem('company_id'),
				userName = localStorage.getItem('username'),
				token = this.get('cookie').read('token'),
				cookie = this.get('cookie');


			new rsvp.Promise((resolve) => {
				keys(cookie.read()).forEach(item => {
					cookie.cleans(item)({ path: '/' });
				});
				localStorage.clear();
				localStorage.setItem('company', company);
				localStorage.setItem('company_id', companyId);
				localStorage.setItem('username', userName);
				cookie.write('token', token, { path: '/' });
				return resolve(true);
			}).then(() => {
				this.transitionToRoute('data-center');
			});
		}
	}
});
